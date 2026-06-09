import React, { useState, useMemo, useEffect, useRef } from "react";

const C={bg:"#0B0B12",surface:"#171723",surface2:"#1F1F2E",line:"#2A2A3C",text:"#F4F4F7",muted:"#8A8AA0",lime:"#CCFF42",magenta:"#FF3D77",cyan:"#34E0FF",gold:"#FFC94D",orange:"#FF8A3D"};

const ALL=[
  {id:1,cat:"actie",t:"Laat een willekeurige speler 1 minuut jouw telefoon beheren.",m:3,p:5},
  {id:2,cat:"actie",t:"Bel een willekeurig contact, zeg 'Ik wilde even zeggen dat ik trots op je ben' en hang op.",m:2,p:3},
  {id:3,cat:"actie",t:"Vraag een vreemde om een bijnaam voor je te verzinnen. Gebruik die de rest van de avond.",m:2,p:3},
  {id:4,cat:"actie",t:"Doe je beste imitatie van de speler links van je tot iemand lacht.",m:1,p:2},
  {id:5,cat:"actie",t:"Spreek de komende 2 minuten alleen in vragen.",m:1,p:2},
  {id:6,cat:"actie",t:"Laat de groep je een nieuwe loopstijl geven en loop ermee naar de bar.",m:2,p:3},
  {id:7,cat:"actie",t:"Groet 3 vreemden alsof je ze al jaren kent.",m:2,p:3},
  {id:8,cat:"actie",t:"Maak een selfie met een onbekende op de achtergrond.",m:2,p:3},
  {id:9,cat:"actie",t:"Vraag bij de bar om een glas water 'voor mijn beste vriend' en wijs naar een vreemde.",m:2,p:3},
  {id:10,cat:"actie",t:"Laat de groep een kapsel-idee kiezen en draag het zo de rest van de avond.",m:1,p:2},
  {id:11,cat:"actie",t:"Stuur je laatst gebelde contact een spraakbericht waarin je een liedje zingt.",m:3,p:5},
  {id:12,cat:"actie",t:"Praat 1 minuut in een verzonnen taal met volle overtuiging.",m:1,p:2},
  {id:13,cat:"actie",t:"Laat iemand een tekst typen die jij als story plaatst.",m:3,p:5},
  {id:14,cat:"actie",t:"Geef een dramatische speech van 30 sec over waarom dit de beste vakantie ooit is.",m:1,p:2},
  {id:15,cat:"actie",t:"Vraag de buurtafel of zij ook vinden dat het hier veel te stil is.",m:2,p:3},
  {id:16,cat:"actie",t:"Laat de groep je telefoon-achtergrond kiezen voor de rest van de avond.",m:2,p:3},
  {id:17,cat:"actie",t:"Voer een nep-telefoongesprek over een feest dat niet bestaat.",m:2,p:3},
  {id:18,cat:"actie",t:"Bestel je volgende drankje in een compleet ander accent.",m:1,p:2},
  {id:19,cat:"actie",t:"Geef een willekeurige speler een eerlijk compliment en een eerlijke roast.",m:1,p:2},
  {id:20,cat:"actie",t:"Vraag de dichtstbijzijnde groep om een high five 'voor de overwinning'.",m:2,p:3},
  {id:21,cat:"actie",t:"Doe 10 seconden je beste danspasje.",m:1,p:2},
  {id:22,cat:"actie",t:"Doe een minuut lang alsof je een influencer bent die deze plek reviewt.",m:2,p:3},
  {id:23,cat:"actie",t:"Laat de groep een geluid kiezen dat je maakt elke keer dat je drinkt.",m:2,p:3},
  {id:24,cat:"actie",t:"Laat een willekeurige speler beslissen wat jouw volgende drankje wordt.",m:2,p:3},
  {id:25,cat:"actie",t:"Loop een rondje om de tafel met een live sportverslag van jezelf.",m:1,p:2},
  {id:26,cat:"actie",t:"Maak een video waarin de hele groep slow-motion doet.",m:1,p:2},
  {id:27,cat:"actie",t:"Laat een onbekende raden uit welk land je komt en speel het mee.",m:2,p:3},
  {id:28,cat:"actie",t:"Geef je drankje een naam en stel het serieus voor.",m:1,p:1},
  // Snelle Missies (onmiddellijk uitvoeren)
  {id:101,cat:"missie",t:"Laat de groep lachen binnen 15 seconden. Lukt het niet? Drink 3.",m:2,p:4},
  {id:102,cat:"missie",t:"Doe een perfecte dier-imitatie naar keuze van de groep. Zij scoren 1-10, onder 6 = mislukt.",m:1,p:3},
  {id:103,cat:"missie",t:"Noem 5 hoofdsteden in 10 seconden. Per gemiste: 1 slok.",m:1,p:3},
  {id:104,cat:"missie",t:"Zing het refrein van het laatste nummer dat je luisterde. Groep oordeelt.",m:2,p:4},
  {id:105,cat:"missie",t:"Doe je beste celebrity-impressie. De groep raadt wie. Fout = jij drinkt 2.",m:2,p:4},
  {id:106,cat:"missie",t:"Vertel 2 waarheden en 1 leugen. De groep raadt de leugen. Fout = zij drinken, goed = jij drinkt.",m:2,p:4},
  {id:107,cat:"missie",t:"Houd 10 seconden oogcontact met de speler tegenover je zonder te lachen.",m:1,p:3},
  {id:108,cat:"missie",t:"Doe een freestyle rap van 15 seconden over de speler links van je.",m:2,p:4},
  {id:109,cat:"missie",t:"Maak het grappigste gezicht dat je kunt. De groep stemt: gelukt of niet.",m:1,p:2},
  {id:110,cat:"missie",t:"Bedenk de beste pickup line voor de speler rechts van je. Groep oordeelt.",m:2,p:4},
  {id:111,cat:"missie",t:"Doe een TikTok-dans. Geen idee? Dan drink je 3.",m:2,p:4},
  {id:112,cat:"missie",t:"Vertel in 10 seconden het meest random feit over jezelf.",m:1,p:2},
  {id:113,cat:"missie",t:"Doe de stemmen van 3 bekende mensen in 20 seconden. Groep oordeelt.",m:2,p:4},
  {id:114,cat:"missie",t:"Verzin de beste grappige belediging voor een speler naar keuze. Niet te gemeen.",m:2,p:3},
  {id:115,cat:"missie",t:"Doe 10 jumping jacks terwijl je het alfabet achterstevoren opzegt.",m:2,p:4},
  {id:116,cat:"missie",t:"Doe je beste Gordon Ramsay-imitatie over het drankje van je buurman.",m:1,p:3},
  {id:117,cat:"missie",t:"Vertel een mop. Lacht niemand, dan drink je 3.",m:2,p:4},
  {id:118,cat:"missie",t:"Fluister de speler links iets in het oor. Die moet het hardop herhalen.",m:1,p:3},
  // Wie van de groep
  {id:53,cat:"wie",t:"Wie zou als eerste worden opgepakt op vakantie?",m:1,p:2},
  {id:54,cat:"wie",t:"Wie zou het snelst ontslagen worden?",m:1,p:2},
  {id:55,cat:"wie",t:"Wie wordt als eerste miljonair?",m:1,p:2},
  {id:56,cat:"wie",t:"Wie verdwaalt het snelst in een vreemde stad?",m:1,p:2},
  {id:57,cat:"wie",t:"Wie geeft het meeste geld uit deze vakantie?",m:1,p:2},
  {id:58,cat:"wie",t:"Wie valt vanavond als eerste in slaap?",m:1,p:2},
  {id:59,cat:"wie",t:"Wie kan het beste een geheim bewaren?",m:1,p:2},
  {id:60,cat:"wie",t:"Wie zou de groep leiden op een onbewoond eiland?",m:1,p:2},
  {id:61,cat:"wie",t:"Wie liegt het overtuigendst?",m:1,p:2},
  {id:62,cat:"wie",t:"Wie heeft de meest gênante zoekgeschiedenis?",m:2,p:3},
  {id:63,cat:"wie",t:"Wie wordt verliefd tijdens deze trip?",m:1,p:2},
  {id:64,cat:"wie",t:"Wie zou de rekening ontvluchten?",m:1,p:2},
  {id:65,cat:"wie",t:"Wie past het beste in een reality-show?",m:1,p:2},
  {id:66,cat:"wie",t:"Wie kletst zich overal uit?",m:1,p:2},
  {id:67,cat:"wie",t:"Wie is stiekem het meest competitief?",m:1,p:2},
  {id:68,cat:"wie",t:"Wie vergeet morgen het meeste van vanavond?",m:1,p:2},
  {id:69,cat:"wie",t:"Wie zou viral gaan op social media?",m:1,p:2},
  {id:70,cat:"wie",t:"Wie zou het eerste trouwen?",m:1,p:2},
  // Koning EXTREME
  {id:73,cat:"koning",t:"Laat je hele belgeschiedenis zien aan de groep.",m:3,p:5},
  {id:74,cat:"koning",t:"Stuur 'ik denk aan je' naar het laatst ge-DM'de contact. Screenshot als bewijs.",m:3,p:5},
  {id:75,cat:"koning",t:"Laat de groep 30 seconden door je Instagram-volgers scrollen.",m:3,p:5},
  {id:76,cat:"koning",t:"Bel je moeder en vertel dat je verloofd bent. Hang na 10 sec op.",m:3,p:5},
  {id:77,cat:"koning",t:"Eet of drink iets dat de groep voor je mixt (binnen redelijkheid).",m:3,p:5},
  {id:78,cat:"koning",t:"Geef je telefoon 2 minuten aan de koning. De koning mag 1 bericht sturen.",m:3,p:5},
  {id:79,cat:"koning",t:"Laat je zoekgeschiedenis van vandaag zien of drink 5.",m:3,p:5},
  {id:80,cat:"koning",t:"Stuur een spraakbericht naar je crush of ex: 'Ik moest even aan je denken.'",m:3,p:5},
  {id:81,cat:"koning",t:"Vertel je meest illegale actie ooit. De groep oordeelt of het telt.",m:2,p:4},
  {id:82,cat:"koning",t:"Doe 30 push-ups of drink 5 slokken. Halverwege stoppen = drink 3.",m:2,p:4},
  {id:83,cat:"koning",t:"Laat de groep je een bericht typen in een groepschat naar keuze.",m:3,p:5},
  {id:84,cat:"koning",t:"Doe je beste sexy danspasje voor de groep, 15 seconden lang.",m:2,p:4},
  // Spicy 18+
  {id:201,cat:"spicy",t:"Doe 10 sec je meest verleidelijke blik naar de speler tegenover je. Niet lachen.",m:3,p:5},
  {id:202,cat:"spicy",t:"Vertel het gênantste dat je ooit op een date hebt gedaan, of drink 3.",m:3,p:5},
  {id:203,cat:"spicy",t:"Doe een sexy dansje van 15 seconden.",m:3,p:5},
  {id:204,cat:"spicy",t:"Laat je linkerbuur je laatste 3 fotos zien, of drink 4.",m:3,p:5},
  {id:205,cat:"spicy",t:"Beschrijf wat jouw type is terwijl je iemand in de groep aankijkt.",m:2,p:4},
  {id:206,cat:"spicy",t:"Doe het overtuigendste lekker eten-geluid dat je in je hebt.",m:2,p:3},
  {id:207,cat:"spicy",t:"Met wie in deze groep zou je nog wel een avondje willen? Noem 1, of drink 4.",m:3,p:5},
  {id:208,cat:"spicy",t:"Ruik de oksel van de speler naast je en geef een eerlijke review.",m:2,p:4},
  {id:209,cat:"spicy",t:"Beschrijf je slechtste zoen ooit, met details.",m:2,p:4},
  {id:210,cat:"spicy",t:"Lik de rand van je glas zo verleidelijk mogelijk en proost.",m:2,p:4},
  {id:211,cat:"spicy",t:"Vertel je meest awkward dronken actie ooit.",m:2,p:3},
  {id:212,cat:"spicy",t:"Geef het sexyste serieuze compliment aan de speler rechts van je.",m:2,p:4},
  {id:213,cat:"spicy",t:"Onthul wat je het laatst hebt opgezocht voor een vriend.",m:3,p:5},
  {id:214,cat:"spicy",t:"Wie zou je daten als je nu moest kiezen? Noem 1, of drink 3.",m:3,p:5},
  {id:215,cat:"spicy",t:"Doe na hoe jij flirt. De groep geeft een cijfer.",m:2,p:4},
  {id:216,cat:"spicy",t:"Hoeveel mensen heb je gekust? Afronden naar boven mag.",m:2,p:4},
  {id:217,cat:"spicy",t:"Doe je beste kreun alsof je in de lekkerste massage zit, 10 seconden.",m:3,p:5},
  {id:218,cat:"spicy",t:"Beschrijf je gênantste het ging bijna mis-moment in bed, of drink 4.",m:3,p:5},
  {id:219,cat:"spicy",t:"Spreek een verleidelijke reclame in voor het drankje in je hand.",m:2,p:4},
  {id:220,cat:"spicy",t:"Welke beroemdheid is jouw absolute vrijbrief en waarom?",m:1,p:3},
  {id:221,cat:"spicy",t:"Laat je laatst verstuurde bericht zien aan je linkerbuur, of drink 4.",m:3,p:5},
  {id:222,cat:"spicy",t:"Fluister iets gedurfds in het oor van je rechterbuur en herhaal het hardop.",m:3,p:5},
  {id:223,cat:"spicy",t:"Noem je grootste turn-off op een eerste date, of drink 3.",m:2,p:4},
];

