import React,{useState,useEffect,useRef,useMemo,useCallback} from'react'
import QRCode from'qrcode'
import{db}from'./supabase.js'
import{ALL,EINDSTRAFFEN,DICE_FX_POOL}from'./data.js'

const C={bg:"#0B0B12",surface:"#171723",surface2:"#1F1F2E",line:"#2A2A3C",text:"#F4F4F7",muted:"#8A8AA0",lime:"#CCFF42",magenta:"#FF3D77",cyan:"#34E0FF",gold:"#FFC94D",orange:"#FF8A3D",purple:"#A78BFA",pink:"#FF6B9D"}
const rand=a=>a[Math.floor(Math.random()*a.length)]
const shuffle=a=>[...a].sort(()=>Math.random()-0.5)
const pool=(cat,tiers)=>ALL.filter(o=>o.cat===cat&&(o.tier==="party"||tiers[o.tier]))
const genCode=()=>Array.from({length:4},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random()*23)]).join('')
const genId=()=>Math.random().toString(36).slice(2,10)
const MD={1:{l:"MAKKELIJK",c:C.lime},2:{l:"GEMIDDELD",c:C.cyan},3:{l:"HEFTIG",c:C.magenta}}
const R={actie:10,wie:8,missie:10,koning:8,dobbel:10,nhie:10,ba:10,versus:10,groep:8}
const POLL_MS=2000

const Pill=({children,color})=>(<span style={{display:"inline-block",padding:"5px 13px",borderRadius:999,fontSize:11,letterSpacing:"0.12em",fontWeight:800,background:color+"1F",color,border:`1px solid ${color}55`}}>{children}</span>)
const Btn=({children,onClick,color=C.lime,dark,full,small,disabled})=>(
  <button onClick={onClick} disabled={disabled} style={{width:full?"100%":"auto",padding:small?"12px 16px":"16px 24px",borderRadius:18,fontWeight:800,fontSize:small?13:15,cursor:disabled?"default":"pointer",background:disabled?C.surface2:dark?C.surface2:color,color:disabled?C.muted:dark?C.text:"#0B0B12",border:dark?`1px solid ${C.line}`:"none",boxShadow:dark||disabled?"none":`0 6px 24px ${color}40`,opacity:disabled?0.5:1,transition:"transform 0.08s"}} onPointerDown={e=>{if(!disabled)e.currentTarget.style.transform="scale(0.96)"}} onPointerUp={e=>e.currentTarget.style.transform="scale(1)"}>{children}</button>
)
const Hdr=({title,sub,onBack})=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontWeight:700,fontSize:14,cursor:"pointer"}}>‹ Terug</button>
    <div style={{textAlign:"center"}}><span style={{color:C.muted,fontWeight:800,letterSpacing:"0.18em",fontSize:11}}>{title}</span>{sub&&<p style={{color:C.cyan,fontSize:11,fontWeight:700,marginTop:2}}>{sub}</p>}</div>
    <span style={{width:50}}/>
  </div>
)
const Card=({children,border,style:s})=>(<div style={{background:C.surface,border:`1px solid ${border||C.line}`,borderRadius:24,padding:24,...s}}>{children}</div>)
const Input=({value,onChange,onKey,placeholder,autoFocus})=>(
  <input value={value} onChange={e=>onChange(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onKey?.()} placeholder={placeholder} autoFocus={autoFocus} style={{width:"100%",padding:"14px 16px",borderRadius:16,background:C.surface2,color:C.text,border:`1px solid ${C.line}`,outline:"none",fontSize:16,boxSizing:"border-box"}}/>
)
const Done=({title,color,onBack})=>(<div><Hdr title={title} onBack={onBack}/><Card border={color+"55"} style={{textAlign:"center"}}><p style={{color,fontFamily:"Anton,sans-serif",fontSize:28}}>KLAAR!</p></Card><div style={{height:12}}/><Btn full onClick={onBack}>TERUG</Btn></div>)
const DiceSvg=({n,rolling})=>{const pos={1:[[50,50]],2:[[25,25],[75,75]],3:[[25,25],[50,50],[75,75]],4:[[25,25],[75,25],[25,75],[75,75]],5:[[25,25],[75,25],[50,50],[25,75],[75,75]],6:[[25,20],[75,20],[25,50],[75,50],[25,80],[75,80]]};return(<svg viewBox="0 0 100 100" width="100" height="100"><rect x="5" y="5" width="90" height="90" rx="16" fill={C.surface2} stroke={rolling?C.cyan:C.gold} strokeWidth="3"/>{(pos[n]||[]).map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="9" fill={rolling?C.cyan:C.gold}/>))}</svg>)}

function QRDisplay({url}){
  const[src,setSrc]=useState('')
  useEffect(()=>{QRCode.toDataURL(url,{width:200,margin:2,color:{dark:'#0B0B12',light:'#CCFF42'}}).then(setSrc).catch(console.error)},[url])
  return src?<img src={src} alt="QR" style={{width:180,height:180,borderRadius:16}}/>:<div style={{width:180,height:180,background:C.surface2,borderRadius:16}}/>
}

function Home({onCreate,onJoin}){
  const[name,setName]=useState('')
  const[joinCode,setJoinCode]=useState('')
  const[tab,setTab]=useState('create')
  const[loading,setLoading]=useState(false)
  const valid=name.trim().length>=2
  useEffect(()=>{const p=new URLSearchParams(window.location.search);const r=p.get("room");if(r&&r.length===4){setJoinCode(r.toUpperCase());setTab('join')}},[])
  const doJoin=async()=>{if(!valid||joinCode.length!==4)return;setLoading(true);await onJoin(name.trim(),joinCode.toUpperCase());setLoading(false)}
  return(
    <div>
      <div style={{textAlign:"center",marginBottom:32,paddingTop:12}}>
        <p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:52,letterSpacing:"0.04em",lineHeight:1,margin:0}}>NIGHTSHIFT</p>
        <p style={{color:C.muted,fontWeight:800,letterSpacing:"0.2em",fontSize:11,marginTop:8}}>PARTY DRINKSPEL</p>
      </div>
      <Card style={{marginBottom:16}}>
        <p style={{color:C.muted,fontWeight:700,fontSize:13,marginBottom:8}}>Jouw naam</p>
        <Input value={name} onChange={setName} placeholder="Vul je naam in" autoFocus/>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {['create','join'].map(t=>(<button key={t} onClick={()=>setTab(t)} style={{padding:"14px 0",borderRadius:16,fontWeight:800,fontSize:14,cursor:"pointer",background:tab===t?C.lime:C.surface2,color:tab===t?"#0B0B12":C.muted,border:`1px solid ${tab===t?C.lime:C.line}`}}>{t==='create'?'KAMER MAKEN':'KAMER JOINEN'}</button>))}
      </div>
      {tab==='create'&&<Btn full disabled={!valid} onClick={()=>valid&&onCreate(name.trim())}>MAAK KAMER</Btn>}
      {tab==='join'&&<div style={{display:"grid",gap:10}}>
        <div><p style={{color:C.muted,fontWeight:700,fontSize:13,marginBottom:8}}>Kamernummer</p><Input value={joinCode} onChange={v=>setJoinCode(v.toUpperCase().slice(0,4))} onKey={doJoin} placeholder="bv. KWRT"/></div>
        <Btn full disabled={!valid||joinCode.length!==4||loading} onClick={doJoin}>{loading?"Verbinden...":"JOIN"}</Btn>
      </div>}
    </div>
  )
}

