(()=>{function Y(t){return[...t.matchAll(/(\w\w)(\w\w)(\w\w)/g)].map(e=>e.slice(1,4).map(n=>Math.round(Number.parseInt(n,16)/255*35).toString(36)).join("")).join("")}function R(t){return[...t.matchAll(/(\w)(\w)(\w)/g)].map(e=>[...e.slice(1,4).map(n=>~~(Number.parseInt(n,36)/36*100)/100),1])}var O=`43002a
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
601761`;function b(t,e){let n=t.cloneNode();return f(n).filter=ut(e),f(n).drawImage(t,0,0),n}function T(t,e,n=0){let[r,o]=A(u+n*2);return r.id=e+t,o.filter=`url(#_${e})`,o.drawImage(img,t%u*u,~~(t/u)*u,u,u,n,n,u,u),r}function f(t){return t.getContext("2d")}function ut(t){if(!F.has(t)){F.add(t);let[e,n]=[...t].map(o=>h[Number.parseInt(o,36)]),r=`<filter id=f${t}><feColorMatrix type=matrix values="${e[0]} ${n[0]} 0 0 0  ${e[1]} ${n[1]} 0 0 0  ${e[2]} ${n[2]} 0 0 0  0 0 0 1 0" /></filter>`;DEFS.innerHTML+=r}return`url(#f${t})`}function A(t,e){let n=document.createElement("canvas");return n.classList.add("sprite"),n.width=n.height=t,Object.assign(n,e),[n,f(n)]}var M=t=>f(t).createPattern(t,"repeat");function q(t,e){return t.toString(36)+e.toString(36)}var H=(t,e,n=1)=>t.map((r,o)=>r+e[o]*n),B=(t,e)=>H(t,e,-1),dt=t=>t.reduce((e,n)=>e+n*n,0)**.5,Q=(t,e)=>dt(B(e,t));function C(t,e,n){let r=t.pos,o=Date.now();n??=Q(t.pos,e)*10;let i=e[0]-t.pos[0];i!=0&&(t.right=i>0);let s=B(e,r);return()=>{let X=Date.now(),m=Math.min(X-o,n);t.pos=H(r,s,n?m/n:1);let S=m>=n;return t.transform=S?"":`rotateZ(${Math.sin(X/100)*5}deg)`,!S}}var U={bitPos:[[11,0],[10,14],[11,10],[10,13],[3,6]],size:[20,24],origin:"50% 200%",makeBits:t=>[[t.shape,t.colors],[yt,t.colors],W(t.body),[ht,t.colors],W(t.hand)]},$={bitPos:[[0,0]],size:[10,10],makeBits:t=>[[t.shape,t.colors]]},bt="scaleX(-1)";function w(t,e,n){let r=D(a.pos),o=D(e);return o==r?[()=>C(a,e)]:[()=>C(a,j(r)),()=>C(a,j(o),0),()=>C(a,e)]}function L(t,e){if(!t.animation){let s=t.actionsQueue.shift();s&&(t.animation=s())}t.animation&&t.animation()==!1&&delete t.animation;let n=t.canvas,r=Date.now(),o=e?H(t.pos,e):t.pos;n.style.left=`${o[0]-t.size[0]/2}px`,n.style.top=`${o[2]-t.size[1]}px`;let i=`translateZ(${o[1]}px)`+(t.right?bt:"")+`scale(${t.scale})`+(t.transform??"");return n.style.transform=i,n}function xt(t){let[e]=A(1);return e.style.position="absolute",e.id="s"+t.id,t.canvas=e,P(t),e}var yt=32,ht=48;function W(t){return t&&[t.shape,t.colors]}function P(t){t.makeBits&&(t.bits=t.makeBits(t));let e=t.canvas;if(e.width=t.size[0],e.height=t.size[1],e.style.transformOrigin=t.origin,t.bits)for(let n=0;t.bits[n];n++){let r=t.bits[n];r&&f(t.canvas).drawImage(b(E[r[0]],r[1]),...t.bitPos[n])}}var gt=0;function g(t){t.id??=++gt;let e={canvas:xt(t),floor:0,scale:1,actionsQueue:[],...t};return P(e),e.pos&&(x.push(e),Scene.appendChild(e.canvas),L(e)),e}function Et(t){x.splice(x.indexOf(t),1),t.canvas.parentElement?.removeChild(t.canvas)}function _(t){a.hand=t,P(a),Et(t)}function Z(t){t.hand&&(g({...t.hand,pos:t.pos}),delete t.hand,P(t))}function D(t){return~~(t[0]/p)+c*~~(t[2]/l-1)}function j(t){return[(t%c+.5)*p,0,l*~~(t/c+1)]}function V(t,e){return{...$,shape:t,colors:e}}var K="1",tt="2",et=0;function nt([t,e,n,r]){return`rgba(${t*255},${e*255},${n*255},${r})`}function vt(t){for(let e in t){let n=nt(t[e]);console.log(`%c          %c ${Number(e).toString(36)} ${n}`,`color:#00; background:${n}`,"background:#fff")}}function Mt(){for(let t in h){let e=nt(h[t]),n=Number(t).toString(36);Debug.innerHTML+=`<div class=csel id="C${n}" style="background:${e}" oncontextmenu="return false;" >${n}</div>`}}function ot(){vt(h),Mt(),E.forEach(t=>Debug.appendChild(t))}function rt(t){if(t.type!="mousedown")return;let[e,n,r,o]=I(t);if(r=="f"&&t.button==0&&t.shiftKey){let s=J();s.pos=[e,n,o*l],L(s)}r=="O"&&(et=o),r=="C"&&(t.button==0?K=o:tt=o),Preview.innerHTML="";let i=J();Preview.appendChild(i.canvas)}function J(){return g({...$,bits:[[et,K+tt]]})}var N=[],k={x:0,y:0},at=400;function $t(t,e){!t||(t.actionsQueue=e,delete t.animation)}function it(){onpointerup=t=>{N[t.button]=!1},onpointerdown=t=>{N[t.button]=!0,rt(t);let[e,n,r,o]=I(t),i=[e,n,o*l];console.log(D(i));let s;if(a&&r=="f"&&!t.shiftKey&&(t.button==0&&(s=w(a,i)),t.button==2&&(s=[...w(a,i),()=>Z(a)])),a&&r=="s"&&!t.shiftKey){let m=x.find(S=>S.id==o);m&&m!=a&&(t.button==0&&(s=w(a,m.pos)),t.button==2&&(s=[...w(a,m.pos),()=>{Z(a),_(m)}]))}s&&$t(a,s),oncontextmenu=m=>{m.shiftKey||m.preventDefault()},t.target.classList.contains("sprite")},onmousemove=t=>{if(N[1]){let e=1;k.x+=t.movementX*e,k.y+=t.movementY*e,Scene.style.left=`${k.x}px`,Scene.style.top=`${k.y}px`}t.preventDefault()},onwheel=t=>{at-=t.deltaY*.2,z()}}function z(){Scene.style.transform=`translateZ(${at}px)`}function I(t){let[e,n,r]=[t.target.id,t.offsetX,t.offsetY],o=e[0],i=e.substring(1);return[n,r,o,i]}function lt(){let t="";for(let e=0;e<=c;e++)t+=`<canvas class=wall  id=w${e} style="left:${e*p}px;height:${d*l}px;width:${y}px" 
    width=${y*2} height=${d*l*2} /></canvas>`;for(let e=0;e<=d;e++)t+=`<canvas class=floor id=f${e} style="top:${e*l}px;height:${y}px;width:${c*p}px" 
    width=${c*p*2} height=${y*2}></canvas>`;Scene.innerHTML+=t;for(let e of[Back,Front])e.width=p*c*2,e.height=l*d*2,e.style.width=`${p*c}px`,e.style.height=`${l*d}px`;Front.style.transform=`translateZ(${y}px)`}function st(){for(let o=0;o<128;o++)v.push(T(o,"R")),ct.push(T(o,"T")),E.push(T(o,"O",1));let t=M(b(v[1],"2f")),e=f(Back);e.fillStyle=t,e.fillRect(0,0,1e4,1e4),e=f(Front),e.fillStyle=M(b(v[1],"2g"));for(let o=0;o<c;o++)e.fillRect(o*p*2-10,0,20,1e4);for(let o=0;o<d;o++)e.fillRect(0,o*l*2-10,1e4,20);let n=M(b(v[2],"gf"));document.querySelectorAll(".wall").forEach(o=>{let i=f(o);i.fillStyle=n,i.fillRect(0,0,1e4,1e4)});let r=M(b(v[3],"rq"));document.querySelectorAll(".floor").forEach(o=>{let i=f(o);i.fillStyle=r,i.fillRect(0,0,1e4,1e4)})}var y=64,d=5,c=3,l=100,p=200,u=8,ue=d*c,h=R(Y(O)),F=new Set,v=[],ct=[],E=[],de,mt,be,a,x=[];onload=()=>{img.onload=wt,img.src="sprites1bit.gif"};function wt(){lt(),st(),ot(),z(),it(),mt=g({...U,shape:18,colors:"nm",body:V(43,"lk"),pos:[20,10,l],right:!1}),a=mt;for(let t=0;t<300;t++)g({...$,shape:80+~~(Math.random()*14),colors:q(~~(Math.random()*32),~~(Math.random()*32)),pos:[Math.random()*p*c,Math.random()*y,~~(Math.random()*d+1)*l],scale:1})}var ft=0,G=0;function pt(t){let e=t-ft||1;ft=t,G=G*.9+1e3/e*.1,FPS.innerText=`FPS: ${~~G}`,x.forEach(n=>(n.actionsQueue.length||n.animation)&&L(n)),requestAnimationFrame(pt)}pt(0);})();
//# sourceMappingURL=bundle.js.map