const byCat=c=>ALL.filter(o=>o.cat===c);
const rand=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>[...a].sort(()=>Math.random()-0.5);
const actiePool=s=>s?[...byCat("actie"),...byCat("spicy")]:byCat("actie");
const MD={1:{l:"MAKKELIJK",c:C.lime},2:{l:"GEMIDDELD",c:C.cyan},3:{l:"HEFTIG",c:C.magenta}};

const Pill=({children,color})=>(<span style={{display:"inline-block",padding:"5px 13px",borderRadius:999,fontSize:11,letterSpacing:"0.12em",fontWeight:800,background:color+"1F",color,border:`1px solid ${color}55`}}>{children}</span>);
const Btn=({children,onClick,color=C.lime,dark,full,small,disabled})=>(<button onClick={onClick} disabled={disabled} style={{width:full?"100%":"auto",padding:small?"12px 16px":"16px 24px",borderRadius:18,fontWeight:800,fontSize:small?13:15,cursor:disabled?"default":"pointer",background:disabled?C.surface2:dark?C.surface2:color,color:disabled?C.muted:dark?C.text:"#0B0B12",border:dark?`1px solid ${C.line}`:"none",boxShadow:dark||disabled?"none":`0 6px 24px ${color}40`,letterSpacing:"0.02em",opacity:disabled?0.5:1,transition:"transform 0.08s"}} onPointerDown={e=>{if(!disabled)e.currentTarget.style.transform="scale(0.96)"}} onPointerUp={e=>e.currentTarget.style.transform="scale(1)"}>{children}</button>);
const Hdr=({title,sub,onBack})=>(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontWeight:700,fontSize:14,cursor:"pointer"}}>&#8249; Terug</button><div style={{textAlign:"center"}}><span style={{color:C.muted,fontWeight:800,letterSpacing:"0.18em",fontSize:11}}>{title}</span>{sub&&<p style={{color:C.cyan,fontSize:11,fontWeight:700,marginTop:2}}>{sub}</p>}</div><span style={{width:50}}/></div>);
const Card=({children,border,style:s})=>(<div style={{background:C.surface,border:`1px solid ${border||C.line}`,borderRadius:24,padding:24,...s}}>{children}</div>);
const DiceSvg=({n,rolling})=>{const pos={1:[[50,50]],2:[[25,25],[75,75]],3:[[25,25],[50,50],[75,75]],4:[[25,25],[75,25],[25,75],[75,75]],5:[[25,25],[75,25],[50,50],[25,75],[75,75]],6:[[25,20],[75,20],[25,50],[75,50],[25,80],[75,80]]};return(<svg viewBox="0 0 100 100" width="100" height="100"><rect x="5" y="5" width="90" height="90" rx="16" fill={C.surface2} stroke={rolling?C.cyan:C.gold} strokeWidth="3"/>{(pos[n]||[]).map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="9" fill={rolling?C.cyan:C.gold}/>))}</svg>);};

