/* [002] 墨 SUMI — 流体シミュレーション（2026-08-18）
 *
 * なぜこれを書いたか：
 *   [001] 凛は単一パスのレイマーチングで、1コマが時刻tだけで決まった。
 *   墨は違う。いま広がっている形は「さっきまでどう広がったか」で決まる。
 *   履歴を持つものは、1枚の絵では絶対に語れない。だから流体を毎コマ解く。
 *
 * 解いているもの（非圧縮ナビエ・ストークス）:
 *   1. 速度の移流    … 速度場じたいを速度で運ぶ
 *   2. 力の追加      … 墨を落とす（時刻表どおり）
 *   3. 発散の計算    … どこで湧き出し・吸い込みが起きているか
 *   4. 圧力の反復解法 … ヤコビ法 24回
 *   5. 勾配の差し引き … 非圧縮（体積が増えも減りもしない）にする
 *   6. 濃度の移流    … 墨そのものを運ぶ
 *
 * 決定論：時刻を wall-clock から取らず、固定 dt を step() ごとに進める。
 *         同じコマ数だけ回せば、いつ実行しても必ず同じ絵になる（撮影に必要）。
 */
(function (global) {
  'use strict';

  var VS = '#version 300 es\nin vec2 p;out vec2 uv;void main(){uv=p*0.5+0.5;gl_Position=vec4(p,0.,1.);}';

  // ---- 共通の断片シェーダー群 -------------------------------------------
  var HEAD = '#version 300 es\nprecision highp float;precision highp sampler2D;\nin vec2 uv;out vec4 o;uniform vec2 uTexel;\n';

  var F_ADVECT = HEAD +
    'uniform sampler2D uVel,uSrc;uniform float uDt,uDiss;' +
    'void main(){' +
    // 半ラグランジュ法：この地点にいる粒は、dt前どこにいたか
    '  vec2 back = uv - uDt * texture(uVel,uv).xy * uTexel;' +
    '  o = texture(uSrc, back) * uDiss;' +
    '}';

  var F_SPLAT = HEAD +
    'uniform sampler2D uSrc;uniform vec2 uPoint;uniform vec3 uValue;uniform float uRadius,uAspect;' +
    'void main(){' +
    '  vec2 d = uv - uPoint; d.x *= uAspect;' +
    '  float f = exp(-dot(d,d) / uRadius);' +
    '  o = vec4(texture(uSrc,uv).xyz + uValue * f, 1.0);' +
    '}';

  var F_DIV = HEAD +
    'uniform sampler2D uVel;' +
    'void main(){' +
    '  float l = texture(uVel, uv - vec2(uTexel.x,0.)).x;' +
    '  float r = texture(uVel, uv + vec2(uTexel.x,0.)).x;' +
    '  float b = texture(uVel, uv - vec2(0.,uTexel.y)).y;' +
    '  float t = texture(uVel, uv + vec2(0.,uTexel.y)).y;' +
    '  o = vec4(0.5*(r-l+t-b), 0., 0., 1.);' +
    '}';

  var F_JACOBI = HEAD +
    'uniform sampler2D uPres,uDiv;' +
    'void main(){' +
    '  float l = texture(uPres, uv - vec2(uTexel.x,0.)).x;' +
    '  float r = texture(uPres, uv + vec2(uTexel.x,0.)).x;' +
    '  float b = texture(uPres, uv - vec2(0.,uTexel.y)).x;' +
    '  float t = texture(uPres, uv + vec2(0.,uTexel.y)).x;' +
    '  o = vec4((l+r+b+t - texture(uDiv,uv).x) * 0.25, 0., 0., 1.);' +
    '}';

  var F_GRAD = HEAD +
    'uniform sampler2D uPres,uVel;' +
    'void main(){' +
    '  float l = texture(uPres, uv - vec2(uTexel.x,0.)).x;' +
    '  float r = texture(uPres, uv + vec2(uTexel.x,0.)).x;' +
    '  float b = texture(uPres, uv - vec2(0.,uTexel.y)).x;' +
    '  float t = texture(uPres, uv + vec2(0.,uTexel.y)).x;' +
    '  vec2 v = texture(uVel,uv).xy - vec2(r-l, t-b);' +
    // ふちで跳ね返らせない（外へ抜ける）
    '  vec2 e = step(uTexel, uv) * step(uv, 1.0 - uTexel);' +
    '  o = vec4(v * e.x * e.y, 0., 1.);' +
    '}';

  // 渦の維持：粘性で消える細かい渦を、その渦自身の向きに押し返して残す。
  // これが無いと、墨のふちがのっぺりした丸になり、和紙のにじみに見えない。
  var F_VORT = HEAD +
    'uniform sampler2D uVel;uniform float uAmt,uDt;' +
    'float curl(vec2 c){' +
    '  float t = texture(uVel, c + vec2(0.,uTexel.y)).x;' +
    '  float b = texture(uVel, c - vec2(0.,uTexel.y)).x;' +
    '  float r = texture(uVel, c + vec2(uTexel.x,0.)).y;' +
    '  float l = texture(uVel, c - vec2(uTexel.x,0.)).y;' +
    '  return 0.5*((r-l)-(t-b));' +
    '}' +
    'void main(){' +
    '  float c = curl(uv);' +
    '  float cl = abs(curl(uv - vec2(uTexel.x,0.)));' +
    '  float cr = abs(curl(uv + vec2(uTexel.x,0.)));' +
    '  float cb = abs(curl(uv - vec2(0.,uTexel.y)));' +
    '  float ct = abs(curl(uv + vec2(0.,uTexel.y)));' +
    '  vec2 g = vec2(cr-cl, ct-cb) * 0.5;' +
    '  g /= (length(g) + 1e-5);' +
    '  vec2 f = vec2(g.y, -g.x) * c * uAmt;' +
    '  o = vec4(texture(uVel,uv).xy + f * uDt, 0., 1.);' +
    '}';

  function Fluid(gl, opts) {
    this.gl = gl;
    this.simW = opts.simW || 256;
    this.simH = opts.simH || 256;
    this.dyeW = opts.dyeW || 512;
    this.dyeH = opts.dyeH || 512;
    this.dt = opts.dt || (1 / 60);
    this.iter = opts.iter || 24;
    this.frame = 0;
    this._init();
  }

  Fluid.prototype._compile = function (fs) {
    var gl = this.gl;
    function sh(t, src) {
      var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src);
      return s;
    }
    var p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'p');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var nm = gl.getActiveUniform(p, i).name; u[nm] = gl.getUniformLocation(p, nm); }
    return { p: p, u: u };
  };

  Fluid.prototype._fbo = function (w, h, internal, format, type) {
    var gl = this.gl;
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var self = this;
    return {
      tex: tex, fb: fb, w: w, h: h,
      texel: [1 / w, 1 / h],
      bind: function (unit) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); return unit; }
    };
  };

  Fluid.prototype._pair = function (w, h, internal, format, type) {
    var a = this._fbo(w, h, internal, format, type), b = this._fbo(w, h, internal, format, type);
    return {
      read: a, write: b, texel: a.texel, w: w, h: h,
      swap: function () { var t = this.read; this.read = this.write; this.write = t; }
    };
  };

  Fluid.prototype._init = function () {
    var gl = this.gl;
    if (!gl.getExtension('EXT_color_buffer_float')) throw new Error('float FBO 非対応');
    gl.getExtension('OES_texture_float_linear');

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.pAdvect = this._compile(F_ADVECT);
    this.pSplat = this._compile(F_SPLAT);
    this.pDiv = this._compile(F_DIV);
    this.pJacobi = this._compile(F_JACOBI);
    this.pGrad = this._compile(F_GRAD);
    this.pVort = this._compile(F_VORT);

    var RG = gl.RG16F, RGBA = gl.RGBA16F, R = gl.R16F;
    this.vel = this._pair(this.simW, this.simH, RG, gl.RG, gl.HALF_FLOAT);
    this.dye = this._pair(this.dyeW, this.dyeH, RGBA, gl.RGBA, gl.HALF_FLOAT);
    this.div = this._fbo(this.simW, this.simH, R, gl.RED, gl.HALF_FLOAT);
    this.pres = this._pair(this.simW, this.simH, R, gl.RED, gl.HALF_FLOAT);
  };

  Fluid.prototype._to = function (target) {
    var gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb);
    gl.viewport(0, 0, target.w, target.h);
  };

  Fluid.prototype._draw = function () { this.gl.drawArrays(this.gl.TRIANGLES, 0, 3); };

  /* 墨を1滴落とす。x,y は 0..1 */
  Fluid.prototype.splat = function (x, y, dx, dy, amount) {
    var gl = this.gl, s = this.pSplat;
    var aspect = this.dyeW / this.dyeH;

    gl.useProgram(s.p);
    gl.uniform2f(s.u.uTexel, this.vel.texel[0], this.vel.texel[1]);
    gl.uniform1i(s.u.uSrc, this.vel.read.bind(0));
    gl.uniform2f(s.u.uPoint, x, y);
    gl.uniform3f(s.u.uValue, dx, dy, 0);
    gl.uniform1f(s.u.uRadius, 0.00060);
    gl.uniform1f(s.u.uAspect, aspect);
    this._to(this.vel.write); this._draw(); this.vel.swap();

    gl.uniform2f(s.u.uTexel, this.dye.texel[0], this.dye.texel[1]);
    gl.uniform1i(s.u.uSrc, this.dye.read.bind(0));
    gl.uniform3f(s.u.uValue, amount, amount, amount);
    // 墨は「一滴の塊」で落ちる。点が小さすぎると煙になり、墨に見えない（2026-08-18 初稿の失敗）
    gl.uniform1f(s.u.uRadius, 0.00045);
    this._to(this.dye.write); this._draw(); this.dye.swap();
  };

  /* 固定 dt で1コマ進める（決定論） */
  Fluid.prototype.step = function () {
    var gl = this.gl, dt = this.dt;

    // 渦の維持
    var v = this.pVort;
    gl.useProgram(v.p);
    gl.uniform2f(v.u.uTexel, this.vel.texel[0], this.vel.texel[1]);
    gl.uniform1i(v.u.uVel, this.vel.read.bind(0));
    // 渦を強くしすぎると煙になる。墨は「塊が崩れながら広がる」ので弱めに
    gl.uniform1f(v.u.uAmt, 8.0);
    gl.uniform1f(v.u.uDt, dt);
    this._to(this.vel.write); this._draw(); this.vel.swap();

    // 速度の移流
    var a = this.pAdvect;
    gl.useProgram(a.p);
    gl.uniform2f(a.u.uTexel, this.vel.texel[0], this.vel.texel[1]);
    gl.uniform1f(a.u.uDt, dt * this.simW);
    gl.uniform1i(a.u.uVel, this.vel.read.bind(0));
    gl.uniform1i(a.u.uSrc, this.vel.read.bind(0));
    gl.uniform1f(a.u.uDiss, 0.9975);
    this._to(this.vel.write); this._draw(); this.vel.swap();

    // 発散
    var d = this.pDiv;
    gl.useProgram(d.p);
    gl.uniform2f(d.u.uTexel, this.vel.texel[0], this.vel.texel[1]);
    gl.uniform1i(d.u.uVel, this.vel.read.bind(0));
    this._to(this.div); this._draw();

    // 圧力（ヤコビ反復）
    var j = this.pJacobi;
    gl.useProgram(j.p);
    gl.uniform2f(j.u.uTexel, this.vel.texel[0], this.vel.texel[1]);
    gl.uniform1i(j.u.uDiv, this.div.bind(1));
    for (var i = 0; i < this.iter; i++) {
      gl.uniform1i(j.u.uPres, this.pres.read.bind(0));
      this._to(this.pres.write); this._draw(); this.pres.swap();
    }

    // 勾配を引いて非圧縮に
    var g = this.pGrad;
    gl.useProgram(g.p);
    gl.uniform2f(g.u.uTexel, this.vel.texel[0], this.vel.texel[1]);
    gl.uniform1i(g.u.uPres, this.pres.read.bind(0));
    gl.uniform1i(g.u.uVel, this.vel.read.bind(1));
    this._to(this.vel.write); this._draw(); this.vel.swap();

    // 墨そのものを運ぶ（にじみは消えないので減衰はごく僅か）
    gl.useProgram(a.p);
    gl.uniform2f(a.u.uTexel, this.dye.texel[0], this.dye.texel[1]);
    gl.uniform1f(a.u.uDt, dt * this.simW);
    gl.uniform1i(a.u.uVel, this.vel.read.bind(0));
    gl.uniform1i(a.u.uSrc, this.dye.read.bind(1));
    // 墨は薄まらない。紙に残る前提なので、ほぼ減衰させない
    gl.uniform1f(a.u.uDiss, 0.99975);
    this._to(this.dye.write); this._draw(); this.dye.swap();

    this.frame++;
  };

  global.Fluid = Fluid;
})(window);
