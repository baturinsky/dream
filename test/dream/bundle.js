(()=>{function M([t,e,n,o]){return`rgba(${t*255},${e*255},${n*255},${o})`}function d(t,e,n=1){return t.map((o,r)=>o+e[r]*n)}function zt(t,e=1){return t.map((n,o)=>n*e)}function nt(t,e){return d(t,e,-1)}function Oe(t){return t.reduce((e,n)=>e+n*n,0)**.5}function ot(t,e){return Oe(nt(e,t))}var ft=2**31,c=Xe(123);function Xe(t=0){0<t&&t<1&&(t=~~(t*ft));let e=n=>(t=t*16807%2147483647)%n;return c=n=>n==-1?t:n==null?e(ft)/ft:e(n),c}function O(t,e=c){if(!t)return null;let n=e(t.length);return t[n]}function rt(t,e=c){let n=dt(t),o=e()*n-t[0],r=0;for(;o>=0;)o-=t[++r];return r}function qt(t,e,n=c){let o=t.map(e),r=rt(o);return t[r]}function H(t,e=c,n=o=>o){let o=rt(Object.values(t).map(n),e);return Object.keys(t)[o]}function dt(t){return t.reduce((e,n)=>e- -n,0)}function Z(t=c){let e="";for(let n=0;n<t(3)+2;n++)e+=O([..."kstnhmyrw",""],t)+O([..."aiueo",""],t);return Ne(e)}function Ne(t){return t?t[0].toUpperCase()+t.substring(1):""}function j(t){for(let e of Object.values(t))for(let n in e){let o=Number(e[n]);!isNaN(o)&&n!="colors"&&(e[n]=o)}return t}function Qt(t,e=c){return t=t*100,t=(t%1>e()?1:0)+~~t,t/=100}var g=j(Object.fromEntries(`Health:So called Hit Points:31
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
`).map((t,e)=>{let[n,o,r]=t.split(":"),i=n[0];return[i,{l:i,name:n,tip:o,colors:r,ind:e}]}))),T=j(Object.fromEntries(`Wooden:67:H:10
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
`).map(t=>{let[e,n,o,r]=t.split(":");return[e,{colors:n,aspects:it(o),chance:r}]}))),k=j(Object.fromEntries(`Door:2:10:Wooden:0:1:
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
`).map((t,e)=>{let[n,o,r,i,a,x]=t.split(":");return[n,{name:n,scale:o,aspects:it(r),material:i,chance:a,ind:e,placeh:x}]}))),G=j(Object.fromEntries(`Human:G
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
`).map((t,e)=>{let[n,o]=t.split(":");return[n,{name:n,aspects:it(o),ind:e}]}))),Vt={...G,...k};function it(t=""){let e={};return[...t].forEach(n=>e[n]=(e[n]||0)+1),e}function yt(t,e,n=1){let o={};t??={},e??={};for(let r in{...t,...e})o[r]=(t[r]||0)+(e[r]||0)*n;return o}function _t(t){let e="";for(let n of Object.keys(g).sort((o,r)=>t[o]-t[r]))t[n]>0&&(e+=`<div class="aspect" data-aspect=${n}><span class=num>${t[n].toFixed(2).replace(/(.00)/g,"")}<span> ${g[n].name}</div>`);return e}function bt(t){return dt(Object.values(t))}var h=64,$=5,f=3,p=100,m=200,L=8,ht=$*f,I=[...new Array(ht)].map((t,e)=>({id:e})),Et=0;function xt(t){return t&&{...Jt(t),chest:xt(t.chest),held:t.held?.map(e=>xt(e))}}var Fe="id,name,kind,pos,scale,right,shape,colors,aspects,type,material,explored,level,day".split(",");function Jt(t){return Object.fromEntries(Fe.map(e=>[e,t[e]]))}function gt(t){if(!t)return null;let e=u({...ne[t.kind],...Jt(t),chest:gt(t.chest)});return t.held?.forEach(n=>{K(e,gt(n),n.pos)}),e}function Ut(){return{cur:s.id,lid:Et,rooms:I,all:Object.values(y).filter(t=>!t.parent&&t.kind!=4).map(t=>xt(t))}}function te(t){Object.values(y).forEach(e=>X(e)),t.all.forEach(e=>gt(e)),W(y[t.cur]),Et=t.lid,I=t.rooms}function ee(){return++Et}var re=(t,e,n)=>Ye(je(n,t),e),z=(t,e)=>re("S",t,e);var at=(t,e)=>re("O",t,e);function Ye(t,e){if(!t)debugger;if(!e)return t;let n=t.cloneNode();return b(n).filter=Ge(e),b(n).drawImage(t,0,0),n}var q=32,Be=48,Ze=64;var st=144,ie=Ze,ae=Be,oe=16;function je(t,e,n=0){e=="O"&&(n=1);let[o,r]=Tt(L+n*2);return o.id=e+t,r.filter=`url(#_${e})`,r.drawImage(img,t%oe*L,~~(t/oe)*L,L,L,n,n,L,L),o}function b(t){return t.getContext("2d")}function Ge(t){if(!St.has(t)){St.add(t);let[e,n]=[...t].map(r=>S[Number.parseInt(r,36)]),o=`<filter id=f${t}><feColorMatrix type=matrix values="${e[0]} ${n[0]} 0 0 0  ${e[1]} ${n[1]} 0 0 0  ${e[2]} ${n[2]} 0 0 0  0 0 0 1 0" /></filter>`;DEFS.innerHTML+=o}return`url(#f${t})`}function Tt(t,e){let n=document.createElement("canvas");return n.classList.add("sprite"),n.width=n.height=t,Object.assign(n,e),[n,b(n)]}var Q=t=>b(t).createPattern(t,"repeat");function Ke(t,e){I[t].dream=e;for(let n of Y(t))A(n,[]),n.dream?X(n):n.kind!=1&&(n.div.style.display=e?"none":"block")}function se(t){let e=E(t.pos);Ke(e,!0);let n=I[e];n.aspects=t.aspects,n.level=t.level,We(e),ze(e),Pt(e)}function We(t){for(let e=0;e<3;e++)u({...N,level:1,colors:"nm",type:H(G),name:Z(),chest:_(q+2,"lk"),pos:F(t),dream:!0})}function ze(t){for(let e of[!0,!1]){let n=wt(t,e),o=Ct(t);o[0]+=(e?.3:.7)*m,n.forEach((r,i)=>{r.pos=d(o,[0,(i+.5)*h/n.length,0]),console.log(r.pos),r.right=e,r.combat={pos:r.pos,hp:qe(r),delay:At(r),aggro:0},V(r)})}}function qe(t){return~~((1+J(t,"H")+t.level*.2)*10)}function At(t){return~~(3e3/(1+J(t,"T")+t.level*.1+c()))}function Qe(t){return(1+J(t,"S")+t.level*.1)*3}function le(t,e){A(e,pe(e));let n=Qe(t);e.combat.hp-=n}function Pt(t){let e=wt(t),n=Math.min(...e.map(i=>i.combat.delay));for(let i of e)i.combat.delay-=n;let o=e.find(i=>i.combat.delay==0),r=qt(e,i=>i.dream==o.dream?0:1+J(i,"C"));A(o,ce(o,r))}var N={bitPos:[[3,1],[2,14],[2,10],[2,13]],mountPoint:[0,0,16],size:[16,24],origin:"75% 50%",kind:1,makeBits:t=>[[t.shape,t.colors],[ie,t.colors],tn(t.chest),[ae,t.colors]]},tt={bitPos:[[0,0]],size:[10,10],kind:3,makeBits:t=>t&&[[t.shape,t.colors]]},$t={...tt,mountPoint:[5,0,0],kind:2},P={...tt,kind:4},ne=[,N,$t,tt,P],me=1,lt=2,kt=3;function R(t,e,n){let o=t.pos,r=Date.now(),{stopDistance:i,mode:a}=n||{};a??=me;let x=a==lt?.3:.1,l=ot(t.pos,e)/x,B=e[0]-t.pos[0];B!=0&&a==me&&(t.right=B>0);let Re=nt(e,o);return()=>{let Gt=Date.now(),Kt=Math.min(Gt-r,l);t.pos=d(o,Re,l?Kt/l:1);let Wt=Kt>=l||ot(t.pos,e)<(i??0);return t.transform=Wt?"":`rotateZ(${a==lt?-10:a==kt?10:Math.sin(Gt/100)*5}deg)`,!Wt}}function Ve(t){return t.right?1:-1}var _e="scaleX(-1)";function D(t,e,n=0){let o=E(t.pos),r=E(e);return r==o?[()=>R(t,e,{stopDistance:n})]:[()=>R(t,F(o)),()=>t.pos=d(F(r),[5,0,0]),()=>R(t,e,{stopDistance:n})]}function Lt(t){let e=Date.now();return()=>Date.now()<e+t}function pe(t){return[()=>R(t,d(t.combat.pos,[Ve(t)*-20,0,0]),{mode:kt}),()=>R(t,t.combat.pos,{mode:kt})]}function ce(t,e){return[()=>R(t,e.combat.pos,{mode:lt}),()=>{le(t,e)},()=>R(t,t.combat.pos,{mode:lt}),()=>{t.combat.delay=At(t),Pt(E(t.pos))}]}function pt(t){return[t.size[0]*t.scale,t.size[1]*t.scale]}function V(t){!t||(ct(t),v(t))}function v(t,e){if(!t)return;if(!t.animation&&t.actionsQueue){let i=t.actionsQueue.shift();if(i){let a=i();a instanceof Function&&(t.animation=a)}}t.animation&&t.animation()==!1&&delete t.animation;let n=t.div,o=e?d(t.pos,e):t.pos,r=nt(o,Ue(t));n.style.opacity=t.opacity,n.classList.toggle("current",t==s),n.classList.add("k"+t.kind),Je(n,r,(t.right?_e:"")+(t.transform??""))}function Je(t,e,n=""){t.style.left=`${e[0]}px`,t.style.top=`${e[2]}px`,t.style.transform=`translateZ(${e[1]}px) `+n}function Ue(t){return[pt(t)[0]/2,0,pt(t)[1]]}function Dt(t){let[e]=Tt(1),n=document.createElement("div");return n.classList.add("entity"),n.appendChild(e),n.style.position="absolute",e.id="s"+t.id,t.canvas=e,t.div=n,ct(t),e}function tn(t){return t&&[t.shape,t.colors]}function ct(t){t.material&&(t.colors=T[t.material].colors),t.makeBits&&(t.bits=t.makeBits(t));let e=t.canvas,n=1;if(e.width=t.size[0]*n,e.height=t.size[1]*n,e.style.transformOrigin=t.origin,e.style.transform=`scale(${t.scale})`,b(e).imageSmoothingEnabled=!1,t.bits)for(let o=0;t.bits[o];o++){let r=t.bits[o];if(!r||!r[0])continue;let i=at(r[1],r[0]);b(e).drawImage(i,t.bitPos[o][0]*n,t.bitPos[o][1]*n,i.width*n,i.height*n)}}function u(t){t.id??=ee(),t.held=[];let e={canvas:Dt(t),floor:0,actionsQueue:[],...t},n=Vt[e.type];if(n&&(n.placeh&&(e.mountPoint??=[5,0,9-n.placeh*8]),e.shape??=[0,16,80,0,0][e.kind]+n.ind,e.scale??=n.scale),e.scale??=1,ct(e),e.pos&&(y[t.id]=e,Scene.appendChild(e.div),t.className&&e.div.classList.add(t.className),v(e)),!e.aspects)for(let o of[T[e.material],G[e.type],k[e.type]])e.aspects=yt(e.aspects,o?.aspects);return e}function X(t){t.div.parentElement?.removeChild(t.div),delete y[t.id]}function K(t,e,n){e.kind==2&&(t.div.appendChild(e.div),t.held.unshift(e),e.parent=t,e.pos=n??zt(t.mountPoint,t.scale),v(e))}function Mt(t,e){let n=t.held.shift();return n&&(n.pos=e??t.pos,Scene.appendChild(n.div),delete n.parent,v(n)),n}function E(t){return~~(t[0]/m)+f*~~(t[2]/p-1)}function Ct(t){return[t%f*m,0,p*~~(t/f+1)]}function F(t){return d(Ct(t),[m/2,0,0])}function _(t,e){return{...P,shape:t,colors:e}}function ue(t,e){e&&(t.colors=e.colors,t.shape=e.shape,t.scale=e.scale),ct(t)}function C(t,e=!0){return e?xe(U(t).pos):U(t).pos}function U(t){return t.parent?U(t.parent):t}function Y(t){return Object.values(y).filter(e=>E(C(e))==t)}function Ht(t,e){if(!e)return;if(t.kind!=1)debugger;let n=g[e];return u({...P,shape:st+n.ind,colors:n.colors,pos:d(t.pos,[0,0,-30]),className:"thought",deadAt:Date.now()+3e3})}function It(t){return t.level??bt(t.aspects)}function Rt(t){if(!t||!Xt(t))return;let e="",n="";return t.kind==1?e=`${t.name} the ${t.type||"X"}`:e=`${t.material||""} ${t.type}`,n+=`Level ${It(t)}<br/><br/>`,t.aspects&&(n+=_t(t.aspects)),[e,n]}function en(t){let e=Y(E(t.pos)),n=rt(e.map(o=>{if(o==t||!Xt(o))return 0;let r=ot(t.pos,C(o));return It(o)/(10+r)*fe(t,o)}));return e[n]}function nn(t,e){let n=H(e.aspects),o=It(e)*fe(t,e)*.01;o=Qt(o),o&&(t.aspects=yt({[n]:o},t.aspects),t.recent.unshift(e.id),t.recent.length=20,t==Ot&&et(t),Ht(t,n))}function fe(t,e){t.recent??=[];let n=t.recent.indexOf(e.id);return n==-1&&(n=1e6),1-1/(1+n)}function de(t){if(!on(t))return;let e=en(t);!e||A(t,[...D(t,C(e),5),()=>nn(t,e),()=>Lt(1e3)])}function on(t){return!t.actionsQueue?.length&&!t.animation}function ye(t){let e=bt(t.aspects);if(t.level<e){let n=H(t.aspects);t.aspects[n]=Math.max(0,t.aspects[n]-.01*~~(e-t.level+1))}}function be(t){return I[E(C(t))].dream}function A(t,e){!t||(t.actionsQueue=e,delete t.animation)}function wt(t,e=void 0){return Y(t).filter(n=>n.kind==1&&(e===void 0||!n.dream==!e))}function J(t,e){return t.aspects[e]??0}var Nt=[],mt=[-100,20],he=600;function xe(t){return[t[0],t[1],Math.ceil(t[2]/p)*p]}function ge(t,e){ue(w,t),w.pos=e,Scene.appendChild(w.div),v(w)}function Ft(){Scene.style.left=`${mt[0]}px`,Scene.style.top=`${mt[1]}px`}function Ee(){onpointerup=t=>{Nt[t.button]=!1},onpointerdown=t=>{Nt[t.button]=!0;let[e,n,o,r]=ut(t),i=[e,n,r*p],a;if(s&&o=="f"&&!t.shiftKey&&((t.button==2||t.button==0&&!s.held.length)&&(a=D(s,i)),t.button==0&&s.held.length&&(a=[...D(s,i),()=>Mt(s)])),s&&o=="s"&&!t.shiftKey){let l=y[r];l&&l!=s&&(t.button==2&&(console.log(l),a=D(s,C(l),15)),t.button==0&&(l.kind==1?W(U(l)):a=[...D(s,C(l)),()=>{if(s.held.length){let B=Mt(s);B&&K(l,B)}else K(s,l)}]))}a&&A(s,[...a,()=>Lt(5e3)]),oncontextmenu=l=>{l.shiftKey||l.preventDefault()},t.target.classList.contains("sprite")},onmousemove=t=>{if(Nt[1]){let l=.5;mt=d(mt,[t.movementX,t.movementY],l),Ft()}let[e,n,o,r]=ut(t),i=[e,n,r*p],a=s?.held[0],x=y[r];if(et(x),a&&(o=="f"&&ge(a,i),o=="s"&&x&&x.kind==2)){let l=d(x.pos,[0,0,-pt(x)[1]*.7]);ge(a,l),x.div.parentElement?.appendChild(w.div)}t.preventDefault()},onwheel=t=>{he-=t.deltaY*.2,Yt()}}var Ot;function Xt(t){return t.kind==2||t.kind==1}function et(t){let e=Rt(t)||Rt(s);Ot=t||s,Info.innerHTML=e?`<h1>${e[0]}</h1>${e[1]}`:""}function Yt(){Scene.style.transform=`translateZ(${he}px)`}function ut(t){let[e,n,o]=[t.target.id,t.offsetX,t.offsetY],r=e[0],i=e.substring(1);return[n,o,r,i]}function Bt(t){return[...t.matchAll(/(\w\w)(\w\w)(\w\w)/g)].map(e=>e.slice(1,4).map(n=>Math.round(Number.parseInt(n,16)/255*35).toString(36)).join("")).join("")}function Zt(t){return[...t.matchAll(/(\w)(\w)(\w)/g)].map(e=>[...e.slice(1,4).map(n=>~~(Number.parseInt(n,36)/36*100)/100),1])}var ve=`43002a
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
`;var Pe="1",Ce="2",we=0;function rn(t){for(let e in t){let n=M(t[e]);console.log(`%c          %c ${Number(e).toString(36)} ${n}`,`color:#00; background:${n}`,"background:#fff")}for(let e in T){let[n,o]=[...T[e].colors].map(r=>S[Number.parseInt(r,36)]);console.log(`%c   %c %c ${e}`,`color:#00; background:${M(n)}`,`color:#00; background:${M(o)}`,"background:#fff")}for(let e of Object.values(g)){let[n,o]=[...e.colors].map(r=>S[Number.parseInt(r,36)]);console.log(`%c   %c %c ${e.name}`,`color:#00; background:${M(n)}`,`color:#00; background:${M(o)}`,"background:#fff")}}function an(){for(let t in S){let e=M(S[t]),n=Number(t).toString(36);Debug.innerHTML+=`<div class=csel id="C${n}" style="background:${e}" oncontextmenu="return false;" >${n}</div>`}}function ke(){rn(S),an();for(let t=0;t<256;t++)Debug.appendChild(at(0,t))}addEventListener("pointerdown",t=>{let[e,n,o,r]=ut(t);if(o=="f"&&t.button==0&&t.shiftKey){let a=Ae();a.pos=[e,n,r*p],v(a)}o=="O"&&(we=r),o=="C"&&(t.button==0?Pe=r:Ce=r),Preview.innerHTML="";let i=Ae();Preview.appendChild(i.canvas)});var Se="ayhiadream",Te=0;addEventListener("keydown",t=>{if(t.code=="KeyD"&&Debug.classList.toggle("dn"),t.code=="KeyS"){let e=Ut();localStorage.setItem(Se,JSON.stringify(e))}if(t.code=="KeyL"){let e=localStorage.getItem(Se);e&&te(JSON.parse(e))}if(t.code=="KeyT"){let e=Y(E(s.pos)),n=O(e);A(s,D(s,C(n),15))}if(t.code=="KeyE"){let e=Object.keys(g)[Te];Ht(s,e),Te++}t.code=="KeyN"&&se(s)});function Ae(){return u({...P,shape:we,colors:Pe+Ce,pos:[0,0,0]})}function $e(){console.log(g),console.log(T),console.log(k)}function Le(){let t="";for(let i=0;i<=f;i++)t+=`<canvas class=wall  id=w${i} style="left:${i*m}px;height:${$*p}px;width:${h}px" 
    width=${h*2} height=${$*p*2} /></canvas>`;for(let i=0;i<=$;i++)t+=`<canvas class=floor id=f${i} style="top:${i*p}px;height:${h}px;width:${f*m}px" 
    width=${f*m*2} height=${h*2}></canvas>`;Scene.innerHTML+=t;for(let i of[Back,Front])i.width=m*f*2,i.height=p*$*2,i.style.width=`${m*f}px`,i.style.height=`${p*$}px`;Front.style.transform=`translateZ(${h}px)`;let e=Q(z("2f",1)),n=b(Back);n.fillStyle=e,n.fillRect(0,0,1e4,1e4),n=b(Front),n.fillStyle=Q(z("2g",1));for(let i=0;i<f;i++)n.fillRect(i*m*2-10,0,20,1e4);for(let i=0;i<$;i++)n.fillRect(0,i*p*2-10,1e4,20);let o=Q(z("gf",2));document.querySelectorAll(".wall").forEach(i=>{let a=b(i);a.fillStyle=o,a.fillRect(0,0,1e4,1e4)});let r=Q(z("rq",1));document.querySelectorAll(".floor").forEach(i=>{let a=b(i);a.fillStyle=r,a.fillRect(0,0,1e4,1e4)});for(let i=0;i<ht;i++)u({...tt,shape:80,colors:"ef",type:"Door",level:i,scale:2,pos:F(i)})}var S=Zt(Bt(ve)),St=new Set,lr,De,sn,w,He,s,y={};onload=()=>{img.onload=ln,img.src="16cols.webp"};function W(t){if(!t)return;let e=s;s=t,V(e),V(s),s.div.appendChild(He.div)}function ln(){Le(),ke(),Yt(),Ee(),Ft(),De=u({...N,level:1,shape:18,colors:"nm",type:"Cat",name:Z(),chest:_(q+2,"lk"),pos:[20,10,p]}),sn=u({...N,level:1,shape:26,colors:"qp",type:"Dog",name:Z(),chest:_(q+1,"ba"),pos:[40,10,p]}),w=u({...P,opacity:.5,shape:1,colors:"ab",pos:[0,0,0],noclick:!0}),w.canvas.classList.add("phantom");for(let t=0;t<30;t++){let e=k[H(k,c,n=>n.chance)];u({...$t,kind:2,type:e.name,material:c(2)?O(Object.keys(T)):e.material,pos:[c(f)*m+10+c(m-20),c(h),p]})}He=u({...P,shape:8,colors:"ab",pos:[8,0,4],className:"pointer"}),W(De),Ie(0),et(),$e()}var Me=0,jt=0;function Ie(t){let e=t-Me||1;Me=t;let n=Date.now();jt=jt*.9+1e3/e*.1,FPS.innerText=`FPS: ${~~jt}`,Object.values(y).forEach(o=>{(o.actionsQueue.length||o.animation)&&v(o),o.deadAt&&n>o.deadAt&&X(o),o.kind==1&&(be(o)||e>c()*3e3&&(ye(o),de(o))),document.querySelectorAll(".aspect").forEach(r=>{let i=g[r?.dataset?.aspect];if(!i)return;delete r?.dataset?.aspect;let a=Dt({...P,shape:st+i.ind,colors:i.colors});r.prepend(a)})}),requestAnimationFrame(Ie),s?.held.length||(w.div.style.opacity="0")}})();
//# sourceMappingURL=bundle.js.map