// ---- VOER UIT OF DRINK ----
const ACTIE_R=10;
function Actie({players,addScore,spicy,onBack}){
  const pool=useMemo(()=>actiePool(spicy),[spicy]);
  const [turn,setTurn]=useState(0);const [o,setO]=useState(()=>rand(pool));const [done,setDone]=useState(false);
  const sp=players[turn%players.length];const d=MD[o.m];const rn=turn+1;
  if(done)return(<div><Hdr title="VOER UIT OF DRINK" onBack={onBack}/><Card border={C.lime+"55"} style={{textAlign:"center",marginBottom:18}}><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:28}}>KLAAR!</p></Card><Btn full color={C.lime} onClick={onBack}>TERUG NAAR MENU</Btn></div>);
  const next=()=>{if(rn>=ACTIE_R)setDone(true);else{setTurn(t=>t+1);setO(rand(pool));}};
  return(<div><Hdr title="VOER UIT OF DRINK" sub={`Ronde ${rn}/${ACTIE_R}`} onBack={onBack}/><div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.muted,fontWeight:700,fontSize:14}}>Aan de beurt</p><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:32}}>{sp.name}</p></div><Card border={C.line} style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><Pill color={d.c}>{d.l}</Pill><Pill color={C.gold}>+{o.p} PT</Pill></div><p style={{color:C.text,fontWeight:600,fontSize:20,lineHeight:1.35}}>{o.t}</p></Card><div style={{display:"grid",gap:10}}><Btn full color={C.lime} onClick={()=>{addScore(sp.id,o.p);next();}}>GEDAAN +{o.p} pt{o.p>=4?" + deel 2 slokken uit":""}</Btn><Btn full dark onClick={next}>GEWEIGERD - drink 2 slokken</Btn></div></div>);
}