function Lobby({roomCode,players,isHost,myId,tiers,setTiers,onStart,onLeave}){
  const url=`${window.location.origin}?room=${roomCode}`
  const TIER_CFG=[{k:"flirty",label:"💋 Flirty",c:C.pink},{k:"extreme",label:"💀 Extreme",c:C.magenta},{k:"genart",label:"😳 Gênant",c:C.orange},{k:"social",label:"📱 Social Media",c:C.cyan},{k:"spicy",label:"🌶️ Spicy 18+",c:"#FF4444"}]
  const[copied,setCopied]=useState(false)
  const copyCode=()=>{navigator.clipboard?.writeText(roomCode);setCopied(true);setTimeout(()=>setCopied(false),2000)}
  return(
    <div>
      <div style={{textAlign:"center",marginBottom:20}}>
        <p style={{color:C.muted,fontWeight:800,letterSpacing:"0.15em",fontSize:11}}>KAMERNUMMER</p>
        <button onClick={copyCode} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
          <p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:52,letterSpacing:"0.15em",margin:"4px 0"}}>{roomCode}</p>
        </button>
        <p style={{color:copied?C.lime:C.muted,fontSize:12,fontWeight:700,transition:"color 0.2s"}}>{copied?"✓ Gekopieerd!":"tap om te kopiëren"}</p>
      </div>
      <Card style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,marginBottom:16}}>
        <p style={{color:C.muted,fontWeight:700,fontSize:12,letterSpacing:"0.1em"}}>SCAN OM TE JOINEN</p>
        <QRDisplay url={url}/>
        <p style={{color:C.muted,fontSize:11,textAlign:"center"}}>{url}</p>
      </Card>
      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <p style={{color:C.muted,fontWeight:700,fontSize:13}}>Spelers ({players.length})</p>
          <Pill color={C.lime}>● Live</Pill>
        </div>
        <div style={{display:"grid",gap:6}}>
          {players.map((p,i)=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:12,background:C.surface2,border:`1px solid ${i===0?C.lime+"44":C.line}`}}>
            <span style={{color:C.text,fontWeight:600}}>{p.name}</span>
            {i===0&&<Pill color={C.lime}>Host</Pill>}
            {p.id===myId&&i!==0&&<Pill color={C.cyan}>Jij</Pill>}
          </div>))}
        </div>
      </Card>
      {isHost&&<Card style={{marginBottom:16}}>
        <p style={{color:C.muted,fontWeight:700,fontSize:13,marginBottom:10}}>Categorieën</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {TIER_CFG.map(t=>(<button key={t.k} onClick={()=>setTiers(prev=>({...prev,[t.k]:!prev[t.k]}))} style={{padding:12,borderRadius:14,background:C.surface,border:`1px solid ${tiers[t.k]?t.c:C.line}`,color:tiers[t.k]?t.c:C.muted,fontWeight:800,fontSize:13,cursor:"pointer",textAlign:"left"}}>{t.label}</button>))}
        </div>
      </Card>}
      <div style={{display:"grid",gap:10}}>
        {isHost&&<Btn full onClick={onStart}>START DE AVOND 🎉</Btn>}
        {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>👑 Wachten op host om te starten...</p></Card>}
        <Btn full dark small onClick={onLeave}>Verlaat kamer</Btn>
      </div>
    </div>
  )
}

function Actie({players,addScore,tiers,onBack,isHost,state,setState}){
  const p2=useMemo(()=>shuffle(pool("actie",tiers)),[tiers])
  if(!state||!players.length||!p2.length)return null
  const{turn=0,done=false}=state
  const sp=players[turn%players.length]
  const o=p2[turn%p2.length]
  const d=MD[o.m||2]
  const rn=turn+1
  if(done)return<Done title="VOER UIT OF DRINK" color={C.lime} onBack={onBack}/>
  const next=pts=>{if(pts)addScore(sp.id,pts);if(rn>=R.actie)setState({...state,done:true});else setState({...state,turn:turn+1})}
  return(
    <div>
      <Hdr title="VOER UIT OF DRINK" sub={`${rn}/${R.actie}`} onBack={isHost?onBack:null}/>
      <div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.muted,fontWeight:700,fontSize:14}}>Aan de beurt</p><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:32}}>{sp.name}</p></div>
      <Card style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><Pill color={d.c}>{d.l}</Pill><Pill color={C.gold}>+{o.p||2} PT</Pill></div>
        <p style={{color:C.text,fontWeight:600,fontSize:20,lineHeight:1.35}}>{o.t}</p>
      </Card>
      {isHost&&<div style={{display:"grid",gap:10}}><Btn full onClick={()=>next(o.p||2)}>GEDAAN +{o.p||2} pt</Btn><Btn full dark onClick={()=>next(0)}>GEWEIGERD - drink 3 slokken</Btn></div>}
      {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Host beheert de ronde</p></Card>}
    </div>
  )
}

