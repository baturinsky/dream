(()=>{function N(t){return[...t.matchAll(/(\w\w)(\w\w)(\w\w)/g)].map(e=>e.slice(1,4).map(n=>Math.round(Number.parseInt(n,16)/255*35).toString(36)).join("")).join("")}function O(t){return[...t.matchAll(/(\w)(\w)(\w)/g)].map(e=>[...e.slice(1,4).map(n=>~~(Number.parseInt(n,36)/36*100)/100),1])}var ot=`43002a
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
601761`;var d=Object.fromEntries(`Wood:67:H
Stone:mn:D
Iron:lm:M
Leaf:ba:G
Leather:56:B
Bone:ji:A
Cloth:32:K
Paper:kl:C
Gold:c4:G
Glass:rq:L
Obsidian:po:D
Copper:ef:T
Silver:aa:P
Asbestos:kb:V`.split(`
`).map(t=>{let[e,n,r]=t.split(":");return[e,{colors:n,aspect:r}]})),jt=Object.fromEntries(`Health:So called Hit Points:31
Durability:Damage reduction:qp
Might:Dealing Damage:fg
Growth:Regeneration:tu
Bravery:Cover your allies:a9
Anger:Avenge Damage:cd
Compassion:Heal Friends:23
Knowledge:Writing and Reading:mn
Greed:Find More:c4
Light:Strike True:lk
Darkness:Avoid Damage:no
Time:Attack Rate:rq
Purity:Resist Poison:4u
Venom:Poison:ba`.split(`
`).map((t,e)=>{let[n,r,o]=t.split(":");return[n[0],{name:n,tip:r,colors:o}]}));console.log(d);function T(t,e){if(!t)debugger;let n=t.cloneNode();return f(n).filter=Ht(e),f(n).drawImage(t,0,0),n}var z=32,Mt=48,Pt=64;var it=Pt,at=Mt,rt=16;function Y(t,e,n=0){let[r,o]=q(E+n*2);return r.id=e+t,o.filter=`url(#_${e})`,o.drawImage(img,t%rt*E,~~(t/rt)*E,E,E,n,n,E,E),r}function f(t){return t.getContext("2d")}function Ht(t){if(!I.has(t)){I.add(t);let[e,n]=[...t].map(o=>L[Number.parseInt(o,36)]),r=`<filter id=f${t}><feColorMatrix type=matrix values="${e[0]} ${n[0]} 0 0 0  ${e[1]} ${n[1]} 0 0 0  ${e[2]} ${n[2]} 0 0 0  0 0 0 1 0" /></filter>`;DEFS.innerHTML+=r}return`url(#f${t})`}function q(t,e){let n=document.createElement("canvas");return n.classList.add("sprite"),n.width=n.height=t,Object.assign(n,e),[n,f(n)]}var D=t=>f(t).createPattern(t,"repeat");function C(t,e,n=1){return t.map((r,o)=>r+e[o]*n)}function lt(t,e=1){return t.map((n,r)=>n*e)}function B(t,e){return C(t,e,-1)}function Dt(t){return t.reduce((e,n)=>e+n*n,0)**.5}function st(t,e){return Dt(B(e,t))}var j=2**31,b=kt(123);function kt(t=0){0<t&&t<1&&(t=~~(t*j));let e=n=>(t=t*16807%2147483647)%n;return b=n=>n==-1?t:n==null?e(j)/j:e(n),b}function ct(t,e=b){if(!t)return null;let n=e(t.length);return t[n]}var W={bitPos:[[3,1],[2,14],[2,10],[2,13]],mountPoint:[0,0,16],size:[16,24],origin:"75% 50%",makeBits:t=>[[t.shape,t.colors],[it,t.colors],At(t.body),[at,t.colors]]},v={mountPoint:[5,0,0],bitPos:[[0,0]],size:[10,10],pickable:!0,makeBits:t=>t&&[[t.shape,t.colors]]};function A(t,e,n){let r=t.pos,o=Date.now();n??=st(t.pos,e)*10;let a=e[0]-t.pos[0];a!=0&&(t.right=a>0);let s=B(e,r);return()=>{let p=Date.now(),c=Math.min(p-o,n);t.pos=C(r,s,n?c/n:1);let S=c>=n;return t.transform=S?"":`rotateZ(${Math.sin(p/100)*5}deg)`,!S}}var Xt="scaleX(-1)";function k(t,e){let n=ut(t.pos),r=ut(e);return r==n?[()=>A(i,e)]:[()=>A(t,Z(n)),()=>A(t,Z(r),0),()=>A(t,e)]}function pt(t){return[t.size[0]*t.scale,t.size[1]*t.scale]}function h(t,e){if(!t.animation){let s=t.actionsQueue.shift();if(s){let p=s();p instanceof Function&&(t.animation=p)}}t.animation&&t.animation()==!1&&delete t.animation;let n=t.div,r=e?C(t.pos,e):t.pos,o=B(r,Yt(t));n.style.left=`${o[0]}px`,n.style.top=`${o[2]}px`,n.style.opacity=t.opacity;let a=`translateZ(${r[1]}px)`+(t.right?Xt:"")+(t.transform??"");n.style.transform=a}function Yt(t){return[pt(t)[0]/2,0,pt(t)[1]]}function Bt(t){let[e]=q(1),n=document.createElement("div");return n.classList.add("scont"),n.appendChild(e),n.style.position="absolute",e.id="s"+t.id,t.canvas=e,t.div=n,$(t),e}function At(t){return t&&[t.shape,t.colors]}function $(t){t.material&&(t.colors=d[t.material].colors),t.makeBits&&(t.bits=t.makeBits(t));let e=t.canvas,n=t.scale;if(e.width=t.size[0]*n,e.height=t.size[1]*n,e.style.transformOrigin=t.origin,f(e).imageSmoothingEnabled=!1,e.style.pointerEvents=t.noclick?"none":"all",t.bits)for(let r=0;t.bits[r];r++){let o=t.bits[r];if(!o||!o[0])continue;let a=T(M[o[0]],o[1]);f(e).drawImage(a,t.bitPos[r][0]*n,t.bitPos[r][1]*n,a.width*n,a.height*n)}}var Zt=0;function y(t){t.id??=++Zt,t.held=[];let e={canvas:Bt(t),floor:0,scale:1,actionsQueue:[],...t};return $(e),e.pos&&(P.push(e),Scene.appendChild(e.div),h(e)),e}function K(t,e,n){!e.pickable||(t.div.appendChild(e.div),t.held.unshift(e),e.owner=t,e.pos=n??lt(t.mountPoint,t.scale),h(e))}function Q(t,e){let n=t.held.shift();return n&&(n.pos=e??t.pos,Scene.appendChild(n.div),delete n.owner,h(n)),n}function ut(t){return~~(t[0]/m)+u*~~(t[2]/l-1)}function Z(t){return[(t%u+.5)*m,0,l*~~(t/u+1)]}function V(t,e){return{...v,shape:t,colors:e}}function ft(t,e){e&&(t.colors=e.colors,t.shape=e.shape,t.scale=e.scale),$(t)}function _(t){return X(t).pos}function X(t){return t.owner?X(t.owner):t}var dt="1",bt="2",ht=0;function F([t,e,n,r]){return`rgba(${t*255},${e*255},${n*255},${r})`}function Ft(t){for(let e in t){let n=F(t[e]);console.log(`%c          %c ${Number(e).toString(36)} ${n}`,`color:#00; background:${n}`,"background:#fff")}console.log(d);for(let e in d){let[n,r]=[...d[e].colors].map(o=>L[Number.parseInt(o,36)]);console.log(`%c   %c %c ${e}`,`color:#00; background:${F(n)}`,`color:#00; background:${F(r)}`,"background:#fff")}}function Rt(){for(let t in L){let e=F(L[t]),n=Number(t).toString(36);Debug.innerHTML+=`<div class=csel id="C${n}" style="background:${e}" oncontextmenu="return false;" >${n}</div>`}}function yt(){Ft(L),Rt(),M.forEach(t=>Debug.appendChild(t))}function xt(t){let[e,n,r,o]=R(t);if(r=="f"&&t.button==0&&t.shiftKey){let s=mt();s.pos=[e,n,o*l],h(s)}r=="O"&&(ht=o),r=="C"&&(t.button==0?dt=o:bt=o),Preview.innerHTML="";let a=mt();Preview.appendChild(a.canvas)}function mt(){return y({...v,pickable:!0,shape:ht,colors:dt+bt,pos:[0,0,0]})}var J=[],G={x:0,y:0},Et=400;function Gt(t,e){!t||(t.actionsQueue=e,delete t.animation)}function Nt(t){return[t[0],t[1],Math.ceil(t[2]/l)*l]}function gt(t,e){ft(x,t),x.pos=e,Scene.appendChild(x.div),h(x)}function vt(){onpointerup=t=>{J[t.button]=!1},onpointerdown=t=>{J[t.button]=!0,xt(t);let[e,n,r,o]=R(t),a=[e,n,o*l],s;if(i&&r=="f"&&!t.shiftKey&&((t.button==0||t.button==2&&!i.held.length)&&(s=k(i,a)),t.button==2&&i.held.length&&(s=[...k(i,a),()=>Q(i)])),i&&r=="s"&&!t.shiftKey){let c=P.find(S=>S.id==o);c&&c!=i&&(t.button==0&&(s=k(i,_(c))),t.button==2&&(X(c).person&&tt(X(c)),s=[...k(i,Nt(_(c))),()=>{if(i.held.length){let S=Q(i);S&&K(c,S)}else K(i,c)}]))}s&&Gt(i,s),oncontextmenu=c=>{c.shiftKey||c.preventDefault()},t.target.classList.contains("sprite")},onmousemove=t=>{if(J[1]){let p=1;G.x+=t.movementX*p,G.y+=t.movementY*p,Scene.style.left=`${G.x}px`,Scene.style.top=`${G.y}px`}let[e,n,r,o]=R(t),a=[e,n,o*l],s=i?.held[0];if(s&&(r=="f"&&gt(s,a),r=="s")){let p=P.find(c=>c.id==o);if(p){let c=C(p.pos,[0,0,-p.canvas.height]);gt(s,c),p.div.parentElement?.appendChild(x.div)}}t.preventDefault()},onwheel=t=>{Et-=t.deltaY*.2,U()}}function U(){Scene.style.transform=`translateZ(${Et}px)`}function R(t){let[e,n,r]=[t.target.id,t.offsetX,t.offsetY],o=e[0],a=e.substring(1);return[n,r,o,a]}function St(){let t="";for(let e=0;e<=u;e++)t+=`<canvas class=wall  id=w${e} style="left:${e*m}px;height:${g*l}px;width:${w}px" 
    width=${w*2} height=${g*l*2} /></canvas>`;for(let e=0;e<=g;e++)t+=`<canvas class=floor id=f${e} style="top:${e*l}px;height:${w}px;width:${u*m}px" 
    width=${u*m*2} height=${w*2}></canvas>`;Scene.innerHTML+=t;for(let e of[Back,Front])e.width=m*u*2,e.height=l*g*2,e.style.width=`${m*u}px`,e.style.height=`${l*g}px`;Front.style.transform=`translateZ(${w}px)`}function Tt(){for(let o=0;o<256;o++)H.push(Y(o,"R")),Lt.push(Y(o,"T")),M.push(Y(o,"O",1));let t=D(T(H[1],"2f")),e=f(Back);e.fillStyle=t,e.fillRect(0,0,1e4,1e4),e=f(Front),e.fillStyle=D(T(H[1],"2g"));for(let o=0;o<u;o++)e.fillRect(o*m*2-10,0,20,1e4);for(let o=0;o<g;o++)e.fillRect(0,o*l*2-10,1e4,20);let n=D(T(H[2],"gf"));document.querySelectorAll(".wall").forEach(o=>{let a=f(o);a.fillStyle=n,a.fillRect(0,0,1e4,1e4)});let r=D(T(H[3],"rq"));document.querySelectorAll(".floor").forEach(o=>{let a=f(o);a.fillStyle=r,a.fillRect(0,0,1e4,1e4)})}var w=64,g=5,u=3,l=100,m=200,E=8,Ot=g*u,L=O(N(ot)),I=new Set,H=[],Lt=[],M=[],Re,wt,It,x,nt,i,P=[];onload=()=>{img.onload=zt,img.src="16cols.gif"};function tt(t){i&&(i.noclick=!1,$(i)),i=t,i.noclick=!0,$(i),i.div.appendChild(nt.div)}function zt(){St(),Tt(),yt(),U(),vt();for(let t=0;t<Ot;t++)y({...v,shape:80,colors:"ef",pickable:!1,scale:2,pos:Z(t)});wt=y({...W,shape:18,noclick:!0,colors:"nm",person:!0,body:V(z+2,"lk"),pos:[20,10,l]}),It=y({...W,shape:26,colors:"qp",person:!0,body:V(z+1,"ba"),pos:[40,10,l]}),x=y({...v,opacity:.5,shape:1,colors:"ab",pos:[0,0,0],noclick:!0}),x.canvas.classList.add("phantom");for(let t=0;t<300;t++)y({...v,shape:80+b(18),scale:b()>.5?2:1,material:ct(Object.keys(d)),pickable:!0,pos:[b(m*u),b(w),(b(g)+1)*l]});nt=y({...v,shape:8,colors:"ab",pos:[8,0,0]}),nt.div.classList.add("pointer"),tt(wt),$t(0)}var Ct=0,et=0;function $t(t){let e=t-Ct||1;Ct=t,et=et*.9+1e3/e*.1,FPS.innerText=`FPS: ${~~et}`,P.forEach(n=>(n.actionsQueue.length||n.animation)&&h(n)),requestAnimationFrame($t),i?.held.length||(x.div.style.opacity="0")}})();
//# sourceMappingURL=bundle.js.map