// ---- WIE VAN DE GROEP (met gelijkspel-fix) ----
const WIE_R=8;
function Wie({players,addScore,spicy,onBack}){
  const pool=useMemo(()=>shuffle(byCat("wie")),[]);const strafPool=useMemo(()=>actiePool(spicy),[spicy]);
  const [ronde,setRonde]=useState(0);const [vraag,setVraag]=useState(()=>pool[0]);const [phase,setPhase]=useState("intro");
  const [vi,setVi]=useState(0);const [votes,setVotes]=useState({});const [voted,setVoted]=useState({});const [straf,setStraf]=useState(null);const [done,setDone]=useState(false);
  const start=()=>{setPhase("vote");setVi(0);setVotes({});setVoted({});setStraf(null);};
  const cast=tid=>{const v={...votes,[tid]:(votes[tid]||0)+1};const vd={...voted,[players[vi].id]:tid};setVotes(v);setVoted(vd);if(vi+1>=players.length){setStraf(rand(strafPool));setPhase("reveal");}else setVi(vi+1);};
  const reveal=useMemo(()=>{if(phase!=="reveal")return null;let mx=0;Object.values(votes).forEach(c=>{if(c>mx)mx=c;});const w=players.filter(p=>(votes[p.id]||0)===mx&&mx>0);const tie=w.length===players.length;return{max:mx,winners:w,tie};},[phase,votes,players]);
  const next=()=>{if(reveal&&!reveal.tie){const ws=new Set(reveal.winners.map(w=>w.id));players.forEach(p=>{if(ws.has(voted[p.id]))addScore(p.id,vraag.p);});}const nr=ronde+1;if(nr>=WIE_R){setDone(true);return;}setRonde(nr);setVraag(pool[nr%pool.length]);setPhase("intro");};
  const slokken=reveal?Math.max(1,reveal.max):0;const rn=ronde+1;
  if(done)return(<div><Hdr title="WIE VAN DE GROEP" onBack={onBack}/><Card border={C.cyan+"55"} style={{textAlign:"center",marginBottom:18}}><p style={{color:C.cyan,fontFamily:"Anton,sans-serif",fontSize:28}}>KLAAR!</p></Card><Btn full color={C.lime} onClick={onBack}>TERUG NAAR MENU</Btn></div>);
  return(<div><Hdr title="WIE VAN DE GROEP" sub={`Ronde ${rn}/${WIE_R}`} onBack={onBack}/>
    {phase==="intro"&&<><Card border={C.line} style={{textAlign:"center",marginBottom:18}}><Pill color={C.cyan}>STEMRONDE</Pill><p style={{color:C.text,fontWeight:700,fontSize:22,lineHeight:1.35,marginTop:16}}>{vraag.t}</p></Card><p style={{color:C.muted,fontSize:13,textAlign:"center",marginBottom:18}}>Geef de telefoon door. Iedereen stemt geheim. Wie de meeste stemmen krijgt drinkt + opdracht. Wie goed stemde scoort +{vraag.p} pt.</p><Btn full color={C.cyan} onClick={start}>BEGIN STEMMEN</Btn></>}
    {phase==="vote"&&<><div style={{textAlign:"center",marginBottom:18}}><p style={{color:C.muted,fontWeight:700,fontSize:14}}>Geef de telefoon aan</p><p style={{color:C.cyan,fontFamily:"Anton,sans-serif",fontSize:32}}>{players[vi].name}</p><p style={{color:C.muted,fontSize:12,marginTop:4}}>{vi+1}/{players.length}</p></div><p style={{color:C.text,fontWeight:600,textAlign:"center",marginBottom:16}}>{vraag.t}</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{players.map(p=>(<button key={p.id} onClick={()=>cast(p.id)} disabled={p.id===players[vi].id} style={{padding:18,borderRadius:18,background:p.id===players[vi].id?C.bg:C.surface2,color:p.id===players[vi].id?C.line:C.text,fontWeight:700,fontSize:16,border:`1px solid ${C.line}`,cursor:"pointer",opacity:p.id===players[vi].id?0.35:1}}>{p.name}</button>))}</div></>}
    {phase==="reveal"&&reveal&&<>
      {reveal.tie?<>
        <Card border={C.cyan+"55"} style={{textAlign:"center",marginBottom:14}}><Pill color={C.cyan}>GELIJKSPEL!</Pill><p style={{color:C.text,fontWeight:600,fontSize:15,margin:"12px 0"}}>{vraag.t}</p><p style={{color:C.cyan,fontFamily:"Anton,sans-serif",fontSize:24,marginBottom:8}}>Iedereen kreeg evenveel stemmen</p><p style={{color:C.muted,fontSize:14}}>Iedereen drinkt 1 slok, geen punten.</p></Card>
      </>:<>
        <Card border={C.magenta+"55"} style={{textAlign:"center",marginBottom:14}}><Pill color={C.magenta}>UITSLAG</Pill><p style={{color:C.text,fontWeight:600,fontSize:15,margin:"12px 0"}}>{vraag.t}</p><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:32}}>{reveal.winners.map(w=>w.name).join(" & ")}</p><p style={{color:C.muted,fontSize:14,marginTop:4}}>{reveal.max} {reveal.max===1?"stem":"stemmen"}</p></Card>
        <Card border={C.gold+"55"} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><Pill color={C.gold}>STRAF</Pill><span style={{color:C.gold,fontFamily:"Anton,sans-serif",fontSize:24}}>{slokken} {slokken===1?"SLOK":"SLOKKEN"}</span></div><p style={{color:C.muted,fontWeight:700,fontSize:11,letterSpacing:"0.15em",marginBottom:8}}>EN VOERT UIT</p><p style={{color:C.text,fontWeight:600,fontSize:17,lineHeight:1.35}}>{straf?.t}</p></Card>
        <Card border={C.line} style={{padding:"12px 18px",marginBottom:14}}><p style={{color:C.muted,fontWeight:700,fontSize:11,letterSpacing:"0.12em",marginBottom:8}}>PUNTEN</p>{players.map(p=>{const ws=new Set(reveal.winners.map(w=>w.id));const got=ws.has(voted[p.id])?vraag.p:0;return(<div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{color:C.muted,fontSize:14}}>{p.name}</span><span style={{color:got>0?C.lime:C.muted,fontSize:14,fontWeight:700}}>{got>0?`+${got}`:"-"}</span></div>);})}</Card>
      </>}
      <Btn full color={C.lime} onClick={next}>{rn>=WIE_R?"AFRONDEN":"VOLGENDE VRAAG"}</Btn>
    </>}
  </div>);
}

