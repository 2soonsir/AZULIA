/* ===== STORY.JS — mod Cerita AZULIA =====
   Dimuat SEBELUM skrip utama dalam index.html:  <script src="story.js"></script>
   Pemain wajib ADLI. Lawan dirujuk ikut nama watak dalam CH (index.html).
   Medan bab:
     lawan   nama watak lawan (mesti ada dalam CH)
     bg      kunci latar (lihat BG dalam index.html)
     menang  bilangan pusingan menang untuk tamatkan bab
     rig     'lose' = pemain WAJIB kalah (lawan tak boleh dikalahkan)
     special true/false = pemain boleh guna Spesial
     tenaga  tenaga spesial pada awal pusingan
     lv      tahap AI lawan
     hint    papar tunjuk ajar Spesial */
const STORY={
 hero:'ADLI',
 bab:[
  {tajuk:'BAB 1 — SETERU',lawan:'HARIMAU',bg:'gelanggangrahim',menang:1,rig:'lose',special:false,tenaga:0,lv:1.4,
   pra:'Adli tiba di gelanggang keluarga Rahim, tempat beliau belajar seni pertahankan diri daripada guru silat yang dihormati di Kampung Sentosa Baru, iaitu Tok Bahar. Harimau sudah menunggu di tengah medan.',
   selepas:'Adli tewas di tangan {lawan}. Dia masih belum cukup kuat.'},
  {tajuk:'BAB 2 — TINGKATKAN ILMU',lawan:'TOK BAHAR',bg:'gelanggangrahim',menang:1,special:true,tenaga:50,lv:.5,hint:true,
   pra:'Selepas tewas di tangan Harimau, Tok Bahar mula mengajar Adli menggunakan tenaga dalam. Tekan SPESIAL apabila bar biru penuh separuh.',
   selepas:'Adli menguasai tenaga dalam. Kini dia boleh melepaskan serangan Spesial.'},
  {tajuk:'BAB 3 — ASKAR REBELLION',lawan:'ASKAR',bg:'pasarsegar',menang:2,special:true,tenaga:0,lv:1,
   pra:'Askar Rebellion mengganas di Pasar Segar. Adli mesti menghentikan mereka.',
   selepas:'Askar Rebellion rebah. Pasar Segar kembali aman.'}
 ],
 tamat:'Adli berdiri sebagai pahlawan Nadi Fighters. (Cerita sebenar menyusul.)'
};

let storyIdx=0,hintDone=false;
const bab=()=>STORY.bab[storyIdx];
const chIdx=n=>CH.findIndex(c=>c.n===n);
const storyBg=()=>bab().bg;
const storyCanSpecial=()=>!!bab().special;

function startStory(){mode='story';storyIdx=0;storyIntro()}
function storyIntro(){
 const b=bab();pick=chIdx(STORY.hero);oppIdx=chIdx(b.lawan);
 P1=P2=null;scene='story';
 showPanel(T(b.tajuk),T(b.pra),[['Lawan!',begin],['Menu utama',goMenu,true]]);
}
/* dipanggil dalam startRound selepas P1/P2 dibuat */
function storyRoundSetup(){
 const b=bab();need=b.menang;P1.en=b.tenaga||0;hintDone=false;
 if(P2.ai)P2.ai.lv=b.lv||1;
}
const storyRig=()=>bab().rig==='lose';
/* pemain kena lebih kuat; lawan tak boleh jatuh bawah 60% HP */
function storyHitMod(a,t,dmg){return storyRig()&&t===P1?Math.round(dmg*1.4):dmg}
function storyClamp(t){if(storyRig()&&t===P2)t.hp=Math.max(t.hp,Math.round(t.mhp*.6))}
/* tapis input: kunci Spesial dimatikan jika belum belajar */
function storyInput(k){
 if(!bab().special)return{...k,s:0};
 if(k.s&&P1.en>=50)hintDone=true;
 return k;
}
function storyDraw(g){
 if(bab().hint&&!hintDone&&P1&&P1.en>=50&&!fin&&bannerT<=0&&(P1.t>>4)%2){
  g.font='bold 9px monospace';g.textAlign='center';g.fillStyle='#ffcf4a';
  g.fillText('TOK BAHAR: Tekan SPESIAL! (L / butang)',160,50);
 }
}
function storyEnd(w,sk,on){
 const b=bab(),last=storyIdx>=STORY.bab.length-1;
 if(w>0||(w<0&&b.rig==='lose')){
  const nxt=last?[['Menu utama',goMenu]]:[['Bab seterusnya',()=>{storyIdx++;storyIntro()}],['Menu utama',goMenu,true]];
  showPanel(w>0?(last?'TAMAT':'MENANG!'):'KALAH',T(b.selepas)+(w>0&&last?' '+T(STORY.tamat):''),nxt);
 }else{
  showPanel(w<0?'KALAH':'SERI',w<0?on+' terlalu kuat'+sk+'. Cuba lagi!':'Kedua-duanya sama kuat'+sk+'.',
   [['Cuba lagi',begin],['Menu utama',goMenu,true]]);
 }
}
