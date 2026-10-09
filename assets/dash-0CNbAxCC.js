import{c as R,v as q,a as B,g as f,b as u,p as w,n as j,i as _,d as S,e as $}from"./api-Bgbctfpa.js";const G="window-dash-v1",W="window-dash-mine",C="dash-n-",F="dash-k-",p="dash-welcome",P="Welcome to the class message board!",y=["GET","POST","PATCH","DELETE"],v={GET:"👀",POST:"➕",PATCH:"🩹",DELETE:"🗑️"},T={GET:"show me what is there",POST:"add something new",PATCH:"change something already there",DELETE:"take something away"},L={GET:[{theme:"Weather Window",before:"❓",after:"🌦️ 62°",prompt:"Show today's weather.",verb:"GET"},{theme:"Treasure Scanner",before:"🧰 ❓",after:"🧰 💎",prompt:"Look inside the treasure box.",verb:"GET"},{theme:"Lunch Finder",before:"🍽️ ❓",after:"🍽️ 🍕",prompt:"Show today's lunch.",verb:"GET"},{theme:"Game Score",before:"🎮 ❓",after:"🎮 8 points",prompt:"Show the saved score.",verb:"GET"},{theme:"Pet Camera",before:"🏠 ❓",after:"🏠 🐶💤",prompt:"See what the puppy is doing.",verb:"GET"}],POST:[{theme:"Pet Shelter",before:"🏠",after:"🏠 🐶",prompt:"Add a new puppy.",verb:"POST"},{theme:"Cupcake Tray",before:"🧁 🧁",after:"🧁 🧁 🧁",prompt:"Add one new cupcake.",verb:"POST"},{theme:"Soccer Team",before:"⚽ 🙂 🙂",after:"⚽ 🙂 🙂 🙂",prompt:"Add a new player.",verb:"POST"},{theme:"Book Shelf",before:"📚 📕",after:"📚 📕 📗",prompt:"Add a new book.",verb:"POST"},{theme:"Night Sky",before:"🌙 ⭐",after:"🌙 ⭐ ⭐",prompt:"Add a new star.",verb:"POST"}],PATCH:[{theme:"Robot Charger",before:"🤖 🔋2",after:"🤖 🔋3",prompt:"Change the robot's battery from 2 to 3.",verb:"PATCH"},{theme:"Pet Care",before:"🐱 hungry",after:"🐱 full",prompt:"Change the cat from hungry to full.",verb:"PATCH"},{theme:"Score Booster",before:"🎮 6",after:"🎮 7",prompt:"Change the score from 6 to 7.",verb:"PATCH"},{theme:"Garden Grower",before:"🌱 small",after:"🌻 tall",prompt:"Change the plant as it grows.",verb:"PATCH"},{theme:"Music Player",before:"🎵 volume 2",after:"🎵 volume 3",prompt:"Change the volume from 2 to 3.",verb:"PATCH"}],DELETE:[{theme:"Room Cleanup",before:"🛏️ 🗑️",after:"🛏️ ✨",prompt:"Take away the trash.",verb:"DELETE"},{theme:"Laundry Match",before:"🧦 🧦 🧦",after:"🧦 🧦",prompt:"Remove the extra sock.",verb:"DELETE"},{theme:"Team List",before:"🙂 Mia · 🙂 Sam",after:"🙂 Mia",prompt:"Take Sam off the team.",verb:"DELETE"},{theme:"Photo Album",before:"🖼️ 🖼️ 🖼️",after:"🖼️ 🖼️",prompt:"Remove an old photo.",verb:"DELETE"},{theme:"Block Tower",before:"🟦 🟩 🟨",after:"🟦 🟩",prompt:"Take away the yellow block.",verb:"DELETE"}]},b=[{theme:"Dragon Tracker",before:"🏰 ❓",after:"🏰 🐉",prompt:"See if a dragon is at the castle.",verb:"GET"},{theme:"Sticker Book",before:"📒 ⭐",after:"📒 ⭐ 🌈",prompt:"Add a new rainbow sticker.",verb:"POST"},{theme:"Race Game",before:"🏎️ lap 2",after:"🏎️ lap 3",prompt:"Change the lap from 2 to 3.",verb:"PATCH"},{theme:"Snack Tray",before:"🍎 🍌 🍪",after:"🍎 🍌",prompt:"Take away the cookie.",verb:"DELETE"},{theme:"Library Search",before:"📚 ❓",after:"📚 🧙 book found",prompt:"Look for a wizard book.",verb:"GET"},{theme:"Aquarium",before:"🫧 🐟",after:"🫧 🐟 🐠",prompt:"Add a new fish.",verb:"POST"},{theme:"Space Fuel",before:"🚀 fuel 4",after:"🚀 fuel 5",prompt:"Change the fuel from 4 to 5.",verb:"PATCH"},{theme:"Toy Box",before:"🧸 🚗 🪀",after:"🧸 🚗",prompt:"Remove the yo-yo.",verb:"DELETE"},{theme:"Dinosaur Camera",before:"🌋 ❓",after:"🌋 🦕",prompt:"See which dinosaur is there.",verb:"GET"},{theme:"Pizza Party",before:"🍕 🍕",after:"🍕 🍕 🍕",prompt:"Add one new pizza.",verb:"POST"},{theme:"Magic Meter",before:"🪄 power 7",after:"🪄 power 8",prompt:"Change the magic power to 8.",verb:"PATCH"},{theme:"Backpack",before:"🎒 📕 ✏️ 🍬",after:"🎒 📕 ✏️",prompt:"Take the candy out.",verb:"DELETE"},{theme:"Bus Board",before:"🚌 ❓",after:"🚌 3 minutes",prompt:"Show when the bus arrives.",verb:"GET"},{theme:"Birthday List",before:"🎂 Ava",after:"🎂 Ava · Leo",prompt:"Add Leo to the birthday list.",verb:"POST"},{theme:"Level Up",before:"🧙 level 3",after:"🧙 level 4",prompt:"Change the wizard to level 4.",verb:"PATCH"},{theme:"Garden Cleanup",before:"🌷 🌼 🥀",after:"🌷 🌼",prompt:"Remove the wilted flower.",verb:"DELETE"}],D=document.querySelector("#dash");if(!D)throw new Error("Missing dash app");const E=D;let e=K();function V(){return{phase:"name",name:"",intro:0,verb:0,round:0,mix:0,solved:!1,stars:0,streak:0,wrong:"",message:"",board:[],mine:H(),exchange:null,busy:!1,passOpen:!1,passWrong:!1,passIntent:"board",teacher:!1,status:""}}function K(){const t=V();try{const a=JSON.parse(localStorage.getItem(G)??"null");if(!a)return t;const s=a.phase;return s!=="name"&&s!=="intro"&&s!=="train"&&s!=="mix"&&s!=="done"&&s!=="play"?t:{...t,...a,phase:s,name:typeof a.name=="string"?a.name:"",board:[],mine:H(),exchange:a.exchange??null,busy:!1,passOpen:!1,passWrong:!1,passIntent:"board",teacher:!1,status:""}}catch{return t}}function H(){try{const t=JSON.parse(localStorage.getItem(W)??"[]");return Array.isArray(t)?t.filter(a=>typeof a=="string"):[]}catch{return[]}}function z(){const{board:t,busy:a,passOpen:s,passWrong:r,passIntent:i,teacher:c,status:d,...h}=e;localStorage.setItem(G,JSON.stringify(h)),localStorage.setItem(W,JSON.stringify(e.mine))}function n(){E.innerHTML=Y()+ae(),z()}function Y(){return e.phase==="name"?J():e.phase==="intro"?X():e.phase==="train"?O(I(),`${e.round+1} of 5`,`${e.verb+1} of 4`):e.phase==="mix"?O(b[e.mix]??b[0],`${e.mix+1} of ${b.length}`,"Verb Arcade"):e.phase==="done"?U():Z()}function k(t,a=""){return`<header class="top">
    <div><h1>The Window Dash</h1><p>${o(t)}</p></div>
    <div class="score">⭐ ${e.stars}${a?`<span>${o(a)}</span>`:""}</div>
  </header>`}function J(){return`<main class="name-screen">
    <div class="window-art" aria-hidden="true"><span>👀</span></div>
    <h1>The Window Dash</h1>
    <p>Learn four magic words that apps use.</p>
    <form id="name-form">
      <label for="name">Your first name</label>
      <input id="name" maxlength="20" autocomplete="given-name" value="${o(e.name)}" />
      ${e.wrong?`<p class="feedback bad">${o(e.wrong)}</p>`:""}
      <button class="big" type="submit">Start the games!</button>
    </form>
  </main>${A()}`}function X(){const t=[{art:"💻 ➡️ 🪟 ➡️ 🖥️",title:"An API is a window",text:"An app asks through the window. Another computer answers."},{art:"👀 ➕ 🩹 🗑️",title:"Four action words",text:"GET looks. POST adds. PATCH changes. DELETE removes."},{art:"🎮",title:"Learn by playing",text:"Pick the action that makes each little world work."}],a=t[e.intro]??t[0];return`${k("Quick start")}
    <main class="intro-card">
      <div class="intro-art">${a.art}</div>
      <h2>${a.title}</h2>
      <p>${a.text}</p>
      <button class="big" data-act="intro-next">${e.intro===t.length-1?"Play!":"Next"}</button>
    </main>${A()}`}function I(){const t=y[e.verb]??"GET";return L[t][e.round]??L.GET[0]}function O(t,a,s){const r=t.verb;return`${k(s,a)}
    <main class="game">
      <section class="scene ${e.solved?"solved":""}">
        <p class="theme">${o(t.theme)}</p>
        <div class="world">${e.solved?o(t.after):o(t.before)}</div>
        <h2>${o(t.prompt)}</h2>
        ${e.wrong?`<p class="feedback bad">${o(e.wrong)}</p>`:""}
        ${e.solved?`<p class="feedback good">${v[r]} ${r} worked! It means “${T[r]}.”</p>`:""}
      </section>
      <section class="controller">
        <p>Which action should the app send?</p>
        <div class="verb-grid">${y.map(i=>Q(i,e.solved)).join("")}</div>
        ${e.solved?'<button class="big next" data-act="game-next">Next game ➜</button>':""}
      </section>
    </main>${A()}`}function Q(t,a){return`<button class="verb ${t.toLowerCase()}" data-act="answer" data-verb="${t}" ${a?"disabled":""}>
    <span>${v[t]}</span><b>${t}</b><small>${o(T[t])}</small>
  </button>`}function U(){return`${k("You did it!")}
    <main class="finish">
      <div class="trophy">🏆</div>
      <h2>Four verbs unlocked!</h2>
      <div class="recap">
        ${y.map(t=>`<div class="${t.toLowerCase()}"><span>${v[t]}</span><b>${t}</b><p>${o(T[t])}</p></div>`).join("")}
      </div>
      <p>You earned <b>${e.stars} stars</b>. Now use all four verbs on a real class board.</p>
      <button class="big" data-act="open-play">Open the message board</button>
    </main>`}function Z(){const t=e.board.length?e.board.map(a=>ee(a)).join(""):'<p class="empty">Press GET to bring the messages through the window.</p>';return`${k("Message board free play")}
    <main class="play">
      <section class="play-board">
        <div class="play-top">
          <div class="panel-title">
            <b>📋 Class board</b>
            <button type="button" class="t-mode ${e.teacher?"on":""}" data-act="t-mode">T Mode</button>
            <span>What the app shows</span>
          </div>
          ${e.teacher?`<button type="button" class="t-clear" data-act="t-clear">${o(e.status||"Clear all")}</button>`:""}
          <div class="composer">
            <textarea id="message" maxlength="80" placeholder="Write a kind class message.">${o(e.message)}</textarea>
            <button class="action post" data-act="play-post">➕ POST</button>
            <button class="action get" data-act="play-get">👀 GET</button>
            <button class="action delete" data-act="play-delete">🗑️ DELETE my messages</button>
          </div>
          ${e.wrong?`<p class="feedback bad">${o(e.wrong)}</p>`:""}
        </div>
        <div class="messages" id="messages">${t}</div>
      </section>
      <aside class="log">
        <div class="panel-title"><b>🪟 Window log</b><span>What was sent</span></div>
        ${te()}
      </aside>
    </main>`}function ee(t){const a=e.mine.includes(t.key);return`<article class="message ${a?"mine":""}">
    <div><b>${t.welcome?"Welcome":o(t.name)}</b>${a?"<em>yours</em>":""}${e.teacher?`<button type="button" class="t-x" data-act="t-delete" data-key="${o(t.key)}" aria-label="Delete this message">×</button>`:""}</div>
    <p>${o(t.text)}</p>
    ${t.welcome?"":`<button class="like" data-act="play-like" data-key="${o(t.key)}">🩹 PATCH a like · ${t.likes}</button>`}
  </article>`}function te(){if(!e.exchange)return'<p class="empty">Try a verb. The request will appear here.</p>';const t=e.exchange;return`<div class="log-body">
    <strong class="method ${t.method.toLowerCase()}">${o(t.method)}</strong>
    <p>${o(t.url)}</p>
    <h3>Sent</h3>
    <pre>${o(t.body??"No body")}</pre>
    <h3>Answer</h3>
    <strong>${t.status}</strong>
    <pre>${o(t.response)}</pre>
  </div>`}function A(){return'<button class="skip" data-act="skip">Message board</button>'}function ae(){return e.passOpen?`<div class="veil"><form class="password" id="pass-form">
    <h2>Teacher password</h2>
    <input id="pass" type="password" autocomplete="off" />
    ${e.passWrong?'<p class="feedback bad">That password is not right.</p>':""}
    <div><button type="button" data-act="skip-close">Cancel</button><button class="big" type="submit">Open</button></div>
  </form></div>`:""}function se(t){if(e.solved)return;const a=e.phase==="mix"?b[e.mix]:I();if(a){if(t!==a.verb){e.streak=0,e.wrong=`${v[t]} ${t} means “${T[t]}.” Try again!`,n();return}e.solved=!0,e.wrong="",e.streak+=1,e.stars+=e.streak>=3?2:1,n()}}function re(){e.solved=!1,e.wrong="",e.phase==="train"?e.round<4?e.round+=1:e.verb<y.length-1?(e.verb+=1,e.round=0):(e.phase="mix",e.mix=0):e.mix<b.length-1?e.mix+=1:e.phase="done",n()}function M(){e.phase="play",e.board=[],e.exchange=null,e.wrong="",e.passOpen=!1,e.passWrong=!1,n()}async function m(t){if(!e.busy){e.busy=!0,e.wrong="",n();try{await t()}catch{e.wrong="The window did not answer. Check the connection and try again."}finally{e.busy=!1,n()}}}async function oe(){await m(async()=>{let t=await f(),a=u(t.json)??{};typeof a[p]!="string"&&(await w({[p]:P}),t=await f(),a=u(t.json)??{}),e.board=N(a),e.mine=e.mine.filter(s=>e.board.some(r=>r.key===s)),e.exchange=l(t.exchange,`${e.board.length} message${e.board.length===1?"":"s"} came back.`),requestAnimationFrame(me)})}async function ne(){const t=document.querySelector("#message"),a=B(t?.value??e.message);if(e.message=t?.value??"",!a){e.wrong="Write a message first.",n();return}await m(async()=>{const s=j(C),r=g(s),i=await w({[s]:{name:e.name||"Friend",text:a,at:Date.now()},[r]:0});e.exchange=l(i.exchange,"The new message was stored. Press GET to show it."),i.status<400&&(e.mine=e.mine.concat(s),e.message="")})}async function ie(t){await m(async()=>{const a=await _(g(t));e.exchange=l(a.exchange,"The like changed. Press GET to show the new number.")})}function x(t){return Object.keys(t).filter(a=>a.startsWith("dash-"))}async function le(t){!e.teacher||!t||await m(async()=>{const a=await S([t,g(t)]);if(a.status>=400){e.wrong="That message was not deleted. Try again.",e.exchange=l(a.exchange,"The message is still stored.");return}e.board=e.board.filter(s=>s.key!==t),e.mine=e.mine.filter(s=>s!==t),e.exchange=l(a.exchange,"That message was deleted.")})}async function ce(){e.teacher&&(e.status="Clearing the board...",await m(async()=>{try{const t=await f(),a=u(t.json)??{},s=x(a),r=s.length?await S(s):t;if(r.status>=400){e.wrong="Clear did not go through. Try again.",e.exchange=l(r.exchange,"The board was not cleared.");return}const i=await w({[p]:P});if(i.status>=400){e.wrong="The notes were removed, but the welcome message did not come back. Press GET.",e.board=[],e.mine=[],e.exchange=l(i.exchange,"Welcome message was not stored.");return}let c=u((await f()).json)??{},d=x(c).filter(h=>h!==p);if(d.length&&(await S(d),await w({[p]:P}),c=u((await f()).json)??{},d=x(c).filter(h=>h!==p)),e.board=N(c),e.mine=[],d.length){e.wrong="Some messages are still stored. Press Clear all again.",e.exchange=l(i.exchange,"Clear did not remove every message.");return}e.exchange=l(s.length?r.exchange:i.exchange,"The Dash board was cleared. The welcome message is back.")}finally{e.status=""}}))}async function pe(){const t=e.mine.slice();if(!t.length){e.wrong="You do not have any messages to delete.",n();return}await m(async()=>{let a=await $(t[0]);for(const s of t)s!==t[0]&&(a=await $(s)),await $(g(s));e.exchange=l(a.exchange,"Your messages were removed. Press GET to update the board.")})}function N(t){const a=[];for(const[s,r]of Object.entries(t)){if(s===p&&typeof r=="string"){a.push({key:s,name:"Welcome",text:r,likes:0,welcome:!0,at:0});continue}if(!s.startsWith(C)||!r||typeof r!="object"||Array.isArray(r))continue;const i=r;if(typeof i.name!="string"||typeof i.text!="string")continue;const c=t[g(s)];a.push({key:s,name:i.name,text:i.text,likes:typeof c=="number"?c:0,welcome:!1,at:typeof i.at=="number"?i.at:0})}return a.sort((s,r)=>s.at-r.at)}function g(t){return`${F}${t===p?"welcome":t.slice(C.length)}`}function l(t,a){return{...t,response:a}}function me(){const t=document.querySelector("#messages");t instanceof HTMLElement&&(t.scrollTop=t.scrollHeight)}E.addEventListener("click",t=>{const a=t.target?.closest("[data-act]");if(!a||a.hasAttribute("disabled")||e.busy)return;const s=a.dataset.act;if(s==="intro-next")e.intro<2?e.intro+=1:e.phase="train",n();else if(s==="answer"){const r=a.dataset.verb;(r==="GET"||r==="POST"||r==="PATCH"||r==="DELETE")&&se(r)}else s==="game-next"?re():s==="open-play"?M():s==="skip"?(e.passIntent="board",e.passOpen=!0,e.passWrong=!1,n(),document.querySelector("#pass")?.focus()):s==="t-mode"?e.teacher?(e.teacher=!1,n()):(e.passIntent="teacher",e.passOpen=!0,e.passWrong=!1,n(),document.querySelector("#pass")?.focus()):s==="t-clear"?ce():s==="t-delete"?le(a.dataset.key??""):s==="skip-close"?(e.passOpen=!1,n()):s==="play-get"?oe():s==="play-post"?ne():s==="play-delete"?pe():s==="play-like"&&ie(a.dataset.key??"")});E.addEventListener("input",t=>{const a=t.target;a instanceof HTMLTextAreaElement&&a.id==="message"&&(e.message=a.value)});E.addEventListener("submit",t=>{if(t.target instanceof HTMLFormElement)if(t.preventDefault(),t.target.id==="name-form"){const a=document.querySelector("#name"),s=R(a?.value??"");if(!q(s)){e.name=s,e.wrong="Type your first name.",n();return}e.name=s,e.wrong="",e.phase="intro",n()}else t.target.id==="pass-form"&&((document.querySelector("#pass")?.value??"")!=="admin"?(e.passWrong=!0,n(),document.querySelector("#pass")?.focus()):e.passIntent==="teacher"?(e.teacher=!0,e.passOpen=!1,e.passWrong=!1,n()):M())});function o(t){return t.replace(/[&<>"']/g,a=>a==="&"?"&amp;":a==="<"?"&lt;":a===">"?"&gt;":a==='"'?"&quot;":"&#39;")}n();