// ---- SNELLE MISSIES (direct uitvoeren, groep oordeelt) ----
const MISSIE_R=10;
function Missie({players,addScore,onBack}){
  const pool=useMemo(()=>shuffle(byCat("missie")),[]);
  const [turn,setTurn]=useState(0);const [o,setO]=useState(()=>pool[0]);const [done,setDone]=useState(false);
  const sp=players[turn%players.length];const d=MD[o.m];const rn=turn+1;
  if(done)return(<div><Hdr title="SNELLE MISSIES" onBack={onBack}/><Card border={C.gold+"55"} style={{textAlign:"center",marginBottom:18}}><p style={{color:C.gold,fontFamily:"Anton,sans-serif",fontSize:28}}>KLAAR!</p></Card><Btn full color={C.lime} onClick={onBack}>TERUG NAAR MENU</Btn></div>);
  const next=(pts)=>{if(pts)addScore(sp.id,pts);if(rn>=MISSIE_R)setDone(true);else{setTurn(t=>t+1);setO(pool[(turn+1)%pool.length]);}};
  return(<div><Hdr title="SNELLE MISSIES" sub={`Ronde ${rn}/${MISSIE_R}`} onBack={onBack}/><div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.muted,fontWeight:700,fontSize:14}}>Aan de beurt</p><p style={{color:C.gold,fontFamily:"Anton,sans-serif",fontSize:32}}>{sp.name}</p></div><Card border={C.gold+"55"} style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><Pill color={d.c}>{d.l}</Pill><Pill color={C.gold}>+{o.p} PT</Pill></div><p style={{color:C.text,fontWeight:600,fontSize:20,lineHeight:1.35}}>{o.t}</p><div style={{marginTop:16,padding:"12px 16px",borderRadius:14,background:C.surface2}}><p style={{color:C.muted,fontSize:13}}>Doe het NU. De groep oordeelt.</p></div></Card><div style={{display:"grid",gap:10}}><Btn full color={C.lime} onClick={()=>next(o.p)}>GELUKT +{o.p} pt + deel {o.m} slokken uit</Btn><Btn full dark onClick={()=>next(0)}>MISLUKT - drink {o.m+1} slokken</Btn></div></div>);
}

// ---- DE KONING (extreme opdrachten) ----
const KONING_R=8;
function Koning({players,addScore,onBack}){
  const pool=useMemo(()=>byCat("koning"),[]);
  const [ronde,setRonde]=useState(0);const [king,setKing]=useState(()=>players[0]);const [o,setO]=useState(()=>rand(pool));const [phase,setPhase]=useState("pick");const [target,setTarget]=useState(null);const rn=ronde+1;
  if(phase==="done")return(<div><Hdr title="DE KONING" onBack={onBack}/><Card border={C.gold+"55"} style={{textAlign:"center",marginBottom:18}}><p style={{color:C.gold,fontFamily:"Anton,sans-serif",fontSize:28}}>KLAAR!</p></Card><Btn full color={C.lime} onClick={onBack}>TERUG NAAR MENU</Btn></div>);
  const nextRound=()=>{const nr=ronde+1;if(nr>=KONING_R){setPhase("done");return;}setRonde(nr);setKing(players[nr%players.length]);setO(rand(pool));setTarget(null);setPhase("pick");};
  return(<div><Hdr title="DE KONING" sub={`Ronde ${rn}/${KONING_R}`} onBack={onBack}/>
    {phase==="pick"&&<><div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.muted,fontWeight:700,fontSize:14}}>Deze ronde regeert</p><p style={{color:C.gold,fontFamily:"Anton,sans-serif",fontSize:38}}>{king.name}</p></div><Card border={C.gold+"55"} style={{marginBottom:18}}><Pill color={C.gold}>KONINKLIJK BEVEL</Pill><p style={{color:C.text,fontWeight:600,fontSize:20,lineHeight:1.35,marginTop:14}}>{o.t}</p></Card><p style={{color:C.muted,fontSize:13,textAlign:"center",marginBottom:14}}>Koning kiest wie dit moet doen:</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{players.filter(p=>p.id!==king.id).map(p=>(<button key={p.id} onClick={()=>{setTarget(p);setPhase("challenge");}} style={{padding:18,borderRadius:18,background:C.surface2,color:C.text,fontWeight:700,fontSize:16,border:`1px solid ${C.line}`,cursor:"pointer"}}>{p.name}</button>))}</div></>}
    {phase==="challenge"&&target&&<><div style={{textAlign:"center",marginBottom:14}}><Pill color={C.gold}>{king.name} beveelt</Pill><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:32,margin:"12px 0"}}>{target.name}</p></div><Card border={C.gold+"55"} style={{marginBottom:14}}><p style={{color:C.text,fontWeight:600,fontSize:18,lineHeight:1.35}}>{o.t}</p><div style={{marginTop:16,padding:"12px 16px",borderRadius:14,background:C.surface2}}><p style={{color:C.lime,fontSize:13,fontWeight:700}}>Gedaan = {target.name} +{o.p} pt, Koning drinkt 1</p><p style={{color:C.magenta,fontSize:13,fontWeight:700,marginTop:4}}>Geweigerd = {target.name} drinkt 3, Koning +{o.p} pt + deel 2 uit</p></div></Card><div style={{display:"grid",gap:10}}><Btn full color={C.lime} onClick={()=>{addScore(target.id,o.p);nextRound();}}>GEDAAN - {target.name} +{o.p}, Koning drinkt 1</Btn><Btn full color={C.magenta} onClick={()=>{addScore(king.id,o.p);nextRound();}}>GEWEIGERD - {target.name} drinkt 3</Btn></div></>}
  </div>);
}