function Wie({players,addScore,tiers,onBack,isHost,myId,sendAction,state,setState}){
  const wp=useMemo(()=>shuffle(pool("wie",tiers)),[tiers])
  const sp=useMemo(()=>pool("actie",tiers),[tiers])
  if(!state)return null
  const{ronde=0,phase="intro",votes={},straf=null,done=false}=state
  const vraag=wp[ronde%wp.length]
  const rn=ronde+1
  const myVote=votes[myId]
  const computeReveal=()=>{
    let mx=0;Object.values(votes).forEach(tid=>Object.values(votes).filter(v=>v===tid).length>mx&&(mx=Object.values(votes).filter(v=>v===tid).length))
    const winners=players.filter(p=>Object.values(votes).filter(v=>v===p.id).length===mx&&mx>0)
    return{max:mx,winners,tie:winners.length===players.length}
  }
  const startVote=()=>setState({...state,phase:"vote",votes:{},straf:rand(sp)})
  const castVote=(tid)=>{if(!myVote){const newVotes={...votes,[myId]:tid};sendAction({type:"wie_vote",votes:newVotes});setState({...state,votes:newVotes})}}
  const nextR=()=>{
    const reveal=computeReveal()
    if(!reveal.tie){const ws=new Set(reveal.winners.map(w=>w.id));players.forEach(p=>{if(ws.has(votes[p.id]))addScore(p.id,2)})}
    if(rn>=R.wie)setState({...state,done:true});else setState({...state,ronde:ronde+1,phase:"intro",votes:{},straf:null})
  }
  const allVoted=players.every(p=>votes[p.id])
  if(done)return<Done title="WIE VAN DE GROEP" color={C.cyan} onBack={onBack}/>
  const reveal=phase==="reveal"?computeReveal():null
  const slokken=reveal?Math.max(1,reveal.max):0
  return(
    <div>
      <Hdr title="WIE VAN DE GROEP" sub={`${rn}/${R.wie}`} onBack={isHost?onBack:null}/>
      {phase==="intro"&&<><Card style={{textAlign:"center",marginBottom:18}}><Pill color={C.cyan}>STEMRONDE</Pill><p style={{color:C.text,fontWeight:700,fontSize:22,lineHeight:1.35,marginTop:16}}>{vraag.t}</p></Card>{isHost&&<Btn full color={C.cyan} onClick={startVote}>BEGIN STEMMEN</Btn>}{!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Wacht op host...</p></Card>}</>}
      {phase==="vote"&&<>
        <Card border={C.cyan+"55"} style={{textAlign:"center",marginBottom:18}}><p style={{color:C.text,fontWeight:600,fontSize:17}}>{vraag.t}</p></Card>
        {myVote?<Card border={C.lime+"44"} style={{textAlign:"center",marginBottom:14}}><p style={{color:C.lime,fontWeight:800}}>✓ Stem uitgebracht!</p><p style={{color:C.muted,fontSize:13,marginTop:4}}>{Object.keys(votes).length}/{players.length} gestemd</p></Card>:<>
          <p style={{color:C.text,fontWeight:700,textAlign:"center",marginBottom:12}}>Stem op de speler die het best past:</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{players.map(p=>(<button key={p.id} onClick={()=>castVote(p.id)} disabled={p.id===myId} style={{padding:18,borderRadius:18,background:p.id===myId?C.bg:C.surface2,color:p.id===myId?C.line:C.text,fontWeight:700,border:`1px solid ${C.line}`,cursor:p.id===myId?"default":"pointer",opacity:p.id===myId?0.35:1}}>{p.name}{p.id===myId?" (jij)":""}</button>))}</div>
        </>}
        {isHost&&allVoted&&<div style={{marginTop:12}}><Btn full color={C.cyan} onClick={()=>setState({...state,phase:"reveal"})}>UITSLAG TONEN</Btn></div>}
      </>}
      {phase==="reveal"&&reveal&&<>
        {reveal.tie?<Card border={C.cyan+"55"} style={{textAlign:"center",marginBottom:14}}><Pill color={C.cyan}>GELIJKSPEL!</Pill><p style={{color:C.cyan,fontFamily:"Anton,sans-serif",fontSize:22,margin:"12px 0"}}>Iedereen drinkt 1</p></Card>:<>
          <Card border={C.magenta+"55"} style={{textAlign:"center",marginBottom:14}}><Pill color={C.magenta}>UITSLAG</Pill><p style={{color:C.text,fontWeight:600,fontSize:15,margin:"12px 0"}}>{vraag.t}</p><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:32}}>{reveal.winners.map(w=>w.name).join(" & ")}</p><p style={{color:C.muted,fontSize:14,marginTop:4}}>{reveal.max} stemmen - drinkt {slokken} slokken</p></Card>
          {straf&&<Card border={C.gold+"55"} style={{marginBottom:14}}><Pill color={C.gold}>STRAF</Pill><p style={{color:C.text,fontWeight:600,fontSize:17,lineHeight:1.35,marginTop:10}}>{straf.t}</p></Card>}
        </>}
        {isHost&&<Btn full onClick={nextR}>VOLGENDE</Btn>}
      </>}
    </div>
  )
}

function Missie({players,addScore,tiers,onBack,isHost,state,setState}){
  const mp=useMemo(()=>shuffle(pool("missie",tiers)),[tiers])
  if(!state||!players.length||!mp.length)return null
  const{turn=0,done=false}=state
  const sp=players[turn%players.length];const o=mp[turn%mp.length];const d=MD[o.m||2];const rn=turn+1
  if(done)return<Done title="SNELLE MISSIES" color={C.gold} onBack={onBack}/>
  const next=pts=>{if(pts)addScore(sp.id,pts);if(rn>=R.missie)setState({...state,done:true});else setState({...state,turn:turn+1})}
  return(
    <div>
      <Hdr title="SNELLE MISSIES" sub={`${rn}/${R.missie}`} onBack={isHost?onBack:null}/>
      <div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.muted,fontWeight:700,fontSize:14}}>Aan de beurt</p><p style={{color:C.gold,fontFamily:"Anton,sans-serif",fontSize:32}}>{sp.name}</p></div>
      <Card border={C.gold+"55"} style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><Pill color={d.c}>{d.l}</Pill><Pill color={C.gold}>+{o.p||3} PT</Pill></div><p style={{color:C.text,fontWeight:600,fontSize:20,lineHeight:1.35}}>{o.t}</p></Card>
      {isHost&&<div style={{display:"grid",gap:10}}><Btn full onClick={()=>next(o.p||3)}>GELUKT +{o.p||3} pt</Btn><Btn full dark onClick={()=>next(0)}>MISLUKT - drink {(o.m||2)+1} slokken</Btn></div>}
      {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Host beheert de ronde</p></Card>}
    </div>
  )
}

function Koning({players,addScore,tiers,onBack,isHost,state,setState}){
  const kp=useMemo(()=>shuffle(pool("koning",tiers)),[tiers])
  if(!state||!players.length||!kp.length)return null
  const{ronde=0,phase="pick",targetId=null,done=false}=state
  const king=players[ronde%players.length];const o=kp[ronde%kp.length];const target=players.find(p=>p.id===targetId);const rn=ronde+1
  if(done)return<Done title="DE KONING" color={C.gold} onBack={onBack}/>
  const nextR=()=>{if(rn>=R.koning)setState({...state,done:true});else setState({...state,ronde:ronde+1,phase:"pick",targetId:null})}
  return(
    <div>
      <Hdr title="DE KONING" sub={`${rn}/${R.koning}`} onBack={isHost?onBack:null}/>
      {phase==="pick"&&<>
        <div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.muted,fontWeight:700,fontSize:14}}>Regeert</p><p style={{color:C.gold,fontFamily:"Anton,sans-serif",fontSize:38}}>{king.name}</p></div>
        <Card border={C.gold+"55"} style={{marginBottom:18}}><Pill color={C.gold}>BEVEL</Pill><p style={{color:C.text,fontWeight:600,fontSize:20,lineHeight:1.35,marginTop:14}}>{o.t}</p></Card>
        {isHost&&<><p style={{color:C.muted,fontSize:13,textAlign:"center",marginBottom:14}}>Kies het slachtoffer:</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{players.filter(p=>p.id!==king.id).map(p=>(<button key={p.id} onClick={()=>setState({...state,phase:"ch",targetId:p.id})} style={{padding:18,borderRadius:18,background:C.surface2,color:C.text,fontWeight:700,border:`1px solid ${C.line}`,cursor:"pointer"}}>{p.name}</button>))}</div></>}
        {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>De Koning ({king.name}) kiest een slachtoffer...</p></Card>}
      </>}
      {phase==="ch"&&target&&<>
        <div style={{textAlign:"center",marginBottom:14}}><Pill color={C.gold}>{king.name} beveelt</Pill><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:32,margin:"12px 0"}}>{target.name}</p></div>
        <Card border={C.gold+"55"} style={{marginBottom:14}}><p style={{color:C.text,fontWeight:600,fontSize:18,lineHeight:1.35}}>{o.t}</p></Card>
        {isHost&&<div style={{display:"grid",gap:10}}><Btn full onClick={()=>{addScore(target.id,o.p||3);nextR()}}>GEDAAN</Btn><Btn full color={C.magenta} onClick={()=>{addScore(king.id,o.p||3);nextR()}}>GEWEIGERD - drinkt 5</Btn></div>}
        {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Host oordeelt...</p></Card>}
      </>}
    </div>
  )
}

