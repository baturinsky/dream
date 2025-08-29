(()=>{function L([e,t,n,o]){return`rgba(${e*255},${t*255},${n*255},${o})`}function T(e,t,n=1){return e.map((o,i)=>o+t[i]*n)}function De(e,t=1){return e.map((n,o)=>n*t)}function j(e,t){return T(e,t,-1)}function gt(e){return e.reduce((t,n)=>t+n*n,0)**.5}function K(e,t){return gt(j(t,e))}var oe=2**31,m=xt(123);function xt(e=0){0<e&&e<1&&(e=~~(e*oe));let t=n=>(e=e*16807%2147483647)%n;return m=n=>n==-1?e:n==null?t(oe)/oe:t(n),m}function H(e,t=m){if(!e)return null;let n=t(e.length);return e[n]}function re(e,t=m){let n=ie(e),o=t()*n-e[0],i=0;for(;o>=0;)o-=e[++i];return i}function I(e,t=m,n=o=>o){let o=re(Object.values(e).map(n),t);return Object.keys(e)[o]}function ie(e){return e.reduce((t,n)=>t- -n,0)}function ae(e=m){let t="";for(let n=0;n<e(3)+2;n++)t+=H([..."kstnhmyrw",""],e)+H([..."aiueo",""],e);return bt(t)}function bt(e){return e?e[0].toUpperCase()+e.substring(1):""}function R(e){for(let t of Object.values(e))for(let n in t){let o=Number(t[n]);!isNaN(o)&&n!="colors"&&(t[n]=o)}return e}function Ie(e,t=m){return e=e*100,e=(e%1>t()?1:0)+~~e,e/=100}var x=R(Object.fromEntries(`Health:So called Hit Points:31
Strength:Dealing Damage:fg
Resilience:Damage reduction:qp
Greed:Find More:c4
Bloom:Regeneration:ba
Courage:Cover your allies:21
Anger:Avenge Damage:uv
Mercy:Heal Friends:lx
Knowledge:Writing and Reading:mn
Light:Strike True:je
Dark:Avoid Damage:o8
Time:Attack Rate:lm
Purity:Resist Poison:rq
Venom:Poison:ba`.split(`
`).map((e,t)=>{let[n,o,i]=e.split(":"),r=n[0];return[r,{l:r,name:n,tip:o,colors:i,ind:t}]}))),E=R(Object.fromEntries(`Wooden:67:H:10
Iron:32:S:10
Stone:mn:R:10
Golden:c4:G:2
Plant:ba:B:5
Leather:56:C:5
Bone:ji:A:5
Cloth:tv:M:10
Paper:kl:K:5
Glass:wr:L:5
Obsidian:no:D:2
Copper:ef:T:5
Silver:lx:P:3
Asbestos:kb:V:1`.split(`
`).map(e=>{let[t,n,o,i]=e.split(":");return[t,{colors:n,aspects:W(o),chance:i}]}))),P=R(Object.fromEntries(`Door:2:10:Wooden:0:1:
Bed:2:H:Wooden:10:.5
Column:3:R:Stone:0:1:
Apple:1:B:Plant:10:1:
Chair:2:H:Wooden:10:1:
Chest:1:G:Wooden:10:1:
Shelf:2:G:Wooden:0:1:
Stand:2::Stone:0:1:
Display:2::Glass:0:1:
Plaque:2::Iron:0:1:
Big Table:2:R:Stone:0:1:
Display:2::Glass:0:1:
Dial:2::Glass:0:1:
Table:2::Wooden:10:.5:
Clock:1:T:Golden:1:1:
Pedestal:1::Wooden::1:
Mirror:2::Glass:5:1:
Angel:2:P:Silver:3:1:
Press:2::Iron:0:1:
Brush:2::Cloth:0:1:
Wine:1:A:Plant:5:1:`.split(`
`).map((e,t)=>{let[n,o,i,r,s,c]=e.split(":");return[n,{name:n,scale:o,aspects:W(i),material:r,chance:s,ind:t,placeh:c}]}))),Re=R(Object.fromEntries(`Human:G
Elf:B
Cat:D
Ogre:M
Fairy
Bird
Rat
Raven
Skel
Imp
Dog
Hippo
Lizard
Drago
Alien
Hare`.split(`
`).map((e,t)=>{let[n,o]=e.split(":");return[n,{name:n,aspects:W(o),ind:t}]})));function W(e=""){let t={};return[...e].forEach(n=>t[n]=(t[n]||0)+1),t}function se(e,t,n=1){let o={};e??={},t??={};for(let i in{...e,...t})o[i]=(e[i]||0)+(t[i]||0)*n;return o}function Ne(e){let t="";for(let n of Object.keys(x).sort((o,i)=>e[o]-e[i]))e[n]>0&&(t+=`<div class="aspect" data-aspect=${n}><span class=num>${e[n].toFixed(2).replace(/(.00)/g,"")}<span> ${x[n].name}</div>`);return t}function le(e){return ie(Object.values(e))}var Xe=(e,t,n)=>ht(St(n,e),t),N=(e,t)=>Xe("S",e,t);var z=(e,t)=>Xe("O",e,t);function ht(e,t){if(!e)debugger;if(!t)return e;let n=e.cloneNode();return y(n).filter=Tt(t),y(n).drawImage(e,0,0),n}var ce=32,Et=48,vt=64;var q=144,Fe=vt,Be=Et,Oe=16;function St(e,t,n=0){t=="O"&&(n=1);let[o,i]=me(k+n*2);return o.id=t+e,i.filter=`url(#_${t})`,i.drawImage(img,e%Oe*k,~~(e/Oe)*k,k,k,n,n,k,k),o}function y(e){return e.getContext("2d")}function Tt(e){if(!pe.has(e)){pe.add(e);let[t,n]=[...e].map(i=>h[Number.parseInt(i,36)]),o=`<filter id=f${e}><feColorMatrix type=matrix values="${t[0]} ${n[0]} 0 0 0  ${t[1]} ${n[1]} 0 0 0  ${t[2]} ${n[2]} 0 0 0  0 0 0 1 0" /></filter>`;DEFS.innerHTML+=o}return`url(#f${e})`}function me(e,t){let n=document.createElement("canvas");return n.classList.add("sprite"),n.width=n.height=e,Object.assign(n,t),[n,y(n)]}var O=e=>y(e).createPattern(e,"repeat");var J={bitPos:[[3,1],[2,14],[2,10],[2,13]],mountPoint:[0,0,16],size:[16,24],origin:"75% 50%",kind:1,makeBits:e=>[[e.shape,e.colors],[Fe,e.colors],$t(e.chest),[Be,e.colors]]},F={bitPos:[[0,0]],size:[10,10],kind:3,makeBits:e=>e&&[[e.shape,e.colors]]},fe={...F,mountPoint:[5,0,0],kind:2},v={...F,kind:4},Ye=[,J,fe,F,v];function ue(e,t,n=0){let o=e.pos,i=Date.now(),r=K(e.pos,t)*10,s=t[0]-e.pos[0];s!=0&&(e.right=s>0);let c=j(t,o);return()=>{let l=Date.now(),w=Math.min(l-i,r);e.pos=T(o,c,r?w/r:1);let He=w>=r||K(e.pos,t)<n;return e.transform=He?"":`rotateZ(${Math.sin(l/100)*5}deg)`,!He}}var Pt="scaleX(-1)";function $(e,t,n=0){let o=D(e.pos),i=D(t);return i==o?[()=>ue(e,t,n)]:[()=>ue(e,V(o)),()=>e.pos=V(i),()=>ue(e,t,n)]}function Q(e){return[e.size[0]*e.scale,e.size[1]*e.scale]}function de(e){!e||(_(e),b(e))}function b(e,t){if(!e)return;if(!e.animation&&e.actionsQueue){let s=e.actionsQueue.shift();if(s){let c=s();c instanceof Function&&(e.animation=c)}}e.animation&&e.animation()==!1&&delete e.animation;let n=e.div,o=t?T(e.pos,t):e.pos,i=j(o,kt(e));n.style.left=`${i[0]}px`,n.style.top=`${i[2]}px`,n.style.opacity=e.opacity,n.classList.toggle("current",e==a),n.classList.add("k"+e.kind);let r=`translateZ(${o[1]}px)`+(e.right?Pt:"")+(e.transform??"");n.style.transform=r}function kt(e){return[Q(e)[0]/2,0,Q(e)[1]]}function ye(e){let[t]=me(1),n=document.createElement("div");return n.classList.add("entity"),n.appendChild(t),n.style.position="absolute",t.id="s"+e.id,e.canvas=t,e.div=n,_(e),t}function $t(e){return e&&[e.shape,e.colors]}function _(e){e.material&&(e.colors=E[e.material].colors),e.makeBits&&(e.bits=e.makeBits(e));let t=e.canvas,n=1;if(t.width=e.size[0]*n,t.height=e.size[1]*n,t.style.transformOrigin=e.origin,t.style.transform=`scale(${e.scale})`,y(t).imageSmoothingEnabled=!1,e.bits)for(let o=0;e.bits[o];o++){let i=e.bits[o];if(!i||!i[0])continue;let r=z(i[1],i[0]);y(t).drawImage(r,e.bitPos[o][0]*n,e.bitPos[o][1]*n,r.width*n,r.height*n)}}var U=0;function Ge(e){U=e}function d(e){e.id??=++U,e.held=[];let t={canvas:ye(e),floor:0,scale:1,actionsQueue:[],...e};if(_(t),e.kind==2){let n=P[e.type];t.mountPoint=[5,0,9-n.placeh*8]}if(t.pos&&(f.push(t),Scene.appendChild(t.div),e.className&&t.div.classList.add(e.className),b(t)),!t.aspects)for(let n of[E[t.material],Re[t.type],P[t.type]])t.aspects=se(t.aspects,n?.aspects);return t}function ee(e){e.div.parentElement?.removeChild(e.div),f.splice(f.indexOf(e),1)}function B(e,t,n){t.kind==2&&(e.div.appendChild(t.div),e.held.unshift(t),t.parent=e,t.pos=n??De(e.mountPoint,e.scale),b(t))}function ge(e,t){let n=e.held.shift();return n&&(n.pos=t??e.pos,Scene.appendChild(n.div),delete n.parent,b(n)),n}function D(e){return~~(e[0]/g)+u*~~(e[2]/p-1)}function V(e){return[(e%u+.5)*g,0,p*~~(e/u+1)]}function xe(e,t){return{...v,shape:e,colors:t}}function Ze(e,t){t&&(e.colors=t.colors,e.shape=t.shape,e.scale=t.scale),_(e)}function A(e,t=!0){return t?ze(X(e).pos):X(e).pos}function X(e){return e.parent?X(e.parent):e}function be(e){return f.filter(t=>D(A(t))==e)}function he(e,t){if(!t)return;if(e.kind!=1)debugger;let n=x[t];return d({...v,shape:q+n.ind,colors:n.colors,pos:T(e.pos,[0,0,-30]),className:"thought",deadAt:Date.now()+3e3})}function Ee(e){return e.level??le(e.aspects)}function ve(e){if(!e||!Te(e))return;let t="",n="";return e.kind==1?t=`${e.name} the ${e.type||"X"}`:t=`${e.material||""} ${e.type}`,n+=`Level ${Ee(e)}<br/><br/>`,e.aspects&&(n+=Ne(e.aspects)),[t,n]}function At(e){let t=be(D(e.pos)),n=re(t.map(o=>{if(o==e||!Te(o))return 0;let i=K(e.pos,A(o));return Ee(o)/(10+i)*je(e,o)}));return t[n]}function Ct(e,t){let n=I(t.aspects),o=Ee(t)*je(e,t)*.01;o=Ie(o),o&&(e.aspects=se({[n]:o},e.aspects),e.recent.unshift(t.id),e.recent.length=20,e==Se&&G(e),he(e,n))}function je(e,t){e.recent??=[];let n=e.recent.indexOf(t.id);return n==-1&&(n=1e6),1-1/(1+n)}function Ke(e){if(!wt(e))return;let t=At(e);!t||(console.log("exploring",t),Y(e,[...$(e,A(t),5),()=>Ct(e,t)]))}function wt(e){return!e.actionsQueue?.length&&!e.animation}function We(e){let t=le(e.aspects);if(e.level<t){let n=I(e.aspects);e.aspects[n]=Math.max(0,e.aspects[n]-.01*~~(t-e.level+1))}}var Pe=[],te=[-100,20],Ve=600;function Y(e,t){!e||(e.actionsQueue=t,delete e.animation)}function ze(e){return[e[0],e[1],Math.ceil(e[2]/p)*p]}function qe(e,t){Ze(S,e),S.pos=t,Scene.appendChild(S.div),b(S)}function ke(){Scene.style.left=`${te[0]}px`,Scene.style.top=`${te[1]}px`}function Je(){onpointerup=e=>{Pe[e.button]=!1},onpointerdown=e=>{Pe[e.button]=!0;let[t,n,o,i]=ne(e),r=[t,n,i*p],s;if(a&&o=="f"&&!e.shiftKey&&((e.button==0||e.button==2&&!a.held.length)&&(s=$(a,r)),e.button==2&&a.held.length&&(s=[...$(a,r),()=>ge(a)])),a&&o=="s"&&!e.shiftKey){let l=f.find(w=>w.id==i);l&&l!=a&&(e.button==0&&(console.log(l),s=$(a,A(l),15)),e.button==2&&(l.kind==1?Z(X(l)):s=[...$(a,A(l)),()=>{if(a.held.length){let w=ge(a);w&&B(l,w)}else B(a,l)}]))}s&&Y(a,s),oncontextmenu=l=>{l.shiftKey||l.preventDefault()},e.target.classList.contains("sprite")},onmousemove=e=>{if(Pe[1]){let l=.5;te=T(te,[e.movementX,e.movementY],l),ke()}let[t,n,o,i]=ne(e),r=[t,n,i*p],s=a?.held[0],c=f.find(l=>l.id==i);if(G(c),s&&(o=="f"&&qe(s,r),o=="s"&&c&&c.kind==2)){let l=T(c.pos,[0,0,-Q(c)[1]*.7]);qe(s,l),c.div.parentElement?.appendChild(S.div)}e.preventDefault()},onwheel=e=>{Ve-=e.deltaY*.2,$e()}}var Se;function Te(e){return e.kind==2||e.kind==1}function G(e){let t=ve(e)||ve(a);Se=e||a,Info.innerHTML=t?`<h1>${t[0]}</h1>${t[1]}`:""}function $e(){Scene.style.transform=`translateZ(${Ve}px)`}function ne(e){let[t,n,o]=[e.target.id,e.offsetX,e.offsetY],i=t[0],r=t.substring(1);return[n,o,i,r]}function Ae(e){return[...e.matchAll(/(\w\w)(\w\w)(\w\w)/g)].map(t=>t.slice(1,4).map(n=>Math.round(Number.parseInt(n,16)/255*35).toString(36)).join("")).join("")}function Ce(e){return[...e.matchAll(/(\w)(\w)(\w)/g)].map(t=>[...t.slice(1,4).map(n=>~~(Number.parseInt(n,36)/36*100)/100),1])}var _e=`43002a
890027
d9243c
ff6157
ffb762
c76e46
73392e
34111f
030710
273b2d
458239
9cb93b
ffd832
ff823b
d1401f
7c191a
310c1b
833f34
eb9c6e
ffdaac
ffffe4
bfc3c6
6d8a8d
293b49
041528
033e5e
1c92a7
77d6c1
ffe0dc
ff88a9
c03b94
601761
ddffff
eeeeee
`;function we(e){return e&&{...Ue(e),chest:we(e.chest),held:e.held?.map(t=>we(t))}}var Lt="id,name,kind,pos,scale,right,shape,colors,aspects,type,material,explored,level".split(",");function Ue(e){return Object.fromEntries(Lt.map(t=>[t,e[t]]))}function Le(e){if(!e)return null;let t=d({...Ye[e.kind],...Ue(e),chest:Le(e.chest)});return e.held?.forEach(n=>{B(t,Le(n),n.pos)}),t}function et(){return{cur:a.id,lid:U,all:f.filter(e=>!e.parent&&e.kind!=4).map(e=>we(e))}}function tt(e){[...f].forEach(t=>ee(t)),e.all.forEach(t=>Le(t)),Z(f.find(t=>t.id==e.cur)),Ge(e.lid)}var it="1",at="2",st=0;function Mt(e){for(let t in e){let n=L(e[t]);console.log(`%c          %c ${Number(t).toString(36)} ${n}`,`color:#00; background:${n}`,"background:#fff")}for(let t in E){let[n,o]=[...E[t].colors].map(i=>h[Number.parseInt(i,36)]);console.log(`%c   %c %c ${t}`,`color:#00; background:${L(n)}`,`color:#00; background:${L(o)}`,"background:#fff")}for(let t of Object.values(x)){let[n,o]=[...t.colors].map(i=>h[Number.parseInt(i,36)]);console.log(`%c   %c %c ${t.name}`,`color:#00; background:${L(n)}`,`color:#00; background:${L(o)}`,"background:#fff")}}function Ht(){for(let e in h){let t=L(h[e]),n=Number(e).toString(36);Debug.innerHTML+=`<div class=csel id="C${n}" style="background:${t}" oncontextmenu="return false;" >${n}</div>`}}function lt(){Mt(h),Ht();for(let e=0;e<256;e++)Debug.appendChild(z(0,e))}addEventListener("pointerdown",e=>{let[t,n,o,i]=ne(e);if(o=="f"&&e.button==0&&e.shiftKey){let s=rt();s.pos=[t,n,i*p],b(s)}o=="O"&&(st=i),o=="C"&&(e.button==0?it=i:at=i),Preview.innerHTML="";let r=rt();Preview.appendChild(r.canvas)});var nt="ayhiadream",ot=0;addEventListener("keydown",e=>{if(e.code=="KeyD"&&Debug.classList.toggle("dn"),e.code=="KeyS"){let t=et();localStorage.setItem(nt,JSON.stringify(t))}if(e.code=="KeyL"){let t=localStorage.getItem(nt);t&&tt(JSON.parse(t))}if(e.code=="KeyT"){let t=be(D(a.pos)),n=H(t);Y(a,$(a,A(n),15))}if(e.code=="KeyE"){let t=Object.keys(x)[ot];he(a,t),ot++}});function rt(){return d({...v,shape:st,colors:it+at,pos:[0,0,0]})}function pt(){console.log(x),console.log(E),console.log(P)}function ct(){let e="";for(let r=0;r<=u;r++)e+=`<canvas class=wall  id=w${r} style="left:${r*g}px;height:${C*p}px;width:${M}px" 
    width=${M*2} height=${C*p*2} /></canvas>`;for(let r=0;r<=C;r++)e+=`<canvas class=floor id=f${r} style="top:${r*p}px;height:${M}px;width:${u*g}px" 
    width=${u*g*2} height=${M*2}></canvas>`;Scene.innerHTML+=e;for(let r of[Back,Front])r.width=g*u*2,r.height=p*C*2,r.style.width=`${g*u}px`,r.style.height=`${p*C}px`;Front.style.transform=`translateZ(${M}px)`;let t=O(N("2f",1)),n=y(Back);n.fillStyle=t,n.fillRect(0,0,1e4,1e4),n=y(Front),n.fillStyle=O(N("2g",1));for(let r=0;r<u;r++)n.fillRect(r*g*2-10,0,20,1e4);for(let r=0;r<C;r++)n.fillRect(0,r*p*2-10,1e4,20);let o=O(N("gf",2));document.querySelectorAll(".wall").forEach(r=>{let s=y(r);s.fillStyle=o,s.fillRect(0,0,1e4,1e4)});let i=O(N("rq",1));document.querySelectorAll(".floor").forEach(r=>{let s=y(r);s.fillStyle=i,s.fillRect(0,0,1e4,1e4)});for(let r=0;r<mt;r++)d({...F,shape:80,colors:"ef",type:"Door",level:r,scale:2,pos:V(r)})}var M=64,C=5,u=3,p=100,g=200,k=8,mt=C*u,h=Ce(Ae(_e)),pe=new Set,mo,ut,Dt,S,dt,a,f=[];onload=()=>{img.onload=It,img.src="16cols.gif"};function Z(e){if(!e)return;let t=a;a=e,de(t),de(a),a.div.appendChild(dt.div)}function It(){ct(),lt(),$e(),Je(),ke(),ut=d({...J,level:1,shape:18,colors:"nm",type:"Cat",name:ae(),chest:xe(ce+2,"lk"),pos:[20,10,p]}),Dt=d({...J,level:1,shape:26,colors:"qp",type:"Dog",name:ae(),chest:xe(ce+1,"ba"),pos:[40,10,p]}),S=d({...v,opacity:.5,shape:1,colors:"ab",pos:[0,0,0],noclick:!0}),S.canvas.classList.add("phantom");for(let e=0;e<30;e++){let t=P[I(P,m,n=>n.chance)];d({...fe,shape:80+t.ind,scale:t.scale,kind:2,type:t.name,material:m(2)?H(Object.keys(E)):t.material,pos:[m(u)*g+10+m(g-20),m(M),p]})}dt=d({...v,shape:8,colors:"ab",pos:[8,0,4],className:"pointer"}),Z(ut),yt(0),G(),pt()}var ft=0,Me=0;function yt(e){let t=e-ft||1;ft=e;let n=Date.now();Me=Me*.9+1e3/t*.1,FPS.innerText=`FPS: ${~~Me}`,[...f].forEach(o=>{(o.actionsQueue.length||o.animation)&&b(o),o.deadAt&&n>o.deadAt&&ee(o),o.kind==1&&t>m()*3e3&&(We(o),Ke(o)),document.querySelectorAll(".aspect").forEach(i=>{let r=x[i?.dataset?.aspect];if(!r)return;delete i?.dataset?.aspect;let s=ye({...v,shape:q+r.ind,colors:r.colors});i.prepend(s)})}),requestAnimationFrame(yt),a?.held.length||(S.div.style.opacity="0")}})();
//# sourceMappingURL=bundle.js.map
