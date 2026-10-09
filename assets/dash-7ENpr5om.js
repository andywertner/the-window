import{c as M,v as N,a as R,g as u,b,p as g,n as q,i as B,d as k}from"./api-B3HNgsfI.js";const A="window-dash-v1",L="window-dash-mine",$="dash-n-",j="dash-k-",p="dash-welcome",O="Welcome to the class message board!",w=["GET","POST","PATCH","DELETE"],y={GET:"👀",POST:"➕",PATCH:"🩹",DELETE:"🗑️"},v={GET:"show me what is there",POST:"add something new",PATCH:"change something already there",DELETE:"take something away"},P={GET:[{theme:"Weather Window",before:"❓",after:"🌦️ 62°",prompt:"Show today's weather.",verb:"GET"},{theme:"Treasure Scanner",before:"🧰 ❓",after:"🧰 💎",prompt:"Look inside the treasure box.",verb:"GET"},{theme:"Lunch Finder",before:"🍽️ ❓",after:"🍽️ 🍕",prompt:"Show today's lunch.",verb:"GET"},{theme:"Game Score",before:"🎮 ❓",after:"🎮 8 points",prompt:"Show the saved score.",verb:"GET"},{theme:"Pet Camera",before:"🏠 ❓",after:"🏠 🐶💤",prompt:"See what the puppy is doing.",verb:"GET"}],POST:[{theme:"Pet Shelter",before:"🏠",after:"🏠 🐶",prompt:"Add a new puppy.",verb:"POST"},{theme:"Cupcake Tray",before:"🧁 🧁",after:"🧁 🧁 🧁",prompt:"Add one new cupcake.",verb:"POST"},{theme:"Soccer Team",before:"⚽ 🙂 🙂",after:"⚽ 🙂 🙂 🙂",prompt:"Add a new player.",verb:"POST"},{theme:"Book Shelf",before:"📚 📕",after:"📚 📕 📗",prompt:"Add a new book.",verb:"POST"},{theme:"Night Sky",before:"🌙 ⭐",after:"🌙 ⭐ ⭐",prompt:"Add a new star.",verb:"POST"}],PATCH:[{theme:"Robot Charger",before:"🤖 🔋2",after:"🤖 🔋3",prompt:"Change the robot's battery from 2 to 3.",verb:"PATCH"},{theme:"Pet Care",before:"🐱 hungry",after:"🐱 full",prompt:"Change the cat from hungry to full.",verb:"PATCH"},{theme:"Score Booster",before:"🎮 6",after:"🎮 7",prompt:"Change the score from 6 to 7.",verb:"PATCH"},{theme:"Garden Grower",before:"🌱 small",after:"🌻 tall",prompt:"Change the plant as it grows.",verb:"PATCH"},{theme:"Music Player",before:"🎵 volume 2",after:"🎵 volume 3",prompt:"Change the volume from 2 to 3.",verb:"PATCH"}],DELETE:[{theme:"Room Cleanup",before:"🛏️ 🗑️",after:"🛏️ ✨",prompt:"Take away the trash.",verb:"DELETE"},{theme:"Laundry Match",before:"🧦 🧦 🧦",after:"🧦 🧦",prompt:"Remove the extra sock.",verb:"DELETE"},{theme:"Team List",before:"🙂 Mia · 🙂 Sam",after:"🙂 Mia",prompt:"Take Sam off the team.",verb:"DELETE"},{theme:"Photo Album",before:"🖼️ 🖼️ 🖼️",after:"🖼️ 🖼️",prompt:"Remove an old photo.",verb:"DELETE"},{theme:"Block Tower",before:"🟦 🟩 🟨",after:"🟦 🟩",prompt:"Take away the yellow block.",verb:"DELETE"}]},h=[{theme:"Dragon Tracker",before:"🏰 ❓",after:"🏰 🐉",prompt:"See if a dragon is at the castle.",verb:"GET"},{theme:"Sticker Book",before:"📒 ⭐",after:"📒 ⭐ 🌈",prompt:"Add a new rainbow sticker.",verb:"POST"},{theme:"Race Game",before:"🏎️ lap 2",after:"🏎️ lap 3",prompt:"Change the lap from 2 to 3.",verb:"PATCH"},{theme:"Snack Tray",before:"🍎 🍌 🍪",after:"🍎 🍌",prompt:"Take away the cookie.",verb:"DELETE"},{theme:"Library Search",before:"📚 ❓",after:"📚 🧙 book found",prompt:"Look for a wizard book.",verb:"GET"},{theme:"Aquarium",before:"🫧 🐟",after:"🫧 🐟 🐠",prompt:"Add a new fish.",verb:"POST"},{theme:"Space Fuel",before:"🚀 fuel 4",after:"🚀 fuel 5",prompt:"Change the fuel from 4 to 5.",verb:"PATCH"},{theme:"Toy Box",before:"🧸 🚗 🪀",after:"🧸 🚗",prompt:"Remove the yo-yo.",verb:"DELETE"},{theme:"Dinosaur Camera",before:"🌋 ❓",after:"🌋 🦕",prompt:"See which dinosaur is there.",verb:"GET"},{theme:"Pizza Party",before:"🍕 🍕",after:"🍕 🍕 🍕",prompt:"Add one new pizza.",verb:"POST"},{theme:"Magic Meter",before:"🪄 power 7",after:"🪄 power 8",prompt:"Change the magic power to 8.",verb:"PATCH"},{theme:"Backpack",before:"🎒 📕 ✏️ 🍬",after:"🎒 📕 ✏️",prompt:"Take the candy out.",verb:"DELETE"},{theme:"Bus Board",before:"🚌 ❓",after:"🚌 3 minutes",prompt:"Show when the bus arrives.",verb:"GET"},{theme:"Birthday List",before:"🎂 Ava",after:"🎂 Ava · Leo",prompt:"Add Leo to the birthday list.",verb:"POST"},{theme:"Level Up",before:"🧙 level 3",after:"🧙 level 4",prompt:"Change the wizard to level 4.",verb:"PATCH"},{theme:"Garden Cleanup",before:"🌷 🌼 🥀",after:"🌷 🌼",prompt:"Remove the wilted flower.",verb:"DELETE"}],G=document.querySelector("#dash");if(!G)throw new Error("Missing dash app");const T=G;let e=F();function _(){return{phase:"name",name:"",intro:0,verb:0,round:0,mix:0,solved:!1,stars:0,streak:0,wrong:"",message:"",board:[],mine:W(),exchange:null,busy:!1,passOpen:!1,passWrong:!1,passIntent:"board",teacher:!1,status:""}}function F(){const t=_();try{const a=JSON.parse(localStorage.getItem(A)??"null");if(!a)return t;const s=a.phase;return s!=="name"&&s!=="intro"&&s!=="train"&&s!=="mix"&&s!=="done"&&s!=="play"?t:{...t,...a,phase:s,name:typeof a.name=="string"?a.name:"",board:[],mine:W(),exchange:a.exchange??null,busy:!1,passOpen:!1,passWrong:!1,passIntent:"board",teacher:!1,status:""}}catch{return t}}function W(){try{const t=JSON.parse(localStorage.getItem(L)??"[]");return Array.isArray(t)?t.filter(a=>typeof a=="string"):[]}catch{return[]}}function V(){const{board:t,busy:a,passOpen:s,passWrong:r,passIntent:i,teacher:m,status:S,...c}=e;localStorage.setItem(A,JSON.stringify(c)),localStorage.setItem(L,JSON.stringify(e.mine))}function n(){T.innerHTML=z()+ee(),V()}function z(){return e.phase==="name"?K():e.phase==="intro"?Y():e.phase==="train"?C(D(),`${e.round+1} of 5`,`${e.verb+1} of 4`):e.phase==="mix"?C(h[e.mix]??h[0],`${e.mix+1} of ${h.length}`,"Verb Arcade"):e.phase==="done"?X():Q()}function E(t,a=""){return`<header class="top">
    <div><h1>The Window Dash</h1><p>${o(t)}</p></div>
    <div class="score">⭐ ${e.stars}${a?`<span>${o(a)}</span>`:""}</div>
  </header>`}function K(){return`<main class="name-screen">
    <div class="window-art" aria-hidden="true"><span>👀</span></div>
    <h1>The Window Dash</h1>
    <p>Learn four magic words that apps use.</p>
    <form id="name-form">
      <label for="name">Your first name</label>
      <input id="name" maxlength="20" autocomplete="given-name" value="${o(e.name)}" />
      ${e.wrong?`<p class="feedback bad">${o(e.wrong)}</p>`:""}
      <button class="big" type="submit">Start the games!</button>
    </form>
  </main>${x()}`}function Y(){const t=[{art:"💻 ➡️ 🪟 ➡️ 🖥️",title:"An API is a window",text:"An app asks through the window. Another computer answers."},{art:"👀 ➕ 🩹 🗑️",title:"Four action words",text:"GET looks. POST adds. PATCH changes. DELETE removes."},{art:"🎮",title:"Learn by playing",text:"Pick the action that makes each little world work."}],a=t[e.intro]??t[0];return`${E("Quick start")}
    <main class="intro-card">
      <div class="intro-art">${a.art}</div>
      <h2>${a.title}</h2>
      <p>${a.text}</p>
      <button class="big" data-act="intro-next">${e.intro===t.length-1?"Play!":"Next"}</button>
    </main>${x()}`}function D(){const t=w[e.verb]??"GET";return P[t][e.round]??P.GET[0]}function C(t,a,s){const r=t.verb;return`${E(s,a)}
    <main class="game">
      <section class="scene ${e.solved?"solved":""}">
        <p class="theme">${o(t.theme)}</p>
        <div class="world">${e.solved?o(t.after):o(t.before)}</div>
        <h2>${o(t.prompt)}</h2>
        ${e.wrong?`<p class="feedback bad">${o(e.wrong)}</p>`:""}
        ${e.solved?`<p class="feedback good">${y[r]} ${r} worked! It means “${v[r]}.”</p>`:""}
      </section>
      <section class="controller">
        <p>Which action should the app send?</p>
        <div class="verb-grid">${w.map(i=>J(i,e.solved)).join("")}</div>
        ${e.solved?'<button class="big next" data-act="game-next">Next game ➜</button>':""}
      </section>
    </main>${x()}`}function J(t,a){return`<button class="verb ${t.toLowerCase()}" data-act="answer" data-verb="${t}" ${a?"disabled":""}>
    <span>${y[t]}</span><b>${t}</b><small>${o(v[t])}</small>
  </button>`}function X(){return`${E("You did it!")}
    <main class="finish">
      <div class="trophy">🏆</div>
      <h2>Four verbs unlocked!</h2>
      <div class="recap">
        ${w.map(t=>`<div class="${t.toLowerCase()}"><span>${y[t]}</span><b>${t}</b><p>${o(v[t])}</p></div>`).join("")}
      </div>
      <p>You earned <b>${e.stars} stars</b>. Now use all four verbs on a real class board.</p>
      <button class="big" data-act="open-play">Open the message board</button>
    </main>`}function Q(){const t=e.board.length?e.board.map(a=>U(a)).join(""):'<p class="empty">Press GET to bring the messages through the window.</p>';return`${E("Message board free play")}
    <main class="play">
      <section class="play-board">
        <div class="panel-title">
          <b>📋 Class board</b>
          <button class="t-mode ${e.teacher?"on":""}" data-act="t-mode">T Mode</button>
          ${e.teacher?'<button class="t-clear" data-act="t-clear">Clear all</button>':""}
          <span>${e.status?o(e.status):"What the app shows"}</span>
        </div>
        <div class="composer">
          <textarea id="message" maxlength="80" placeholder="Write a kind class message.">${o(e.message)}</textarea>
          <button class="action post" data-act="play-post">➕ POST</button>
          <button class="action get" data-act="play-get">👀 GET</button>
          <button class="action delete" data-act="play-delete">🗑️ DELETE my messages</button>
        </div>
        ${e.wrong?`<p class="feedback bad">${o(e.wrong)}</p>`:""}
        <div class="messages" id="messages">${t}</div>
      </section>
      <aside class="log">
        <div class="panel-title"><b>🪟 Window log</b><span>What was sent</span></div>
        ${Z()}
      </aside>
    </main>`}function U(t){const a=e.mine.includes(t.key);return`<article class="message ${a?"mine":""}">
    <div><b>${t.welcome?"Welcome":o(t.name)}</b>${a?"<em>yours</em>":""}${e.teacher?`<button class="t-x" data-act="t-delete" data-key="${o(t.key)}" aria-label="Delete this message">×</button>`:""}</div>
    <p>${o(t.text)}</p>
    ${t.welcome?"":`<button class="like" data-act="play-like" data-key="${o(t.key)}">🩹 PATCH a like · ${t.likes}</button>`}
  </article>`}function Z(){if(!e.exchange)return'<p class="empty">Try a verb. The request will appear here.</p>';const t=e.exchange;return`<div class="log-body">
    <strong class="method ${t.method.toLowerCase()}">${o(t.method)}</strong>
    <p>${o(t.url)}</p>
    <h3>Sent</h3>
    <pre>${o(t.body??"No body")}</pre>
    <h3>Answer</h3>
    <strong>${t.status}</strong>
    <pre>${o(t.response)}</pre>
  </div>`}function x(){return'<button class="skip" data-act="skip">Message board</button>'}function ee(){return e.passOpen?`<div class="veil"><form class="password" id="pass-form">
    <h2>Teacher password</h2>
    <input id="pass" type="password" autocomplete="off" />
    ${e.passWrong?'<p class="feedback bad">That password is not right.</p>':""}
    <div><button type="button" data-act="skip-close">Cancel</button><button class="big" type="submit">Open</button></div>
  </form></div>`:""}function te(t){if(e.solved)return;const a=e.phase==="mix"?h[e.mix]:D();if(a){if(t!==a.verb){e.streak=0,e.wrong=`${y[t]} ${t} means “${v[t]}.” Try again!`,n();return}e.solved=!0,e.wrong="",e.streak+=1,e.stars+=e.streak>=3?2:1,n()}}function ae(){e.solved=!1,e.wrong="",e.phase==="train"?e.round<4?e.round+=1:e.verb<w.length-1?(e.verb+=1,e.round=0):(e.phase="mix",e.mix=0):e.mix<h.length-1?e.mix+=1:e.phase="done",n()}function H(){e.phase="play",e.board=[],e.exchange=null,e.wrong="",e.passOpen=!1,e.passWrong=!1,n()}async function d(t){if(!e.busy){e.busy=!0,e.wrong="",n();try{await t()}catch{e.wrong="The window did not answer. Check the connection and try again."}finally{e.busy=!1,n()}}}async function se(){await d(async()=>{let t=await u(),a=b(t.json)??{};typeof a[p]!="string"&&(await g({[p]:O}),t=await u(),a=b(t.json)??{}),e.board=I(a),e.mine=e.mine.filter(s=>e.board.some(r=>r.key===s)),e.exchange=l(t.exchange,`${e.board.length} message${e.board.length===1?"":"s"} came back.`),requestAnimationFrame(ce)})}async function re(){const t=document.querySelector("#message"),a=R(t?.value??e.message);if(e.message=t?.value??"",!a){e.wrong="Write a message first.",n();return}await d(async()=>{const s=q($),r=f(s),i=await g({[s]:{name:e.name||"Friend",text:a,at:Date.now()},[r]:0});e.exchange=l(i.exchange,"The new message was stored. Press GET to show it."),i.status<400&&(e.mine=e.mine.concat(s),e.message="")})}async function oe(t){await d(async()=>{const a=await B(f(t));e.exchange=l(a.exchange,"The like changed. Press GET to show the new number.")})}async function ne(t){!e.teacher||!t||await d(async()=>{const a=await g({[t]:null,[f(t)]:null});if(a.status>=400){e.wrong="That message was not deleted. Try again.",e.exchange=l(a.exchange,"The message is still stored.");return}e.board=e.board.filter(s=>s.key!==t),e.mine=e.mine.filter(s=>s!==t),e.exchange=l(a.exchange,"That message was deleted.")})}async function ie(){e.teacher&&(e.status="Clearing the board...",await d(async()=>{try{const t=await u(),a=b(t.json)??{},s={[p]:O};for(const c of Object.keys(a))c.startsWith("dash-")&&c!==p&&(s[c]=null);const r=await g(s);if(r.status>=400){e.wrong="Clear did not go through. Try again.",e.exchange=l(r.exchange,"The board was not cleared.");return}const i=await u(),m=b(i.json)??{},S=Object.keys(m).filter(c=>c.startsWith("dash-")&&c!==p);if(e.board=I(m),e.mine=[],S.length){e.wrong="Some messages are still stored. Press Clear all again.",e.exchange=l(i.exchange,"Clear did not remove every message.");return}e.exchange=l(r.exchange,"The Dash board was cleared. The welcome message is back.")}finally{e.status=""}}))}async function le(){const t=e.mine.slice();if(!t.length){e.wrong="You do not have any messages to delete.",n();return}await d(async()=>{let a=await k(t[0]);for(const s of t)s!==t[0]&&(a=await k(s)),await k(f(s));e.exchange=l(a.exchange,"Your messages were removed. Press GET to update the board.")})}function I(t){const a=[];for(const[s,r]of Object.entries(t)){if(s===p&&typeof r=="string"){a.push({key:s,name:"Welcome",text:r,likes:0,welcome:!0,at:0});continue}if(!s.startsWith($)||!r||typeof r!="object"||Array.isArray(r))continue;const i=r;if(typeof i.name!="string"||typeof i.text!="string")continue;const m=t[f(s)];a.push({key:s,name:i.name,text:i.text,likes:typeof m=="number"?m:0,welcome:!1,at:typeof i.at=="number"?i.at:0})}return a.sort((s,r)=>s.at-r.at)}function f(t){return`${j}${t===p?"welcome":t.slice($.length)}`}function l(t,a){return{...t,response:a}}function ce(){const t=document.querySelector("#messages");t instanceof HTMLElement&&(t.scrollTop=t.scrollHeight)}T.addEventListener("click",t=>{const a=t.target?.closest("[data-act]");if(!a||a.hasAttribute("disabled")||e.busy)return;const s=a.dataset.act;if(s==="intro-next")e.intro<2?e.intro+=1:e.phase="train",n();else if(s==="answer"){const r=a.dataset.verb;(r==="GET"||r==="POST"||r==="PATCH"||r==="DELETE")&&te(r)}else s==="game-next"?ae():s==="open-play"?H():s==="skip"?(e.passIntent="board",e.passOpen=!0,e.passWrong=!1,n(),document.querySelector("#pass")?.focus()):s==="t-mode"?e.teacher?(e.teacher=!1,n()):(e.passIntent="teacher",e.passOpen=!0,e.passWrong=!1,n(),document.querySelector("#pass")?.focus()):s==="t-clear"?ie():s==="t-delete"?ne(a.dataset.key??""):s==="skip-close"?(e.passOpen=!1,n()):s==="play-get"?se():s==="play-post"?re():s==="play-delete"?le():s==="play-like"&&oe(a.dataset.key??"")});T.addEventListener("input",t=>{const a=t.target;a instanceof HTMLTextAreaElement&&a.id==="message"&&(e.message=a.value)});T.addEventListener("submit",t=>{if(t.target instanceof HTMLFormElement)if(t.preventDefault(),t.target.id==="name-form"){const a=document.querySelector("#name"),s=M(a?.value??"");if(!N(s)){e.name=s,e.wrong="Type your first name.",n();return}e.name=s,e.wrong="",e.phase="intro",n()}else t.target.id==="pass-form"&&((document.querySelector("#pass")?.value??"")!=="admin"?(e.passWrong=!0,n(),document.querySelector("#pass")?.focus()):e.passIntent==="teacher"?(e.teacher=!0,e.passOpen=!1,e.passWrong=!1,n()):H())});function o(t){return t.replace(/[&<>"']/g,a=>a==="&"?"&amp;":a==="<"?"&lt;":a===">"?"&gt;":a==='"'?"&quot;":"&#39;")}n();