function Dobbel({players,addScore,onBack,isHost,state,setState}){
  const[rolling,setRolling]=useState(false)
  const[dv,setDv]=useState(1)
  const timerRef=useRef(null)
  if(!state||!players.length)return null
  const{ronde=0,val=1,fx=null,phase="ready",oppId=null,d1=null,d2=null,done=false}=state
  const sp=players[ronde%players.length];const opp=players.find(p=>p.id===oppId);const rn=ronde+1
  const isDuel=fx&&fx.toUpperCase().includes("DUEL")
  const rollDice=()=>{
    if(!isHost)return;setRolling(true);const newFx=rand(DICE_FX_POOL);let c=0
    timerRef.current=setInterval(()=>{setDv(Math.floor(Math.random()*6)+1);c++;if(c>=18){clearInterval(timerRef.current);const v=Math.floor(Math.random()*6)+1;setDv(v);setRolling(false);setState({...state,phase:"result",val:v,fx:newFx})}},80)
  }
  useEffect(()=>()=>clearInterval(timerRef.current),[])
  const nextR=()=>{if(rn>=R.dobbel)setState({...state,done:true});else setState({...state,ronde:ronde+1,phase:"ready",val:1,fx:null,oppId:null,d1:null,d2:null})}
  if(done)return<Done title="DOBBELGELUK" color={C.orange} onBack={onBack}/>
  const showDv=phase==="ready"?1:phase==="result"?val:dv
  return(
    <div>
      <Hdr title="DOBBELGELUK" sub={`${rn}/${R.dobbel}`} onBack={isHost?onBack:null}/>
      <div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.muted,fontWeight:700,fontSize:14}}>Aan de beurt</p><p style={{color:C.orange,fontFamily:"Anton,sans-serif",fontSize:32}}>{sp.name}</p></div>
      {(phase==="ready"||phase==="result")&&<div style={{display:"flex",justifyContent:"center",marginBottom:20}}><DiceSvg n={showDv} rolling={rolling}/></div>}
      {phase==="ready"&&isHost&&<Btn full color={C.orange} onClick={rollDice}>GOOI</Btn>}
      {phase==="ready"&&!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Wacht op {sp.name}...</p></Card>}
      {phase==="result"&&<>
        <Card border={C.orange+"55"} style={{textAlign:"center",marginBottom:18}}><p style={{color:C.orange,fontFamily:"Anton,sans-serif",fontSize:22,marginBottom:8}}>{fx}</p></Card>
        {isDuel&&!oppId?<>{isHost&&<><p style={{color:C.magenta,fontWeight:700,textAlign:"center",marginBottom:10}}>Kies een tegenstander:</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{players.filter(p=>p.id!==sp.id).map(p=>(<button key={p.id} onClick={()=>setState({...state,phase:"duel1",oppId:p.id})} style={{padding:16,borderRadius:18,background:C.surface2,color:C.text,fontWeight:700,border:`1px solid ${C.line}`,cursor:"pointer"}}>{p.name}</button>))}</div></>}</>:<Btn full onClick={()=>{addScore(sp.id,1);nextR()}}>KLAAR +1pt</Btn>}
      </>}
      {phase==="duel1"&&opp&&<>
        <div style={{textAlign:"center",marginBottom:14}}><Pill color={C.magenta}>DUEL</Pill><p style={{color:C.text,fontWeight:700,fontSize:18,marginTop:10}}>{sp.name} vs {opp.name}</p></div>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:20}}>
          <div style={{textAlign:"center"}}><p style={{color:C.lime,fontWeight:700,fontSize:13,marginBottom:8}}>{sp.name}</p><DiceSvg n={d1||1}/>{d1&&<p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:28,marginTop:8}}>{d1}</p>}</div>
          <div style={{textAlign:"center"}}><p style={{color:C.magenta,fontWeight:700,fontSize:13,marginBottom:8}}>{opp.name}</p><DiceSvg n={d2||1}/>{d2?<p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:28,marginTop:8}}>{d2}</p>:<p style={{color:C.muted,fontSize:14,marginTop:8}}>?</p>}</div>
        </div>
        {isHost&&<>{!d1?<Btn full color={C.lime} onClick={()=>setState({...state,d1:Math.floor(Math.random()*6)+1})}>ROL {sp.name.toUpperCase()}</Btn>:!d2?<Btn full color={C.magenta} onClick={()=>{const r=Math.floor(Math.random()*6)+1;setState({...state,d2:r,phase:"duel_r"})}}>ROL {opp.name.toUpperCase()}</Btn>:null}</>}
        {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Host rolt de dobbelstenen...</p></Card>}
      </>}
      {phase==="duel_r"&&opp&&d1&&d2&&<>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginBottom:20}}>
          <div style={{textAlign:"center"}}><p style={{color:C.lime,fontWeight:700,fontSize:13,marginBottom:8}}>{sp.name}</p><DiceSvg n={d1}/><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:28,marginTop:8}}>{d1}</p></div>
          <div style={{textAlign:"center"}}><p style={{color:C.magenta,fontWeight:700,fontSize:13,marginBottom:8}}>{opp.name}</p><DiceSvg n={d2}/><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:28,marginTop:8}}>{d2}</p></div>
        </div>
        <Card border={C.magenta+"55"} style={{textAlign:"center",marginBottom:18}}>
          {d1===d2&&<p style={{color:C.cyan,fontWeight:800,fontSize:18}}>GELIJKSPEL! Beiden drinken 3.</p>}
          {d1>d2&&<p style={{color:C.magenta,fontWeight:800,fontSize:18}}>{opp.name} verliest - drinkt 5!</p>}
          {d1<d2&&<p style={{color:C.magenta,fontWeight:800,fontSize:18}}>{sp.name} verliest - drinkt 5!</p>}
        </Card>
        {isHost&&<Btn full onClick={()=>{addScore(d1>=d2?sp.id:opp.id,2);nextR()}}>VOLGENDE</Btn>}
      </>}
    </div>
  )
}

