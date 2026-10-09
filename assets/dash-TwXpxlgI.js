import{c as D,v as W,a as H,g as E,b as k,p as x,n as M,i as N,d as w}from"./api-B3HNgsfI.js";const P="window-dash-v1",A="window-dash-mine",v="dash-n-",R="dash-k-",c="dash-welcome",I="Welcome to the class message board!",p=["GET","POST","PATCH","DELETE"],m={GET:"👀",POST:"➕",PATCH:"🩹",DELETE:"🗑️"},d={GET:"show me what is there",POST:"add something new",PATCH:"change something already there",DELETE:"take something away"},$={GET:[{theme:"Weather Window",before:"❓",after:"🌦️ 62°",prompt:"Show today's weather.",verb:"GET"},{theme:"Treasure Scanner",before:"🧰 ❓",after:"🧰 💎",prompt:"Look inside the treasure box.",verb:"GET"},{theme:"Lunch Finder",before:"🍽️ ❓",after:"🍽️ 🍕",prompt:"Show today's lunch.",verb:"GET"},{theme:"Game Score",before:"🎮 ❓",after:"🎮 8 points",prompt:"Show the saved score.",verb:"GET"},{theme:"Pet Camera",before:"🏠 ❓",after:"🏠 🐶💤",prompt:"See what the puppy is doing.",verb:"GET"}],POST:[{theme:"Pet Shelter",before:"🏠",after:"🏠 🐶",prompt:"Add a new puppy.",verb:"POST"},{theme:"Cupcake Tray",before:"🧁 🧁",after:"🧁 🧁 🧁",prompt:"Add one new cupcake.",verb:"POST"},{theme:"Soccer Team",before:"⚽ 🙂 🙂",after:"⚽ 🙂 🙂 🙂",prompt:"Add a new player.",verb:"POST"},{theme:"Book Shelf",before:"📚 📕",after:"📚 📕 📗",prompt:"Add a new book.",verb:"POST"},{theme:"Night Sky",before:"🌙 ⭐",after:"🌙 ⭐ ⭐",prompt:"Add a new star.",verb:"POST"}],PATCH:[{theme:"Robot Charger",before:"🤖 🔋2",after:"🤖 🔋3",prompt:"Change the robot's battery from 2 to 3.",verb:"PATCH"},{theme:"Pet Care",before:"🐱 hungry",after:"🐱 full",prompt:"Change the cat from hungry to full.",verb:"PATCH"},{theme:"Score Booster",before:"🎮 6",after:"🎮 7",prompt:"Change the score from 6 to 7.",verb:"PATCH"},{theme:"Garden Grower",before:"🌱 small",after:"🌻 tall",prompt:"Change the plant as it grows.",verb:"PATCH"},{theme:"Music Player",before:"🎵 volume 2",after:"🎵 volume 3",prompt:"Change the volume from 2 to 3.",verb:"PATCH"}],DELETE:[{theme:"Room Cleanup",before:"🛏️ 🗑️",after:"🛏️ ✨",prompt:"Take away the trash.",verb:"DELETE"},{theme:"Laundry Match",before:"🧦 🧦 🧦",after:"🧦 🧦",prompt:"Remove the extra sock.",verb:"DELETE"},{theme:"Team List",before:"🙂 Mia · 🙂 Sam",after:"🙂 Mia",prompt:"Take Sam off the team.",verb:"DELETE"},{theme:"Photo Album",before:"🖼️ 🖼️ 🖼️",after:"🖼️ 🖼️",prompt:"Remove an old photo.",verb:"DELETE"},{theme:"Block Tower",before:"🟦 🟩 🟨",after:"🟦 🟩",prompt:"Take away the yellow block.",verb:"DELETE"}]},l=[{theme:"Dragon Tracker",before:"🏰 ❓",after:"🏰 🐉",prompt:"See if a dragon is at the castle.",verb:"GET"},{theme:"Sticker Book",before:"📒 ⭐",after:"📒 ⭐ 🌈",prompt:"Add a new rainbow sticker.",verb:"POST"},{theme:"Race Game",before:"🏎️ lap 2",after:"🏎️ lap 3",prompt:"Change the lap from 2 to 3.",verb:"PATCH"},{theme:"Snack Tray",before:"🍎 🍌 🍪",after:"🍎 🍌",prompt:"Take away the cookie.",verb:"DELETE"},{theme:"Library Search",before:"📚 ❓",after:"📚 🧙 book found",prompt:"Look for a wizard book.",verb:"GET"},{theme:"Aquarium",before:"🫧 🐟",after:"🫧 🐟 🐠",prompt:"Add a new fish.",verb:"POST"},{theme:"Space Fuel",before:"🚀 fuel 4",after:"🚀 fuel 5",prompt:"Change the fuel from 4 to 5.",verb:"PATCH"},{theme:"Toy Box",before:"🧸 🚗 🪀",after:"🧸 🚗",prompt:"Remove the yo-yo.",verb:"DELETE"},{theme:"Dinosaur Camera",before:"🌋 ❓",after:"🌋 🦕",prompt:"See which dinosaur is there.",verb:"GET"},{theme:"Pizza Party",before:"🍕 🍕",after:"🍕 🍕 🍕",prompt:"Add one new pizza.",verb:"POST"},{theme:"Magic Meter",before:"🪄 power 7",after:"🪄 power 8",prompt:"Change the magic power to 8.",verb:"PATCH"},{theme:"Backpack",before:"🎒 📕 ✏️ 🍬",after:"🎒 📕 ✏️",prompt:"Take the candy out.",verb:"DELETE"},{theme:"Bus Board",before:"🚌 ❓",after:"🚌 3 minutes",prompt:"Show when the bus arrives.",verb:"GET"},{theme:"Birthday List",before:"🎂 Ava",after:"🎂 Ava · Leo",prompt:"Add Leo to the birthday list.",verb:"POST"},{theme:"Level Up",before:"🧙 level 3",after:"🧙 level 4",prompt:"Change the wizard to level 4.",verb:"PATCH"},{theme:"Garden Cleanup",before:"🌷 🌼 🥀",after:"🌷 🌼",prompt:"Remove the wilted flower.",verb:"DELETE"}],L=document.querySelector("#dash");if(!L)throw new Error("Missing dash app");const f=L;let e=q();function B(){return{phase:"name",name:"",intro:0,verb:0,round:0,mix:0,solved:!1,stars:0,streak:0,wrong:"",message:"",board:[],mine:C(),exchange:null,busy:!1,passOpen:!1,passWrong:!1}}function q(){const t=B();try{const a=JSON.parse(localStorage.getItem(P)??"null");if(!a)return t;const r=a.phase;return r!=="name"&&r!=="intro"&&r!=="train"&&r!=="mix"&&r!=="done"&&r!=="play"?t:{...t,...a,phase:r,name:typeof a.name=="string"?a.name:"",board:[],mine:C(),exchange:a.exchange??null,busy:!1,passOpen:!1,passWrong:!1}}catch{return t}}function C(){try{const t=JSON.parse(localStorage.getItem(A)??"[]");return Array.isArray(t)?t.filter(a=>typeof a=="string"):[]}catch{return[]}}function F(){const{board:t,busy:a,passOpen:r,passWrong:s,...i}=e;localStorage.setItem(P,JSON.stringify(i)),localStorage.setItem(A,JSON.stringify(e.mine))}function n(){f.innerHTML=V()+Q(),F()}function V(){return e.phase==="name"?_():e.phase==="intro"?j():e.phase==="train"?S(O(),`${e.round+1} of 5`,`${e.verb+1} of 4`):e.phase==="mix"?S(l[e.mix]??l[0],`${e.mix+1} of ${l.length}`,"Verb Arcade"):e.phase==="done"?K():Y()}function h(t,a=""){return`<header class="top">
    <div><h1>The Window Dash</h1><p>${o(t)}</p></div>
    <div class="score">⭐ ${e.stars}${a?`<span>${o(a)}</span>`:""}</div>
  </header>`}function _(){return`<main class="name-screen">
    <div class="window-art" aria-hidden="true"><span>👀</span></div>
    <h1>The Window Dash</h1>
    <p>Learn four magic words that apps use.</p>
    <form id="name-form">
      <label for="name">Your first name</label>
      <input id="name" maxlength="20" autocomplete="given-name" value="${o(e.name)}" />
      ${e.wrong?`<p class="feedback bad">${o(e.wrong)}</p>`:""}
      <button class="big" type="submit">Start the games!</button>
    </form>
  </main>${y()}`}function j(){const t=[{art:"💻 ➡️ 🪟 ➡️ 🖥️",title:"An API is a window",text:"An app asks through the window. Another computer answers."},{art:"👀 ➕ 🩹 🗑️",title:"Four action words",text:"GET looks. POST adds. PATCH changes. DELETE removes."},{art:"🎮",title:"Learn by playing",text:"Pick the action that makes each little world work."}],a=t[e.intro]??t[0];return`${h("Quick start")}
    <main class="intro-card">
      <div class="intro-art">${a.art}</div>
      <h2>${a.title}</h2>
      <p>${a.text}</p>
      <button class="big" data-act="intro-next">${e.intro===t.length-1?"Play!":"Next"}</button>
    </main>${y()}`}function O(){const t=p[e.verb]??"GET";return $[t][e.round]??$.GET[0]}function S(t,a,r){const s=t.verb;return`${h(r,a)}
    <main class="game">
      <section class="scene ${e.solved?"solved":""}">
        <p class="theme">${o(t.theme)}</p>
        <div class="world">${e.solved?o(t.after):o(t.before)}</div>
        <h2>${o(t.prompt)}</h2>
        ${e.wrong?`<p class="feedback bad">${o(e.wrong)}</p>`:""}
        ${e.solved?`<p class="feedback good">${m[s]} ${s} worked! It means “${d[s]}.”</p>`:""}
      </section>
      <section class="controller">
        <p>Which action should the app send?</p>
        <div class="verb-grid">${p.map(i=>z(i,e.solved)).join("")}</div>
        ${e.solved?'<button class="big next" data-act="game-next">Next game ➜</button>':""}
      </section>
    </main>${y()}`}function z(t,a){return`<button class="verb ${t.toLowerCase()}" data-act="answer" data-verb="${t}" ${a?"disabled":""}>
    <span>${m[t]}</span><b>${t}</b><small>${o(d[t])}</small>
  </button>`}function K(){return`${h("You did it!")}
    <main class="finish">
      <div class="trophy">🏆</div>
      <h2>Four verbs unlocked!</h2>
      <div class="recap">
        ${p.map(t=>`<div class="${t.toLowerCase()}"><span>${m[t]}</span><b>${t}</b><p>${o(d[t])}</p></div>`).join("")}
      </div>
      <p>You earned <b>${e.stars} stars</b>. Now use all four verbs on a real class board.</p>
      <button class="big" data-act="open-play">Open the message board</button>
    </main>`}function Y(){const t=e.board.length?e.board.map(a=>J(a)).join(""):'<p class="empty">Press GET to bring the messages through the window.</p>';return`${h("Message board free play")}
    <main class="play">
      <section class="play-board">
        <div class="panel-title"><b>📋 Class board</b><span>What the app shows</span></div>
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
        ${X()}
      </aside>
    </main>`}function J(t){const a=e.mine.includes(t.key);return`<article class="message ${a?"mine":""}">
    <div><b>${t.welcome?"Welcome":o(t.name)}</b>${a?"<em>yours</em>":""}</div>
    <p>${o(t.text)}</p>
    ${t.welcome?"":`<button class="like" data-act="play-like" data-key="${o(t.key)}">🩹 PATCH a like · ${t.likes}</button>`}
  </article>`}function X(){if(!e.exchange)return'<p class="empty">Try a verb. The request will appear here.</p>';const t=e.exchange;return`<div class="log-body">
    <strong class="method ${t.method.toLowerCase()}">${o(t.method)}</strong>
    <p>${o(t.url)}</p>
    <h3>Sent</h3>
    <pre>${o(t.body??"No body")}</pre>
    <h3>Answer</h3>
    <strong>${t.status}</strong>
    <pre>${o(t.response)}</pre>
  </div>`}function y(){return'<button class="skip" data-act="skip">Message board</button>'}function Q(){return e.passOpen?`<div class="veil"><form class="password" id="pass-form">
    <h2>Teacher password</h2>
    <input id="pass" type="password" autocomplete="off" />
    ${e.passWrong?'<p class="feedback bad">That password is not right.</p>':""}
    <div><button type="button" data-act="skip-close">Cancel</button><button class="big" type="submit">Open</button></div>
  </form></div>`:""}function U(t){if(e.solved)return;const a=e.phase==="mix"?l[e.mix]:O();if(a){if(t!==a.verb){e.streak=0,e.wrong=`${m[t]} ${t} means “${d[t]}.” Try again!`,n();return}e.solved=!0,e.wrong="",e.streak+=1,e.stars+=e.streak>=3?2:1,n()}}function Z(){e.solved=!1,e.wrong="",e.phase==="train"?e.round<4?e.round+=1:e.verb<p.length-1?(e.verb+=1,e.round=0):(e.phase="mix",e.mix=0):e.mix<l.length-1?e.mix+=1:e.phase="done",n()}function G(){e.phase="play",e.board=[],e.exchange=null,e.wrong="",e.passOpen=!1,e.passWrong=!1,n()}async function u(t){if(!e.busy){e.busy=!0,e.wrong="",n();try{await t()}catch{e.wrong="The window did not answer. Check the connection and try again."}finally{e.busy=!1,n()}}}async function ee(){await u(async()=>{let t=await E(),a=k(t.json)??{};typeof a[c]!="string"&&(await x({[c]:I}),t=await E(),a=k(t.json)??{}),e.board=se(a),e.mine=e.mine.filter(r=>e.board.some(s=>s.key===r)),e.exchange=g(t.exchange,`${e.board.length} message${e.board.length===1?"":"s"} came back.`),requestAnimationFrame(oe)})}async function te(){const t=document.querySelector("#message"),a=H(t?.value??e.message);if(e.message=t?.value??"",!a){e.wrong="Write a message first.",n();return}await u(async()=>{const r=M(v),s=b(r),i=await x({[r]:{name:e.name||"Friend",text:a,at:Date.now()},[s]:0});e.exchange=g(i.exchange,"The new message was stored. Press GET to show it."),i.status<400&&(e.mine=e.mine.concat(r),e.message="")})}async function ae(t){await u(async()=>{const a=await N(b(t));e.exchange=g(a.exchange,"The like changed. Press GET to show the new number.")})}async function re(){const t=e.mine.slice();if(!t.length){e.wrong="You do not have any messages to delete.",n();return}await u(async()=>{let a=await w(t[0]);for(const r of t)r!==t[0]&&(a=await w(r)),await w(b(r));e.exchange=g(a.exchange,"Your messages were removed. Press GET to update the board.")})}function se(t){const a=[];for(const[r,s]of Object.entries(t)){if(r===c&&typeof s=="string"){a.push({key:r,name:"Welcome",text:s,likes:0,welcome:!0,at:0});continue}if(!r.startsWith(v)||!s||typeof s!="object"||Array.isArray(s))continue;const i=s;if(typeof i.name!="string"||typeof i.text!="string")continue;const T=t[b(r)];a.push({key:r,name:i.name,text:i.text,likes:typeof T=="number"?T:0,welcome:!1,at:typeof i.at=="number"?i.at:0})}return a.sort((r,s)=>r.at-s.at)}function b(t){return`${R}${t===c?"welcome":t.slice(v.length)}`}function g(t,a){return{...t,response:a}}function oe(){const t=document.querySelector("#messages");t instanceof HTMLElement&&(t.scrollTop=t.scrollHeight)}f.addEventListener("click",t=>{const a=t.target?.closest("[data-act]");if(!a||a.hasAttribute("disabled")||e.busy)return;const r=a.dataset.act;if(r==="intro-next")e.intro<2?e.intro+=1:e.phase="train",n();else if(r==="answer"){const s=a.dataset.verb;(s==="GET"||s==="POST"||s==="PATCH"||s==="DELETE")&&U(s)}else r==="game-next"?Z():r==="open-play"?G():r==="skip"?(e.passOpen=!0,e.passWrong=!1,n(),document.querySelector("#pass")?.focus()):r==="skip-close"?(e.passOpen=!1,n()):r==="play-get"?ee():r==="play-post"?te():r==="play-delete"?re():r==="play-like"&&ae(a.dataset.key??"")});f.addEventListener("input",t=>{const a=t.target;a instanceof HTMLTextAreaElement&&a.id==="message"&&(e.message=a.value)});f.addEventListener("submit",t=>{if(t.target instanceof HTMLFormElement)if(t.preventDefault(),t.target.id==="name-form"){const a=document.querySelector("#name"),r=D(a?.value??"");if(!W(r)){e.name=r,e.wrong="Type your first name.",n();return}e.name=r,e.wrong="",e.phase="intro",n()}else t.target.id==="pass-form"&&((document.querySelector("#pass")?.value??"")!=="admin"?(e.passWrong=!0,n(),document.querySelector("#pass")?.focus()):G())});function o(t){return t.replace(/[&<>"']/g,a=>a==="&"?"&amp;":a==="<"?"&lt;":a===">"?"&gt;":a==='"'?"&quot;":"&#39;")}n();
