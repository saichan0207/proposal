// 12場面の挿絵（手描きSVG・同じ絵柄でそろえる）。viewBox 320x150、背景は絵ごとの空/壁の色
(function(){
const SK='#f1c39b', SK2='#c98e5f', INK='#24323d';
// 人：x=足元の中心, y=地面, c=服の色, s=肌, h=髪, f=向き(1/-1), arm=腕の形
const P=(x,y,c,s=SK,h=INK,f=1,arm='')=>`<g transform="translate(${x} ${y}) scale(${f} 1)">
 <rect x="-9" y="-30" width="7" height="30" rx="3" fill="#3d4f63"/><rect x="2" y="-30" width="7" height="30" rx="3" fill="#3d4f63"/>
 <rect x="-13" y="-62" width="26" height="36" rx="11" fill="${c}"/>${arm}
 <circle cx="0" cy="-73" r="11" fill="${s}"/><path d="M-11-75a11 11 0 0 1 22 0q-5-6-11-6t-11 6z" fill="${h}"/>
 <circle cx="4" cy="-73" r="1.4" fill="${INK}"/></g>`;
const armUp='<path d="M10-56q12-10 12-24" stroke="'+SK+'" stroke-width="6" stroke-linecap="round" fill="none"/>';
const armFwd='<path d="M10-54q10 4 18 2" stroke="'+SK+'" stroke-width="6" stroke-linecap="round" fill="none"/>';
const bub=(x,y,w=30,fill='#fff')=>`<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${w}" height="20" rx="10" fill="${fill}"/><path d="M8 18l-4 8 10-7z" fill="${fill}"/><circle cx="${w/2-7}" cy="10" r="2.2" fill="${INK}"/><circle cx="${w/2}" cy="10" r="2.2" fill="${INK}"/><circle cx="${w/2+7}" cy="10" r="2.2" fill="${INK}"/></g>`;
const svg=(bg,body)=>`<svg viewBox="0 0 320 150" role="img" aria-hidden="true"><rect width="320" height="150" fill="${bg}"/>${body}</svg>`;
const house=(x,c,r)=>`<g transform="translate(${x} 0)"><rect x="0" y="58" width="74" height="58" fill="${c}"/><path d="M-6 60l43-30 43 30z" fill="${r}"/><rect x="30" y="86" width="15" height="30" fill="#8a5a3c"/><rect x="8" y="70" width="15" height="13" fill="#cfe6f2"/><rect x="52" y="70" width="15" height="13" fill="#cfe6f2"/></g>`;
window.ILLUST=[
// 0 あいさつ・立ち話：郊外の家と芝生、手をふる2人
svg('#cfe7f5',`<circle cx="280" cy="28" r="14" fill="#ffd66b"/>${house(18,'#efe2cc','#b4663e')}${house(222,'#dfe8d6','#4f6d8a')}
<rect y="116" width="320" height="34" fill="#8cc47a"/><rect y="124" width="320" height="10" fill="#d9d4c7"/>
${P(134,128,'#2f56c9',SK,INK,1,'<path d="M-10-56q-12-10-12-24" stroke="'+SK+'" stroke-width="6" stroke-linecap="round" fill="none"/>')}${P(188,128,'#e0793b',SK2,'#5a3b28',-1,'<path d="M-10-56q-12-10-12-24" stroke="'+SK2+'" stroke-width="6" stroke-linecap="round" fill="none"/>')}${bub(124,22)}${bub(172,30,30,'#fff7e6')}`),
// 1 カフェ：カウンター、エスプレッソマシン、持ち帰りカップ
svg('#f2e6d8',`<rect x="20" y="22" width="120" height="40" rx="6" fill="#3b4a40"/><g fill="#e9dcc4"><rect x="30" y="32" width="50" height="4" rx="2"/><rect x="30" y="42" width="70" height="4" rx="2"/><rect x="30" y="52" width="40" height="4" rx="2"/></g>
${P(96,104,'#2f6a4a',SK,'#3a2a20',1,armFwd)}
<rect x="0" y="104" width="320" height="46" fill="#a26b45"/><rect x="0" y="100" width="320" height="8" fill="#7b4e31"/>
<rect x="150" y="60" width="54" height="40" rx="6" fill="#9aa7b0"/><rect x="160" y="70" width="34" height="10" rx="3" fill="#4a5863"/><rect x="172" y="84" width="10" height="14" fill="#4a5863"/>
<g transform="translate(232 62)"><path d="M0 8h26l-3 32H3z" fill="#fff"/><rect x="-2" y="2" width="30" height="8" rx="3" fill="#2f6a4a"/><rect x="2" y="18" width="22" height="10" fill="#c79a6b"/></g>
<g transform="translate(270 70)"><path d="M0 6h20l-2 24H2z" fill="#fff"/><rect x="-2" y="1" width="24" height="6" rx="3" fill="#e0793b"/></g>`),
// 2 レストラン：テーブル、タコスの皿、グラス、伝票を持つ店員
svg('#f6e3cf',`<rect x="22" y="18" width="60" height="44" rx="4" fill="#e7c9a6"/><path d="M32 52l14-20 10 12 8-8 10 16z" fill="#c98e5f"/>
${P(250,128,'#24323d',SK,'#5a3b28',-1,'<rect x="-30" y="-58" width="16" height="20" rx="2" fill="#fff" transform="rotate(-8)"/><path d="M-10-54q-8 4-14 6" stroke="'+SK+'" stroke-width="6" stroke-linecap="round" fill="none"/>')}
<rect x="40" y="96" width="170" height="10" rx="4" fill="#7b4e31"/><rect x="60" y="106" width="8" height="40" fill="#5c3a25"/><rect x="182" y="106" width="8" height="40" fill="#5c3a25"/>
<ellipse cx="92" cy="94" rx="30" ry="6" fill="#fff"/><g transform="translate(76 78)"><path d="M0 14a16 14 0 0 1 32 0z" fill="#f2c14e"/><path d="M4 12q12-10 24 0" stroke="#5aa25a" stroke-width="4" fill="none"/><path d="M8 9q8-5 16 0" stroke="#d94b3d" stroke-width="3" fill="none"/></g>
<ellipse cx="160" cy="94" rx="26" ry="6" fill="#fff"/><path d="M146 92q14-14 28 0z" fill="#e0793b"/>
<rect x="120" y="70" width="12" height="24" rx="3" fill="#cfe6f2" opacity=".9"/><rect x="193" y="72" width="12" height="22" rx="3" fill="#cfe6f2" opacity=".9"/>`),
// 3 スーパー：棚の通路、カート
svg('#eef1ef',`${[0,1,2].map(r=>`<rect x="10" y="${24+r*30}" width="130" height="6" fill="#9aa7b0"/>`).join('')}
${Array.from({length:21},(_,i)=>`<rect x="${14+(i%7)*18}" y="${8+Math.floor(i/7)*30}" width="14" height="16" rx="2" fill="${['#e0793b','#2f56c9','#f2c14e','#5aa25a','#d94b3d','#8b6bbf','#2fa3a3'][(i*3)%7]}"/>`).join('')}
<rect x="180" y="20" width="130" height="6" fill="#9aa7b0"/><rect x="180" y="50" width="130" height="6" fill="#9aa7b0"/>
${Array.from({length:12},(_,i)=>`<rect x="${184+(i%6)*21}" y="${5+Math.floor(i/6)*30}" width="17" height="15" rx="7" fill="${['#f2c14e','#5aa25a','#d94b3d','#e0793b'][i%4]}"/>`).join('')}
<rect y="120" width="320" height="30" fill="#d9ded8"/>
<g transform="translate(200 76)"><path d="M0 0h10l8 36h50l8-26H16" stroke="#4a5863" stroke-width="5" fill="none" stroke-linejoin="round"/><rect x="22" y="14" width="50" height="18" rx="3" fill="#2f56c9"/><rect x="28" y="6" width="14" height="10" fill="#f2c14e"/><rect x="46" y="4" width="12" height="12" fill="#5aa25a"/><circle cx="26" cy="46" r="5" fill="#24323d"/><circle cx="62" cy="46" r="5" fill="#24323d"/></g>
${P(150,128,'#d94b3d',SK2,INK,1,armFwd)}`),
// 4 買い物・返品：ハンガーラック、紙袋、レシート
svg('#f3ece6',`<rect x="20" y="20" width="160" height="5" rx="2" fill="#4a5863"/><rect x="24" y="22" width="5" height="110" fill="#4a5863"/><rect x="171" y="22" width="5" height="110" fill="#4a5863"/>
${['#2f56c9','#e0793b','#f2c14e','#5aa25a','#d94b3d','#8b6bbf'].map((c,i)=>`<g transform="translate(${44+i*22} 24)"><path d="M0 0v6M-10 10l10-4 10 4" stroke="#4a5863" stroke-width="2" fill="none"/><path d="M-11 10h22v46h-22z" fill="${c}"/><path d="M-11 10l-6 12 6 3M11 10l6 12-6 3" fill="${c}"/></g>`).join('')}
<rect y="132" width="320" height="18" fill="#d8cfc6"/>
<g transform="translate(212 74)"><rect x="0" y="12" width="52" height="58" rx="3" fill="#c79a6b"/><path d="M14 12a12 12 0 0 1 24 0" stroke="#7b4e31" stroke-width="4" fill="none"/></g>
<g transform="translate(276 66) rotate(8)"><path d="M0 0h28v54l-4-3-4 3-4-3-4 3-4-3-4 3-4-3z" fill="#fff"/><g fill="#b8c2ca"><rect x="5" y="8" width="18" height="3"/><rect x="5" y="16" width="14" height="3"/><rect x="5" y="24" width="18" height="3"/><rect x="5" y="36" width="10" height="4" fill="#24323d"/></g></g>`),
// 5 車・道：まっすぐな道、車、信号、ガソリンスタンド
svg('#bfe0f5',`<circle cx="44" cy="30" r="14" fill="#ffd66b"/><rect y="78" width="320" height="72" fill="#9fcf87"/>
<path d="M120 150L150 78h20l30 72z" fill="#5d6a74"/><path d="M158 82v8M158 98v12M158 120v16" stroke="#f2c14e" stroke-width="3"/>
<g transform="translate(152 116)"><rect x="-22" y="-14" width="44" height="18" rx="7" fill="#d94b3d"/><path d="M-14-14l6-10h18l6 10z" fill="#d94b3d"/><rect x="-10" y="-22" width="20" height="8" fill="#cfe6f2"/><circle cx="-12" cy="5" r="5" fill="#24323d"/><circle cx="12" cy="5" r="5" fill="#24323d"/></g>
<g transform="translate(88 40)"><rect x="0" y="0" width="5" height="70" fill="#4a5863"/><rect x="-8" y="-4" width="22" height="46" rx="5" fill="#24323d"/><circle cx="3" cy="6" r="5" fill="#5b2a26"/><circle cx="3" cy="19" r="5" fill="#5a4a22"/><circle cx="3" cy="32" r="5" fill="#57d38a"/></g>
<g transform="translate(232 44)"><rect x="-10" y="0" width="86" height="8" fill="#d94b3d"/><rect x="-4" y="8" width="6" height="30" fill="#9aa7b0"/><rect x="62" y="8" width="6" height="30" fill="#9aa7b0"/><rect x="22" y="18" width="20" height="26" rx="3" fill="#2f56c9"/><rect x="26" y="22" width="12" height="8" fill="#cfe6f2"/><path d="M42 30q8 0 8 10" stroke="#24323d" stroke-width="2" fill="none"/></g>`),
// 6 病院・薬局：十字のマーク、薬びん、体温計、問診票
svg('#e3f0f0',`<rect x="22" y="22" width="44" height="44" rx="10" fill="#fff"/><path d="M38 30h12v10h10v12H50v10H38V52H28V40h10z" fill="#d94b3d"/>
<rect y="108" width="320" height="42" fill="#b9d3d6"/><rect x="90" y="84" width="210" height="26" rx="4" fill="#fff"/>
<g transform="translate(110 46)"><rect x="0" y="10" width="26" height="38" rx="5" fill="#e0793b"/><rect x="-2" y="2" width="30" height="10" rx="3" fill="#fff"/><rect x="4" y="22" width="18" height="14" rx="2" fill="#fff"/></g>
<g transform="translate(150 60)"><ellipse cx="9" cy="16" rx="11" ry="6" fill="#2f56c9"/><ellipse cx="25" cy="16" rx="11" ry="6" fill="#fff"/></g>
<g transform="translate(196 38) rotate(30)"><rect x="0" y="0" width="8" height="46" rx="4" fill="#fff" stroke="#9aa7b0" stroke-width="2"/><rect x="2" y="22" width="4" height="20" fill="#d94b3d"/><circle cx="4" cy="44" r="5" fill="#d94b3d"/></g>
<g transform="translate(236 26)"><rect x="0" y="6" width="46" height="56" rx="3" fill="#fff" stroke="#9aa7b0" stroke-width="2"/><rect x="14" y="0" width="18" height="10" rx="3" fill="#4a5863"/><g fill="#b8c2ca"><rect x="8" y="20" width="30" height="3"/><rect x="8" y="30" width="24" height="3"/><rect x="8" y="40" width="30" height="3"/></g><path d="M8 50l4 4 8-8" stroke="#1f7a4f" stroke-width="3" fill="none"/></g>
${P(300,130,'#2fa3a3',SK2,INK,-1,'')}`),
// 7 銀行：柱の建物、カード、用紙とペン
svg('#e8ecf3',`<path d="M20 44l70-28 70 28z" fill="#4f6d8a"/><rect x="26" y="44" width="128" height="8" fill="#6f87a0"/>
${[0,1,2,3].map(i=>`<rect x="${36+i*30}" y="54" width="12" height="56" fill="#fff"/>`).join('')}<rect x="20" y="110" width="140" height="10" fill="#6f87a0"/>
<rect y="120" width="320" height="30" fill="#cfd6e0"/>
<g transform="translate(184 34) rotate(-6)"><rect width="78" height="96" rx="4" fill="#fff"/><g fill="#b8c2ca"><rect x="10" y="14" width="56" height="4"/><rect x="10" y="30" width="44" height="4"/><rect x="10" y="46" width="56" height="4"/><rect x="10" y="62" width="30" height="4"/></g><path d="M10 82q10-10 18 0t18-2" stroke="#2f56c9" stroke-width="2.5" fill="none"/></g>
<g transform="translate(262 50) rotate(30)"><rect x="0" y="0" width="7" height="60" rx="3" fill="#24323d"/><path d="M0 60l3.5 10 3.5-10z" fill="#f2c14e"/></g>
<g transform="translate(244 112) rotate(-10)"><rect width="56" height="34" rx="5" fill="#2f56c9"/><rect x="8" y="8" width="12" height="9" rx="2" fill="#f2c14e"/><rect x="8" y="24" width="38" height="3" fill="#cfe0ff"/></g>`),
// 8 家・ご近所：ポーチのある家、エアコンの室外機、荷物、ゴミ箱
svg('#cfe7f5',`<circle cx="292" cy="26" r="13" fill="#ffd66b"/><rect x="40" y="52" width="150" height="74" fill="#f0e6d6"/><path d="M28 56l87-38 87 38z" fill="#7a8fa6"/>
<rect x="50" y="88" width="130" height="5" fill="#fff"/><rect x="56" y="92" width="5" height="34" fill="#fff"/><rect x="170" y="92" width="5" height="34" fill="#fff"/>
<rect x="104" y="92" width="22" height="34" fill="#4f6d8a"/><rect x="66" y="64" width="22" height="18" fill="#cfe6f2"/><rect x="142" y="64" width="22" height="18" fill="#cfe6f2"/>
<rect y="126" width="320" height="24" fill="#8cc47a"/>
<g transform="translate(198 98)"><rect width="40" height="30" rx="3" fill="#9aa7b0"/><circle cx="18" cy="15" r="11" fill="#4a5863"/><path d="M18 6v18M9 15h18M12 9l12 12M24 9L12 21" stroke="#9aa7b0" stroke-width="2"/></g>
<g transform="translate(126 112)"><rect width="26" height="18" fill="#c79a6b"/><rect x="11" width="4" height="18" fill="#e9d2a8"/></g>
<g transform="translate(262 88)"><rect x="0" y="6" width="28" height="40" rx="3" fill="#2f6a4a"/><rect x="-3" y="0" width="34" height="8" rx="3" fill="#24503a"/><circle cx="6" cy="46" r="4" fill="#24323d"/></g>`),
// 9 電話・予約：大きなスマホの通話画面、カレンダー
svg('#efe8f6',`<g transform="translate(110 10)"><rect width="72" height="134" rx="12" fill="#24323d"/><rect x="5" y="10" width="62" height="114" rx="6" fill="#f7f4fb"/>
<circle cx="36" cy="44" r="16" fill="#cbbbe6"/><circle cx="36" cy="40" r="6" fill="#fff"/><path d="M24 54a12 9 0 0 1 24 0z" fill="#fff"/>
<rect x="18" y="68" width="36" height="5" rx="2" fill="#b8c2ca"/><circle cx="22" cy="104" r="9" fill="#d94b3d"/><circle cx="50" cy="104" r="9" fill="#1f7a4f"/>
<path d="M46 100q4 6 8 8" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M18 104h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>
<path d="M196 50q12 16 0 32M206 42q20 24 0 48" stroke="#8b6bbf" stroke-width="4" fill="none" stroke-linecap="round"/>
<g transform="translate(232 40)"><rect width="66" height="70" rx="5" fill="#fff"/><rect width="66" height="16" rx="5" fill="#d94b3d"/>${Array.from({length:12},(_,i)=>`<rect x="${7+(i%4)*14}" y="${24+Math.floor(i/4)*14}" width="10" height="9" rx="2" fill="${i===6?'#2f56c9':'#dfe3ea'}"/>`).join('')}</g>
<g transform="translate(26 48)"><rect width="56" height="40" rx="6" fill="#fff"/><path d="M10 40l-4 12 14-12z" fill="#fff"/><circle cx="16" cy="20" r="3" fill="${INK}"/><circle cx="28" cy="20" r="3" fill="${INK}"/><circle cx="40" cy="20" r="3" fill="${INK}"/></g>`),
// 10 困ったとき：スマホを持つ人と、道を指さす人、はてなの吹き出し
svg('#f4ecd9',`<rect y="122" width="320" height="28" fill="#d9cdb4"/><rect x="0" y="30" width="90" height="92" fill="#e6dac2"/><rect x="230" y="20" width="90" height="102" fill="#e6dac2"/>
${[0,1].map(i=>`<rect x="${14+i*40}" y="${44}" width="24" height="26" fill="#cfe6f2"/>`).join('')}${[0,1].map(i=>`<rect x="${244+i*40}" y="${36}" width="24" height="26" fill="#cfe6f2"/>`).join('')}
${P(130,128,'#2f56c9',SK,INK,1,'<rect x="10" y="-60" width="9" height="15" rx="2" fill="#24323d"/><path d="M8-48q6 0 8-4" stroke="'+SK+'" stroke-width="6" stroke-linecap="round" fill="none"/>')}
${P(196,128,'#e0793b',SK2,'#5a3b28',-1,'<path d="M10-56q16-2 30-12" stroke="'+SK2+'" stroke-width="6" stroke-linecap="round" fill="none"/>')}
<g transform="translate(96 14)"><circle cx="16" cy="16" r="16" fill="#fff"/><path d="M10 12a6 6 0 1 1 9 5c-2 1-3 2-3 5" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="16" cy="27" r="2" fill="${INK}"/></g>
<g transform="translate(246 70)"><path d="M10 0a10 10 0 0 1 10 10c0 8-10 18-10 18S0 18 0 10A10 10 0 0 1 10 0z" fill="#d94b3d"/><circle cx="10" cy="10" r="4" fill="#fff"/></g>`),
// 11 天気・雑談：暑い日差し、雨雲、ビル街、ヤシの木、温度計
svg('#ffe4bf',`<circle cx="62" cy="40" r="22" fill="#ffb84a"/>${Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<path d="M${62+Math.cos(a)*30} ${40+Math.sin(a)*30}L${62+Math.cos(a)*38} ${40+Math.sin(a)*38}" stroke="#ffb84a" stroke-width="4" stroke-linecap="round"/>`}).join('')}
<g transform="translate(160 6)"><ellipse cx="40" cy="26" rx="40" ry="18" fill="#7d8c9a"/><ellipse cx="20" cy="30" rx="22" ry="14" fill="#6b7a88"/><ellipse cx="64" cy="30" rx="22" ry="14" fill="#6b7a88"/>
${[10,28,46,64].map(x=>`<path d="M${x} 48l-4 12" stroke="#4f86c6" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>
${[[110,70,22,'#6f87a0'],[136,52,26,'#4f6d8a'],[166,80,20,'#8aa0b6'],[190,62,24,'#5d7690'],[218,84,22,'#7a8fa6']].map(([x,y,w,c])=>`<rect x="${x}" y="${y}" width="${w}" height="${130-y}" fill="${c}"/>`).join('')}
<rect y="128" width="320" height="22" fill="#b89f78"/>
<g transform="translate(284 128)"><path d="M0 0q-2-40 4-62" stroke="#8a5a3c" stroke-width="5" fill="none"/><path d="M4-62q-24-6-30 8M4-62q20-12 30 2M4-62q-6-18-22-20M4-62q12-18 26-14" stroke="#4f9a4f" stroke-width="6" fill="none" stroke-linecap="round"/></g>
<g transform="translate(24 76)"><rect x="0" y="0" width="12" height="44" rx="6" fill="#fff"/><rect x="3" y="8" width="6" height="34" rx="3" fill="#d94b3d"/><circle cx="6" cy="46" r="8" fill="#d94b3d"/></g>`)
];
})();