function Nhie({players,addScore,tiers,onBack,isHost,myId,sendAction,state,setState}){
  const np=useMemo(()=>shuffle(pool("nhie",tiers)),[tiers])
  if(!state)return null
  const{ronde=0,phase="intro",votes={},done=false}=state
  const pr=np[ronde%np.length];const rn=ronde+1;const myVote=votes[myId]
  const wel=players.filter(p=>votes[p.id]==="wel");const niet=players.filter(p=>votes[p.id]==="niet")
  const allVoted=players.every(p=>votes[p.id]);const allSame=allVoted&&(wel.length===0||niet.length===0)
  const minority=wel.length<=niet.length?wel:niet;const majority=wel.length>niet.length?wel:niet;const alone=allVoted&&minority.length===1
  const castVote=v=>{if(myVote)return;const newVotes={...votes,[myId]:v};sendAction({type:"nhie_vote",votes:newVotes});setState({...state,votes:newVotes})}
  const nextR=sid=>{
    if(allVoted&&!allSame){majority.forEach(p=>addScore(p.id,2));if(alone)addScore(minority[0].id,3);if(sid)addScore(sid,3)}
    if(rn>=R.nhie)setState({...state,done:true});else setState({...state,ronde:ronde+1,phase:"intro",votes:{}})
  }
  if(done)return<Done title="NEVER HAVE I EVER" color={C.purple} onBack={onBack}/>
  return(
    <div>
      <Hdr title="NEVER HAVE I EVER" sub={`${rn}/${R.nhie}`} onBack={isHost?onBack:null}/>
      {phase==="intro"&&<><Card border={C.purple+"55"} style={{textAlign:"center",marginBottom:18}}><Pill color={C.purple}>IK HEB NOG NOOIT...</Pill><p style={{color:C.text,fontWeight:700,fontSize:22,lineHeight:1.35,marginTop:16}}>{pr.t}</p></Card>{isHost&&<Btn full color={C.purple} onClick={()=>setState({...state,phase:"vote",votes:{}})}>BEGIN STEMMEN</Btn>}{!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Wacht op host...</p></Card>}</>}
      {phase==="vote"&&<>
        <Card border={C.purple+"55"} style={{textAlign:"center",marginBottom:18}}><Pill color={C.purple}>IK HEB NOG NOOIT...</Pill><p style={{color:C.text,fontWeight:600,fontSize:18,lineHeight:1.35,marginTop:12}}>{pr.t}</p></Card>
        {myVote?<Card border={C.lime+"44"} style={{textAlign:"center",marginBottom:14}}><p style={{color:C.lime,fontWeight:800}}>✓ Gestemd!</p><p style={{color:C.muted,fontSize:13,marginTop:4}}>{Object.keys(votes).length}/{players.length} gestemd</p></Card>:<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Btn full color={C.lime} onClick={()=>castVote("wel")}>WEL GEDAAN</Btn><Btn full color={C.magenta} onClick={()=>castVote("niet")}>NOOIT</Btn></div>}
        {allVoted&&isHost&&<div style={{marginTop:12}}><Btn full color={C.purple} onClick={()=>setState({...state,phase:"reveal"})}>UITSLAG TONEN</Btn></div>}
      </>}
      {phase==="reveal"&&<>
        <Card border={C.purple+"55"} style={{textAlign:"center",marginBottom:14}}>
          <p style={{color:C.text,fontWeight:600,fontSize:16,marginBottom:14}}>{pr.t}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><Pill color={C.lime}>WEL ({wel.length})</Pill>{wel.map(p=>(<p key={p.id} style={{color:C.lime,fontWeight:700,fontSize:15,marginTop:4}}>{p.name}</p>))}</div>
            <div><Pill color={C.magenta}>NIET ({niet.length})</Pill>{niet.map(p=>(<p key={p.id} style={{color:C.magenta,fontWeight:700,fontSize:15,marginTop:4}}>{p.name}</p>))}</div>
          </div>
        </Card>
        <Card border={C.gold+"55"} style={{marginBottom:14}}>
          {allSame&&<><Pill color={C.orange}>WATERVAL!</Pill><p style={{color:C.text,fontWeight:700,fontSize:16,marginTop:10}}>Iedereen hetzelfde → WATERVAL!</p></>}
          {!allSame&&alone&&<><Pill color={C.magenta}>ALLEEN!</Pill><p style={{color:C.text,fontWeight:700,fontSize:16,marginTop:10}}>{minority[0].name} drinkt 5 + vertelt het verhaal</p></>}
          {!allSame&&!alone&&<><Pill color={C.magenta}>MINDERHEID DRINKT</Pill><p style={{color:C.text,fontWeight:700,fontSize:16,marginTop:10}}>{minority.map(p=>p.name).join(", ")} drinkt {majority.length} slokken</p></>}
        </Card>
        {isHost&&!allSame&&<><p style={{color:C.muted,fontSize:13,textAlign:"center",marginBottom:10}}>Beste verhaal? Die deelt 3 uit.</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>{players.map(p=>(<button key={p.id} onClick={()=>nextR(p.id)} style={{padding:14,borderRadius:18,background:C.surface2,color:C.text,fontWeight:700,border:`1px solid ${C.line}`,cursor:"pointer"}}>{p.name}</button>))}</div></>}
        {isHost&&allSame&&<Btn full onClick={()=>nextR(null)}>VOLGENDE</Btn>}
        {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Host beheert de uitslag</p></Card>}
      </>}
    </div>
  )
}

function BesteAntwoord({players,addScore,tiers,onBack,isHost,myId,sendAction,state,setState}){
  const bp=useMemo(()=>shuffle(pool("ba",tiers)),[tiers])
  const[input,setInput]=useState("")
  if(!state)return null
  const{ronde=0,phase="intro",answers={},done=false}=state
  const pr=bp[ronde%bp.length];const rn=ronde+1;const myAnswer=answers[myId];const allAnswered=players.every(p=>answers[p.id])
  const submitAnswer=()=>{if(!input.trim()||myAnswer)return;const newAnswers={...answers,[myId]:input.trim()};sendAction({type:"ba_answer",answers:newAnswers});setState({...state,answers:newAnswers});setInput("")}
  const pick=wid=>{addScore(wid,5);if(rn>=R.ba)setState({...state,done:true});else{setState({...state,ronde:ronde+1,phase:"intro",answers:{}});setInput("")}}
  if(done)return<Done title="BESTE ANTWOORD" color={C.gold} onBack={onBack}/>
  return(
    <div>
      <Hdr title="BESTE ANTWOORD" sub={`${rn}/${R.ba}`} onBack={isHost?onBack:null}/>
      {phase==="intro"&&<><Card border={C.gold+"55"} style={{textAlign:"center",marginBottom:18}}><Pill color={C.gold}>VRAAG</Pill><p style={{color:C.text,fontWeight:700,fontSize:22,lineHeight:1.35,marginTop:16}}>{pr.t}</p></Card>{isHost&&<Btn full color={C.gold} onClick={()=>setState({...state,phase:"type",answers:{}})}>BEGIN</Btn>}{!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Wacht op host...</p></Card>}</>}
      {phase==="type"&&<>
        <Card border={C.gold+"55"} style={{marginBottom:18}}><Pill color={C.gold}>VRAAG</Pill><p style={{color:C.text,fontWeight:600,fontSize:17,lineHeight:1.35,marginTop:12}}>{pr.t}</p></Card>
        {myAnswer?<Card border={C.lime+"44"} style={{textAlign:"center",marginBottom:14}}><p style={{color:C.lime,fontWeight:800}}>✓ Antwoord ingevoerd!</p><p style={{color:C.muted,fontSize:13,marginTop:4}}>{Object.keys(answers).length}/{players.length} klaar</p></Card>:<><Input value={input} onChange={setInput} onKey={submitAnswer} placeholder="Typ je antwoord..."/><div style={{marginTop:10}}><Btn full color={C.gold} disabled={!input.trim()} onClick={submitAnswer}>VERZEND</Btn></div></>}
        {isHost&&allAnswered&&<div style={{marginTop:12}}><Btn full color={C.gold} onClick={()=>setState({...state,phase:"reveal"})}>ANTWOORDEN TONEN</Btn></div>}
      </>}
      {phase==="reveal"&&<>
        <Card border={C.gold+"55"} style={{marginBottom:14}}><Pill color={C.gold}>ANTWOORDEN</Pill><p style={{color:C.muted,fontSize:14,marginTop:8,marginBottom:14}}>{pr.t}</p>{players.map(p=>(<div key={p.id} style={{padding:"12px 16px",borderRadius:14,background:C.surface2,marginBottom:8,border:`1px solid ${C.line}`}}><p style={{color:C.muted,fontSize:12,fontWeight:700}}>{p.name}</p><p style={{color:C.text,fontWeight:600,fontSize:16,marginTop:4}}>{answers[p.id]||"..."}</p></div>))}</Card>
        {isHost&&<><p style={{color:C.muted,fontSize:13,textAlign:"center",marginBottom:10}}>Beste antwoord? +5 pt + deelt 4 uit.</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{players.map(p=>(<button key={p.id} onClick={()=>pick(p.id)} style={{padding:16,borderRadius:18,background:C.surface2,color:C.text,fontWeight:700,border:`1px solid ${C.line}`,cursor:"pointer"}}>{p.name}</button>))}</div></>}
        {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Host kiest het beste antwoord...</p></Card>}
      </>}
    </div>
  )
}