// ---- DOBBELGELUK (duel + doorschuif) ----
const DOBBEL_R=10;
const DICE_FX=[
  {n:1,t:"Drink 1 slok",self:true,amt:1,push:true},
  {n:2,t:"Kies iemand die 2 drinkt",self:false,amt:2},
  {n:3,t:"Iedereen drinkt 1",self:true,amt:1,all:true},
  {n:4,t:"DUEL!",duel:true},
  {n:5,t:"Neem een atje",self:true,atje:true},
  {n:6,t:"JACKPOT - deel 6 uit + kies iemand voor een atje",self:false,amt:6,atje:true},
];
const EINDSTRAFFEN=[
  "De hele groep mag elk 1 bericht sturen vanaf jouw telefoon naar een contact naar keuze.",
  "Drink een mix-drankje dat de groep voor je maakt. Je moet het helemaal op.",
  "Geef je telefoon 5 minuten aan de winnaar. Alles mag behalve verwijderen.",
  "De groep kiest je profielfoto voor de komende 24 uur.",
  "Post een story of status die de groep voor je typt. Mag pas na 24 uur weg.",
  "Ga op je knieën en bied elke speler persoonlijk je excuses aan met een reden.",
  "Bel je laatst gebelde contact en vertel dat je net bent aangehouden. Minimaal 15 sec volhouden.",
  "Loop een rondje om het gebouw of terras terwijl je schreeuwt dat je de verliezer bent.",
  "Neem 2 atjes achter elkaar. De groep telt af.",
  "De winnaar bepaalt wat jij de rest van de avond drinkt.",
  "De winnaar mag 3 vragen stellen die je 100% eerlijk moet beantwoorden. Geen weigerrecht.",
  "Drink uit je schoen. Geen discussie.",
  "De groep kiest een liedje en je zingt het volledige refrein staand op een stoel of bank.",
  "Laat iedereen in de groep een DM sturen vanaf jouw Instagram.",
  "De groep bepaalt je volgende bestelling (eten of drinken) en je moet het helemaal op.",
];
function Dobbel({players,addScore,onBack}){
  const [ronde,setRonde]=useState(0);const [phase,setPhase]=useState("ready");const [val,setVal]=useState(1);const [dv,setDv]=useState(1);const timerRef=useRef(null);
  const [opp,setOpp]=useState(null);const [d1,setD1]=useState(null);const [d2,setD2]=useState(null);const [duelDv,setDuelDv]=useState(1);
  const sp=players[ronde%players.length];const rn=ronde+1;const fx=DICE_FX[val-1];

  const doRoll=(cb)=>{let c=0;timerRef.current=setInterval(()=>{const r=Math.floor(Math.random()*6)+1;setDuelDv(r);setDv(r);c++;if(c>=18){clearInterval(timerRef.current);const f=Math.floor(Math.random()*6)+1;setDv(f);setDuelDv(f);cb(f);}},80);};
  const roll=()=>{setPhase("rolling");doRoll(f=>{setVal(f);setPhase("result");});};
  useEffect(()=>()=>clearInterval(timerRef.current),[]);
  const next=()=>{if(rn>=DOBBEL_R){setPhase("done");return;}setRonde(r=>r+1);setPhase("ready");setOpp(null);setD1(null);setD2(null);};

  if(phase==="done")return(<div><Hdr title="DOBBELGELUK" onBack={onBack}/><Card border={C.orange+"55"} style={{textAlign:"center",marginBottom:18}}><p style={{color:C.orange,fontFamily:"Anton,sans-serif",fontSize:28}}>KLAAR!</p></Card><Btn full color={C.lime} onClick={onBack}>TERUG NAAR MENU</Btn></div>);

  return(<div><Hdr title="DOBBELGELUK" sub={`Ronde ${rn}/${DOBBEL_R}`} onBack={onBack}/><div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.muted,fontWeight:700,fontSize:14}}>Aan de beurt</p><p style={{color:C.orange,fontFamily:"Anton,sans-serif",fontSize:32}}>{sp.name}</p></div>

    {(phase==="ready"||phase==="rolling"||phase==="result")&&<div style={{display:"flex",justifyContent:"center",marginBottom:20}}><DiceSvg n={dv} rolling={phase==="rolling"}/></div>}

    {phase==="ready"&&<Btn full color={C.orange} onClick={roll}>GOOI DE DOBBELSTEEN</Btn>}
    {phase==="rolling"&&<p style={{color:C.cyan,fontWeight:800,fontSize:18,textAlign:"center"}}>Rollen...</p>}

    {phase==="result"&&<><Card border={C.orange+"55"} style={{textAlign:"center",marginBottom:18}}><p style={{color:C.orange,fontFamily:"Anton,sans-serif",fontSize:26,marginBottom:8}}>{fx.t}</p>
      {fx.all&&<p style={{color:C.muted,fontSize:14}}>Iedereen pakt een slok.</p>}
      {fx.self&&!fx.all&&!fx.atje&&<p style={{color:C.muted,fontSize:14}}>{sp.name} drinkt {fx.amt} slok.</p>}
      {fx.atje&&fx.self&&<p style={{color:C.gold,fontSize:14,fontWeight:700}}>{sp.name} neemt een atje. Proost!</p>}
      {!fx.self&&!fx.duel&&<p style={{color:C.muted,fontSize:14}}>{sp.name} mag {fx.amt} slokken uitdelen{fx.atje?" + een atje wegwijzen":""}.</p>}
      {fx.duel&&<p style={{color:C.magenta,fontSize:14,fontWeight:700}}>Kies een tegenstander. Beiden rollen, laagste drinkt 4!</p>}
    </Card>
      {fx.push&&<div style={{display:"grid",gap:10}}><Btn full dark onClick={()=>{addScore(sp.id,1);next();}}>ZELF DRINKEN (1 slok) +1 pt</Btn><Btn full color={C.magenta} onClick={()=>{setPhase("push_pick");}}>DOORSCHUIVEN - iemand anders drinkt 2</Btn></div>}
      {fx.duel&&<><p style={{color:C.muted,fontSize:13,textAlign:"center",marginBottom:10}}>Kies je tegenstander:</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{players.filter(p=>p.id!==sp.id).map(p=>(<button key={p.id} onClick={()=>{setOpp(p);setPhase("duel1");}} style={{padding:16,borderRadius:18,background:C.surface2,color:C.text,fontWeight:700,border:`1px solid ${C.line}`,cursor:"pointer"}}>{p.name}</button>))}</div></>}
      {!fx.push&&!fx.duel&&<Btn full color={C.lime} onClick={()=>{addScore(sp.id,1);next();}}>KLAAR +1 pt</Btn>}
    </>}

    {phase==="push_pick"&&<><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:22,textAlign:"center",marginBottom:14}}>Wie drinkt 2?</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{players.filter(p=>p.id!==sp.id).map(p=>(<button key={p.id} onClick={()=>{addScore(sp.id,1);next();}} style={{padding:16,borderRadius:18,background:C.surface2,color:C.text,fontWeight:700,border:`1px solid ${C.line}`,cursor:"pointer"}}>{p.name}</button>))}</div></>}

    {phase==="duel1"&&opp&&<><div style={{textAlign:"center",marginBottom:14}}><Pill color={C.magenta}>DUEL</Pill><p style={{color:C.text,fontWeight:700,fontSize:18,marginTop:10}}>{sp.name} vs {opp.name}</p></div><div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:20}}><div style={{textAlign:"center"}}><p style={{color:C.lime,fontWeight:700,fontSize:13,marginBottom:8}}>{sp.name}</p><DiceSvg n={d1||1} rolling={false}/>{d1&&<p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:28,marginTop:8}}>{d1}</p>}</div><div style={{textAlign:"center"}}><p style={{color:C.magenta,fontWeight:700,fontSize:13,marginBottom:8}}>{opp.name}</p><DiceSvg n={1} rolling={false}/><p style={{color:C.muted,fontSize:14,marginTop:8}}>?</p></div></div>{!d1?<Btn full color={C.lime} onClick={()=>{const r=Math.floor(Math.random()*6)+1;setD1(r);}}>ROL VOOR {sp.name.toUpperCase()}</Btn>:<Btn full color={C.magenta} onClick={()=>{const r=Math.floor(Math.random()*6)+1;setD2(r);setPhase("duel_result");}}>ROL VOOR {opp.name.toUpperCase()}</Btn>}</>}

    {phase==="duel_result"&&opp&&d1&&d2&&<><div style={{textAlign:"center",marginBottom:14}}><Pill color={C.magenta}>DUEL UITSLAG</Pill></div><div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:20}}><div style={{textAlign:"center"}}><p style={{color:C.lime,fontWeight:700,fontSize:13,marginBottom:8}}>{sp.name}</p><DiceSvg n={d1} rolling={false}/><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:28,marginTop:8}}>{d1}</p></div><div style={{textAlign:"center"}}><p style={{color:C.magenta,fontWeight:700,fontSize:13,marginBottom:8}}>{opp.name}</p><DiceSvg n={d2} rolling={false}/><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:28,marginTop:8}}>{d2}</p></div></div>
      <Card border={d1===d2?C.cyan+"55":C.magenta+"55"} style={{textAlign:"center",marginBottom:18}}>
        {d1===d2&&<p style={{color:C.cyan,fontWeight:800,fontSize:18}}>GELIJKSPEL! Beiden drinken 2.</p>}
        {d1>d2&&<p style={{color:C.magenta,fontWeight:800,fontSize:18}}>{opp.name} verliest en drinkt 4!</p>}
        {d1<d2&&<p style={{color:C.magenta,fontWeight:800,fontSize:18}}>{sp.name} verliest en drinkt 4!</p>}
      </Card>
      <Btn full color={C.lime} onClick={()=>{addScore(d1>=d2?sp.id:opp.id,2);next();}}>VOLGENDE</Btn>
    </>}
  </div>);
}

// ---- SCORES + EINDE ----
function Scores({players,onBack}){const sorted=[...players].sort((a,b)=>b.score-a.score);const medal=["#FFC94D","#C9D1D9","#CD7F32"];return(<div><Hdr title="SCOREBORD" onBack={onBack}/><div style={{display:"grid",gap:10}}>{sorted.map((p,i)=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderRadius:18,background:C.surface,border:`1px solid ${i<3?medal[i]+"55":C.line}`}}><div style={{display:"flex",alignItems:"center",gap:12}}><span style={{color:i<3?medal[i]:C.muted,fontFamily:"Anton,sans-serif",fontSize:22,width:26}}>{i+1}</span><span style={{color:C.text,fontWeight:700,fontSize:18}}>{p.name}</span></div><span style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:26}}>{p.score}</span></div>))}</div></div>);}

function Einde({players,onBack,onReset}){const sorted=[...players].sort((a,b)=>b.score-a.score);const w=sorted[0];const l=sorted[sorted.length-1];const es=rand(EINDSTRAFFEN);return(<div><Hdr title="EINDSTAND" onBack={onBack}/><Card border={C.gold+"55"} style={{textAlign:"center",marginBottom:14}}><p style={{fontSize:40,marginBottom:4}}>{"\u{1F451}"}</p><p style={{color:C.gold,fontFamily:"Anton,sans-serif",fontSize:28}}>{w.name}</p><p style={{color:C.muted,fontWeight:700,fontSize:13,marginTop:4}}>HEERSER VAN DE NACHT</p><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:22,marginTop:8}}>{w.score} pt</p></Card><Card border={C.magenta+"55"} style={{textAlign:"center",marginBottom:14}}><p style={{fontSize:40,marginBottom:4}}>{"\u{1F480}"}</p><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:28}}>{l.name}</p><p style={{color:C.muted,fontWeight:700,fontSize:13,marginTop:4}}>VERLIEZER VAN DE NACHT</p><p style={{color:C.magenta,fontSize:14,marginTop:8}}>{l.score} pt</p></Card><Card border={C.magenta+"55"} style={{marginBottom:14}}><Pill color={C.magenta}>EINDSTRAF</Pill><p style={{color:C.text,fontWeight:600,fontSize:17,lineHeight:1.35,marginTop:12}}>{es}</p></Card><div style={{display:"grid",gap:10}}><Btn full dark onClick={onBack}>TERUG NAAR MENU</Btn><Btn full color={C.magenta} small onClick={onReset}>NIEUWE AVOND</Btn></div></div>);}