function Versus({players,addScore,tiers,onBack,isHost,state,setState}){
  const vp=useMemo(()=>shuffle(pool("versus",tiers)),[tiers])
  if(!state||!players.length||!vp.length)return null
  const{ronde=0,phase="pick",oppId=null,winnerId=null,drinksLeft=0,drinksGiven={},done=false}=state
  const sp=players[ronde%players.length];const o=vp[ronde%vp.length];const d=MD[o.m||2]
  const opp=players.find(p=>p.id===oppId);const winner=players.find(p=>p.id===winnerId);const rn=ronde+1;const dealAmt=(o.m||2)+1
  if(done)return<Done title="VERSUS / DUELS" color={C.magenta} onBack={onBack}/>
  const nextR=()=>{if(rn>=R.versus)setState({...state,done:true});else setState({...state,ronde:ronde+1,phase:"pick",oppId:null,winnerId:null,drinksLeft:0,drinksGiven:{}})}
  const handleWin=w=>{addScore(w.id,o.p||3);setState({...state,phase:"deal",winnerId:w.id,drinksLeft:dealAmt,drinksGiven:{}})}
  const giveDrink=pid=>{if(drinksLeft<=0)return;const ng={...drinksGiven,[pid]:(drinksGiven[pid]||0)+1};setState({...state,drinksGiven:ng,drinksLeft:drinksLeft-1})}
  return(
    <div>
      <Hdr title="VERSUS / DUELS" sub={`${rn}/${R.versus}`} onBack={isHost?onBack:null}/>
      {phase==="pick"&&<>
        <div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.muted,fontWeight:700,fontSize:14}}>Uitdager</p><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:32}}>{sp.name}</p></div>
        <Card border={C.magenta+"55"} style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><Pill color={d.c}>{d.l}</Pill><Pill color={C.gold}>+{o.p||3} PT</Pill></div><p style={{color:C.text,fontWeight:600,fontSize:20,lineHeight:1.35}}>{o.t}</p></Card>
        {isHost&&<><p style={{color:C.muted,fontSize:13,textAlign:"center",marginBottom:14}}>Kies tegenstander:</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{players.filter(p=>p.id!==sp.id).map(p=>(<button key={p.id} onClick={()=>setState({...state,phase:"battle",oppId:p.id})} style={{padding:18,borderRadius:18,background:C.surface2,color:C.text,fontWeight:700,border:`1px solid ${C.line}`,cursor:"pointer"}}>{p.name}</button>))}</div></>}
        {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Host kiest de tegenstanders...</p></Card>}
      </>}
      {phase==="battle"&&opp&&<>
        <div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:26}}>{sp.name} vs {opp.name}</p></div>
        <Card border={C.magenta+"55"} style={{marginBottom:18}}><Pill color={d.c}>{d.l}</Pill><p style={{color:C.text,fontWeight:600,fontSize:20,lineHeight:1.35,marginTop:14}}>{o.t}</p></Card>
        {isHost&&<><p style={{color:C.muted,fontSize:13,textAlign:"center",marginBottom:14}}>Groep oordeelt:</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><Btn full color={C.lime} onClick={()=>handleWin(sp)}>{sp.name} WINT</Btn><Btn full color={C.magenta} onClick={()=>handleWin(opp)}>{opp.name} WINT</Btn></div><div style={{marginTop:10}}><Btn full dark onClick={nextR}>GELIJKSPEL - beiden drinken 2</Btn></div></>}
        {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Host oordeelt...</p></Card>}
      </>}
      {phase==="deal"&&winner&&<>
        <Card border={C.lime+"55"} style={{textAlign:"center",marginBottom:18}}><Pill color={C.lime}>WINNAAR</Pill><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:36,margin:"12px 0"}}>{winner.name}</p><p style={{color:C.gold,fontWeight:800,fontSize:15}}>+{o.p||3} pt</p></Card>
        {isHost&&<>{drinksLeft>0?<><div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.text,fontWeight:700,fontSize:16}}>Deel nog <span style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:28}}>{drinksLeft}</span> slokken uit</p></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>{players.filter(p=>p.id!==winner.id).map(p=>(<button key={p.id} onClick={()=>giveDrink(p.id)} style={{padding:"14px 10px",borderRadius:18,background:C.surface,border:`1px solid ${drinksGiven[p.id]?C.magenta:C.line}`,cursor:"pointer",textAlign:"center"}}><p style={{color:C.text,fontWeight:700,fontSize:15}}>{p.name}</p>{drinksGiven[p.id]?<p style={{color:C.magenta,fontWeight:800,fontSize:13,marginTop:3}}>{drinksGiven[p.id]} slok{drinksGiven[p.id]>1?"ken":""}</p>:<p style={{color:C.muted,fontSize:12,marginTop:3}}>tap</p>}</button>))}</div><Btn full dark small onClick={nextR}>SNEL SKIP</Btn></>:<Btn full color={C.lime} onClick={nextR}>VOLGENDE RONDE</Btn>}</>}
        {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.lime,fontWeight:700}}>{winner.name} deelt slokken uit!</p></Card>}
      </>}
    </div>
  )
}

function Groep({players,addScore,tiers,onBack,isHost,state,setState}){
  const gp=useMemo(()=>shuffle(pool("groep",tiers)),[tiers])
  if(!state)return null
  const{ronde=0,done=false}=state;const o=gp[ronde%gp.length];const rn=ronde+1
  if(done)return<Done title="GROEPSCHALLENGES" color={C.cyan} onBack={onBack}/>
  const next=()=>{if(rn>=R.groep)setState({...state,done:true});else setState({...state,ronde:ronde+1})}
  return(
    <div>
      <Hdr title="GROEPSCHALLENGES" sub={`${rn}/${R.groep}`} onBack={isHost?onBack:null}/>
      <div style={{textAlign:"center",marginBottom:14}}><p style={{color:C.cyan,fontFamily:"Anton,sans-serif",fontSize:28}}>HELE GROEP</p></div>
      <Card border={C.cyan+"55"} style={{marginBottom:18}}><Pill color={C.cyan}>GROEPSCHALLENGE</Pill><p style={{color:C.text,fontWeight:600,fontSize:20,lineHeight:1.35,marginTop:14}}>{o.t}</p></Card>
      {isHost&&<Btn full color={C.cyan} onClick={next}>KLAAR - VOLGENDE</Btn>}
      {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center"}}><p style={{color:C.muted,fontSize:14}}>Wacht op host...</p></Card>}
    </div>
  )
}

function Scores({players,onBack}){
  const sorted=[...players].sort((a,b)=>b.score-a.score)
  const medal=["#FFC94D","#C9D1D9","#CD7F32"]
  return(<div><Hdr title="SCOREBORD" onBack={onBack}/><div style={{display:"grid",gap:10}}>{sorted.map((p,i)=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderRadius:18,background:C.surface,border:`1px solid ${i<3?medal[i]+"55":C.line}`}}><div style={{display:"flex",alignItems:"center",gap:12}}><span style={{color:i<3?medal[i]:C.muted,fontFamily:"Anton,sans-serif",fontSize:22,width:26}}>{i+1}</span><span style={{color:C.text,fontWeight:700,fontSize:18}}>{p.name}</span></div><span style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:26}}>{p.score}</span></div>))}</div></div>)
}

function Einde({players,onBack,onReset}){
  const sorted=[...players].sort((a,b)=>b.score-a.score)
  const w=sorted[0];const l=sorted[sorted.length-1];const es=rand(EINDSTRAFFEN)
  return(<div><Hdr title="EINDSTAND" onBack={onBack}/><Card border={C.gold+"55"} style={{textAlign:"center",marginBottom:14}}><p style={{fontSize:40,marginBottom:4}}>👑</p><p style={{color:C.gold,fontFamily:"Anton,sans-serif",fontSize:28}}>{w.name}</p><p style={{color:C.muted,fontWeight:700,fontSize:13,marginTop:4}}>HEERSER VAN DE NACHT</p><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:22,marginTop:8}}>{w.score} pt</p></Card><Card border={C.magenta+"55"} style={{textAlign:"center",marginBottom:14}}><p style={{fontSize:40,marginBottom:4}}>💀</p><p style={{color:C.magenta,fontFamily:"Anton,sans-serif",fontSize:28}}>{l.name}</p><p style={{color:C.muted,fontWeight:700,fontSize:13,marginTop:4}}>VERLIEZER VAN DE NACHT</p></Card><Card border={C.magenta+"55"} style={{marginBottom:14}}><Pill color={C.magenta}>EINDSTRAF</Pill><p style={{color:C.text,fontWeight:600,fontSize:17,lineHeight:1.35,marginTop:12}}>{es}</p></Card><div style={{display:"grid",gap:10}}><Btn full dark onClick={onBack}>MENU</Btn><Btn full color={C.magenta} small onClick={onReset}>NIEUWE AVOND</Btn></div></div>)
}

function GameMenu({players,isHost,onPick,onScores,onEinde,onReset}){
  const leader=[...players].sort((a,b)=>b.score-a.score)[0]
  const items=[{k:"actie",t:"Voer uit of drink",d:`${R.actie}x`,c:C.lime},{k:"wie",t:"Wie van de groep",d:`${R.wie}x stemmen`,c:C.cyan},{k:"missie",t:"Snelle Missies",d:`${R.missie}x direct`,c:C.gold},{k:"koning",t:"De Koning",d:`${R.koning}x bevelen`,c:C.orange},{k:"dobbel",t:"Dobbelgeluk",d:`${R.dobbel}x`,c:"#FF8A3D"},{k:"nhie",t:"Never Have I Ever",d:`${R.nhie}x iedereen stemt`,c:C.purple},{k:"ba",t:"Beste Antwoord",d:`${R.ba}x iedereen typt`,c:C.pink},{k:"versus",t:"Versus / Duels",d:`${R.versus}x head-to-head`,c:C.magenta},{k:"groep",t:"Groepschallenges",d:`${R.groep}x iedereen`,c:C.cyan}]
  return(
    <div>
      <div style={{textAlign:"center",marginBottom:8}}><p style={{color:C.lime,fontFamily:"Anton,sans-serif",fontSize:32}}>KIES EEN SPEL</p></div>
      {leader&&leader.score>0&&<p style={{color:C.muted,fontSize:12,textAlign:"center",marginBottom:14}}>Koploper: <span style={{color:C.lime,fontWeight:800}}>{leader.name}</span> {leader.score}pt</p>}
      {!isHost&&<Card border={C.cyan+"44"} style={{textAlign:"center",marginBottom:14}}><p style={{color:C.muted,fontSize:13}}>👑 Host kiest de volgende game...</p></Card>}
      <div style={{display:"grid",gap:10,marginBottom:14}}>
        {items.map(it=>(<button key={it.k} onClick={()=>isHost&&onPick(it.k)} style={{width:"100%",textAlign:"left",padding:"16px 18px",borderRadius:20,background:C.surface,border:`1px solid ${C.line}`,borderLeft:`4px solid ${it.c}`,cursor:isHost?"pointer":"default",opacity:isHost?1:0.7}}><p style={{color:it.c,fontWeight:800,fontSize:17}}>{it.t}</p><p style={{color:C.muted,fontSize:13,marginTop:2}}>{it.d}</p></button>))}
      </div>
      {isHost&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><Btn dark full small onClick={onScores}>SCORES</Btn><Btn dark full small onClick={onEinde}>EINDE</Btn><Btn dark full small onClick={onReset}>RESET</Btn></div>}
    </div>
  )
}

const TIER_DEFAULTS={flirty:false,extreme:false,genart:false,social:false,spicy:false}