// ---- SETUP + MENU ----
function Setup({players,setPlayers,spicy,setSpicy,onStart}){const [name,setName]=useState("");const add=()=>{const n=name.trim();if(!n||players.length>=20)return;setPlayers([...players,{id:Date.now()+Math.random(),name:n,score:0}]);setName("");};return(<div><div style={{textAlign:"center",marginBottom:28}}><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:48,letterSpacing:"0.04em",lineHeight:1}}>NIGHTSHIFT</p><p style={{color:C.muted,fontWeight:700,letterSpacing:"0.2em",fontSize:11,marginTop:8}}>PARTYGAME - 18+</p></div><p style={{color:C.muted,fontWeight:700,fontSize:13,marginBottom:8}}>Spelers ({players.length}/20)</p><div style={{display:"flex",gap:10,marginBottom:14}}><input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Naam toevoegen" style={{flex:1,padding:"14px 16px",borderRadius:16,background:C.surface2,color:C.text,border:`1px solid ${C.line}`,outline:"none",fontSize:16}}/><Btn color={C.lime} onClick={add}>+</Btn></div><div style={{display:"grid",gap:8,marginBottom:18}}>{players.map(p=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderRadius:16,background:C.surface,border:`1px solid ${C.line}`}}><span style={{color:C.text,fontWeight:600}}>{p.name}</span><button onClick={()=>setPlayers(players.filter(x=>x.id!==p.id))} style={{background:"none",border:"none",color:C.magenta,fontWeight:800,fontSize:18,cursor:"pointer"}}>x</button></div>))}{!players.length&&<p style={{color:C.muted,fontSize:14,textAlign:"center",padding:18}}>Voeg minimaal 3 spelers toe.</p>}</div><button onClick={()=>setSpicy(!spicy)} style={{width:"100%",padding:14,borderRadius:16,background:C.surface,border:`1px solid ${spicy?C.magenta:C.line}`,color:spicy?C.magenta:C.muted,fontWeight:800,fontSize:14,cursor:"pointer",marginBottom:14}}>{"\u{1F336}\u{FE0F}"} Spicy 18+: {spicy?"AAN":"uit"}</button><Btn full color={C.lime} onClick={onStart}>{players.length>=3?"START DE AVOND":"MINIMAAL 3 SPELERS"}</Btn></div>);}

function GameMenu({players,onPick,onScores,onEinde,onReset}){const leader=[...players].sort((a,b)=>b.score-a.score)[0];const items=[{k:"actie",title:"Voer uit of drink",desc:`${ACTIE_R} rondes - opdrachten`,color:C.lime},{k:"wie",title:"Wie van de groep",desc:`${WIE_R} rondes - stemmen + straf`,color:C.cyan},{k:"missie",title:"Snelle Missies",desc:`${MISSIE_R} rondes - doe het NU, groep oordeelt`,color:C.gold},{k:"koning",title:"De Koning",desc:`${KONING_R} rondes - extreme bevelen`,color:C.magenta},{k:"dobbel",title:"Dobbelgeluk",desc:`${DOBBEL_R} rondes - duels, atjes, doorschuiven`,color:C.orange}];return(<div><div style={{textAlign:"center",marginBottom:8}}><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:32}}>KIES EEN SPEL</p></div>{leader&&leader.score>0&&<div style={{textAlign:"center",marginBottom:18}}><p style={{color:C.muted,fontSize:12}}>Koploper: <span style={{color:C.lime,fontWeight:800}}>{leader.name}</span> - {leader.score} pt</p></div>}<div style={{display:"grid",gap:12,marginBottom:18}}>{items.map(it=>(<button key={it.k} onClick={()=>onPick(it.k)} style={{width:"100%",textAlign:"left",padding:"18px 20px",borderRadius:22,background:C.surface,border:`1px solid ${C.line}`,borderLeft:`4px solid ${it.color}`,cursor:"pointer"}} onPointerDown={e=>e.currentTarget.style.transform="scale(0.98)"} onPointerUp={e=>e.currentTarget.style.transform="scale(1)"}><p style={{color:it.color,fontWeight:800,fontSize:18}}>{it.title}</p><p style={{color:C.muted,fontSize:14,marginTop:4}}>{it.desc}</p></button>))}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><Btn dark full small onClick={onScores}>SCORES</Btn><Btn dark full small onClick={onEinde}>EINDSTAND</Btn><Btn dark full small onClick={onReset}>RESET</Btn></div></div>);}

export default function App(){const [screen,setScreen]=useState("setup");const [players,setPlayers]=useState([]);const [spicy,setSpicy]=useState(false);const addScore=(id,pts)=>setPlayers(ps=>ps.map(p=>p.id===id?{...p,score:p.score+pts}:p));const reset=()=>{setPlayers([]);setScreen("setup");};return(<div style={{background:C.bg,minHeight:"100vh",color:C.text}}><style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Bricolage+Grotesque:wght@400;600;700;800&display=swap');*{font-family:'Bricolage Grotesque',system-ui,sans-serif;box-sizing:border-box;margin:0;padding:0}input::placeholder{color:${C.muted}}button{font-family:inherit}`}</style><div style={{maxWidth:440,margin:"0 auto",minHeight:"100vh",padding:"28px 20px 40px",backgroundImage:`radial-gradient(120% 80% at 50% -10%,${C.magenta}14,transparent 60%),radial-gradient(100% 60% at 50% 110%,${C.cyan}10,transparent 55%)`}}>{screen==="setup"&&<Setup players={players} setPlayers={setPlayers} spicy={spicy} setSpicy={setSpicy} onStart={()=>players.length>=3&&setScreen("menu")}/>}{screen==="menu"&&<GameMenu players={players} onPick={k=>setScreen(k)} onScores={()=>setScreen("scores")} onEinde={()=>setScreen("einde")} onReset={reset}/>}{screen==="actie"&&<Actie players={players} addScore={addScore} spicy={spicy} onBack={()=>setScreen("menu")}/>}{screen==="wie"&&<Wie players={players} addScore={addScore} spicy={spicy} onBack={()=>setScreen("menu")}/>}{screen==="missie"&&<Missie players={players} addScore={addScore} onBack={()=>setScreen("menu")}/>}{screen==="koning"&&<Koning players={players} addScore={addScore} onBack={()=>setScreen("menu")}/>}{screen==="dobbel"&&<Dobbel players={players} addScore={addScore} onBack={()=>setScreen("menu")}/>}{screen==="scores"&&<Scores players={players} onBack={()=>setScreen("menu")}/>}{screen==="einde"&&<Einde players={players} onBack={()=>setScreen("menu")} onReset={reset}/>}</div></div>);}