export default function App(){
  const[screen,setScreen]=useState("home")
  const[isHost,setIsHost]=useState(false)
  const[roomCode,setRoomCode]=useState(null)
  const[players,setPlayers]=useState([])
  const[tiers,setTiers]=useState(TIER_DEFAULTS)
  const[currentMode,setCurrentMode]=useState(null)
  const[modeState,setModeState]=useState(null)
  const myIdRef=useRef(genId())
  const myPlayerRef=useRef(null)
  const pollRef=useRef(null)
  const lastStateRef=useRef(null)
  const saveTimerRef=useRef(null)

  const startPolling=useCallback((code,hosting)=>{
    if(pollRef.current)clearInterval(pollRef.current)
    pollRef.current=setInterval(async()=>{
      if(myPlayerRef.current){
        await db.upsertPlayer(code,myPlayerRef.current)
      }
      if(hosting){
        const dbPlayers=await db.getPlayers(code)
        if(dbPlayers.length>0){
          setPlayers(prev=>{
            const merged=dbPlayers.map(dp=>{const ex=prev.find(p=>p.id===dp.id);return ex?{...ex}:{...dp,score:0}})
            return merged
          })
        }
      } else {
        const data=await db.getState(code)
        if(data&&data.state){
          const s=data.state
          const key=JSON.stringify({sc:s.screen,cm:s.currentMode,ms:s.modeState,pl:s.players})
          if(key!==lastStateRef.current){
            lastStateRef.current=key
            if(s.players)setPlayers(s.players)
            if(s.tiers)setTiers(s.tiers)
            if(s.screen)setScreen(s.screen)
            if(s.currentMode!==undefined)setCurrentMode(s.currentMode)
            if(s.modeState!==undefined)setModeState(s.modeState)
          }
        }
      }
    },POLL_MS)
  },[])

  useEffect(()=>{
    if(!isHost||!roomCode)return
    if(saveTimerRef.current)clearTimeout(saveTimerRef.current)
    saveTimerRef.current=setTimeout(()=>{
      db.saveState(roomCode,{players,tiers,screen,currentMode,modeState})
    },300)
  },[players,tiers,screen,currentMode,modeState,isHost,roomCode])

  const handleCreate=async(name)=>{
    const id=myIdRef.current;const player={id,name,score:0}
    myPlayerRef.current=player
    const code=genCode()
    setIsHost(true);setRoomCode(code);setPlayers([player]);setTiers(TIER_DEFAULTS);setScreen("lobby")
    await db.upsertPlayer(code,player)
    // Sla hostId op zodat clients weten wie de host is
    await db.saveState(code,{hostId:id,players:[player],tiers:TIER_DEFAULTS,screen:"lobby",currentMode:null,modeState:null})
    window.history.replaceState({},"",`?room=${code}`)
    startPolling(code,true)
  }

  const handleJoin=async(name,code)=>{
    const id=myIdRef.current;const player={id,name,score:0}
    myPlayerRef.current=player
    // Check of kamer bestaat
    const data=await db.getState(code)
    if(!data||!data.state){alert("Kamer niet gevonden. Controleer de code.");return}
    setIsHost(false);setRoomCode(code);setPlayers([player]);setScreen("lobby")
    await db.upsertPlayer(code,player)
    window.history.replaceState({},"",`?room=${code}`)
    startPolling(code,false)
  }

  const handleLeave=()=>{
    if(pollRef.current)clearInterval(pollRef.current)
    if(isHost&&roomCode)db.deleteRoom(roomCode)
    setScreen("home");setIsHost(false);setRoomCode(null)
    setPlayers([]);setCurrentMode(null);setModeState(null)
    window.history.replaceState({},"","/")
  }

  const addScore=(id,pts)=>setPlayers(prev=>prev.map(p=>p.id===id?{...p,score:p.score+pts}:p))

  const sendAction=useCallback((action)=>{
    if(!roomCode)return
    db.getState(roomCode).then(data=>{
      if(!data||!data.state)return
      const s=data.state;let ms=s.modeState
      if(!ms)return
      if(action.type==="nhie_vote"||action.type==="wie_vote")ms={...ms,votes:{...ms.votes,...action.votes}}
      if(action.type==="ba_answer")ms={...ms,answers:{...ms.answers,...action.answers}}
      db.saveState(roomCode,{...s,modeState:ms})
    })
  },[roomCode])

  const pickMode=(mode)=>{
    setCurrentMode(mode)
    setModeState({turn:0,ronde:0,phase:"intro",done:false,votes:{},answers:{},oppId:null,winnerId:null,drinksLeft:0,drinksGiven:{},d1:null,d2:null,fx:null,val:1,targetId:null,straf:null})
  }
  const handleModeBack=()=>{setCurrentMode("menu");setModeState(null)}
  const modeProps={players,addScore,tiers,isHost,myId:myIdRef.current,sendAction,onBack:handleModeBack,state:modeState,setState:setModeState}

  useEffect(()=>()=>{if(pollRef.current)clearInterval(pollRef.current)},[])

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Bricolage+Grotesque:wght@400;600;700;800&display=swap');*{font-family:'Bricolage Grotesque',system-ui,sans-serif;box-sizing:border-box;margin:0;padding:0}input::placeholder{color:${C.muted}}button{font-family:inherit}`}</style>
      <div style={{maxWidth:440,margin:"0 auto",minHeight:"100vh",padding:"28px 20px 48px",backgroundImage:`radial-gradient(120% 80% at 50% -10%,${C.magenta}14,transparent 60%),radial-gradient(100% 60% at 50% 110%,${C.cyan}10,transparent 55%)`}}>
        {screen==="home"&&<Home onCreate={handleCreate} onJoin={handleJoin}/>}
        {screen==="lobby"&&<Lobby roomCode={roomCode} players={players} isHost={isHost} myId={myIdRef.current} tiers={tiers} setTiers={setTiers} onStart={()=>{setScreen("game");setCurrentMode("menu");setModeState(null)}} onLeave={handleLeave}/>}
        {screen==="game"&&currentMode==="menu"&&<GameMenu players={players} isHost={isHost} onPick={pickMode} onScores={()=>setCurrentMode("scores")} onEinde={()=>setCurrentMode("einde")} onReset={()=>{setPlayers(prev=>prev.map(p=>({...p,score:0})));setCurrentMode("menu");setModeState(null)}}/>}
        {screen==="game"&&currentMode==="scores"&&<Scores players={players} onBack={()=>setCurrentMode("menu")}/>}
        {screen==="game"&&currentMode==="einde"&&<Einde players={players} onBack={()=>setCurrentMode("menu")} onReset={()=>{setPlayers(prev=>prev.map(p=>({...p,score:0})));setCurrentMode("menu");setModeState(null)}}/>}
        {screen==="game"&&currentMode==="actie"&&<Actie {...modeProps}/>}
        {screen==="game"&&currentMode==="wie"&&<Wie {...modeProps}/>}
        {screen==="game"&&currentMode==="missie"&&<Missie {...modeProps}/>}
        {screen==="game"&&currentMode==="koning"&&<Koning {...modeProps}/>}
        {screen==="game"&&currentMode==="dobbel"&&<Dobbel {...modeProps}/>}
        {screen==="game"&&currentMode==="nhie"&&<Nhie {...modeProps}/>}
        {screen==="game"&&currentMode==="ba"&&<BesteAntwoord {...modeProps}/>}
        {screen==="game"&&currentMode==="versus"&&<Versus {...modeProps}/>}
        {screen==="game"&&currentMode==="groep"&&<Groep {...modeProps}/>}
      </div>
    </div>
  )
}
