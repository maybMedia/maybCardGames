import{w as u,a as f}from"./with-props-BW5-PigH.js";import{a as o,o as e,L as s,M as d,p as m,S as h,q as x,O as p,s as b}from"./chunk-D4RADZKF-B3oN04Lp.js";function j(){const[t,a]=o.useState(!1),r=o.useRef(null),[n,i]=o.useState(!1);return o.useEffect(()=>{i(!0)},[]),o.useEffect(()=>{if(!t)return;function l(c){r.current&&!r.current.contains(c.target)&&a(!1)}return document.addEventListener("mousedown",l),()=>document.removeEventListener("mousedown",l)},[t]),e.jsx("nav",{className:`
        md:fixed md:top-0 md:left-0 w-full h-16 bg-slate-800 text-white p-4 z-50
        transition-all duration-500 ease-out
        ${n?"opacity-100 translate-y-0":"opacity-0 -translate-y-8"}
      `,style:{willChange:"opacity, transform"},children:e.jsxs("div",{className:"container mx-auto flex justify-between items-center",children:[e.jsx(s,{to:"/maybCardGames/",className:"text-lg font-bold hover:animate-wiggle",viewTransition:!0,children:"maybGames"}),e.jsxs("ul",{className:"hidden sm:flex space-x-4",children:[e.jsx("li",{children:e.jsx(s,{to:"/maybCardGames/solitaire",className:`relative px-2 py-1 font-medium text-white transition-colors duration-300\r
                hover:text-blue-300\r
                after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-500 after:rounded-full\r
                hover:after:w-full after:transition-all after:duration-300\r
                hover:animate-bounce-short`,viewTransition:!0,children:"Solitaire"})}),e.jsxs("li",{children:[e.jsx(s,{to:"/maybCardGames/blackjack",className:`relative px-2 py-1 font-medium text-white transition-colors duration-300\r
                hover:text-blue-300\r
                after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-500 after:rounded-full\r
                hover:after:w-full after:transition-all after:duration-300\r
                hover:animate-bounce-short`,viewTransition:!0,children:"Blackjack"}),e.jsx(s,{to:"/maybCardGames/naughtsAndCrosses",className:`relative px-2 py-1 font-medium text-white transition-colors duration-300\r
                hover:text-blue-300\r
                after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-0 after:h-0.5 after:bg-blue-500 after:rounded-full\r
                hover:after:w-full after:transition-all after:duration-300\r
                hover:animate-bounce-short`,viewTransition:!0,children:"O's & X's"})]})]}),e.jsxs("div",{className:"sm:hidden relative",ref:r,children:[e.jsxs("button",{className:"flex flex-col justify-center items-center w-8 h-8 relative",onClick:()=>a(l=>!l),"aria-label":"Toggle menu",children:[e.jsx("span",{className:`
                block w-6 h-0.5 bg-white mb-1 transition-all duration-300
                absolute
                ${t?"rotate-45 top-3.5":"rotate-0 top-2"}
              `,style:{left:4}}),e.jsx("span",{className:`
                block w-6 h-0.5 bg-white mb-1 transition-all duration-300
                absolute
                ${t?"opacity-0":"opacity-100 top-3.5"}
              `,style:{left:4}}),e.jsx("span",{className:`
                block w-6 h-0.5 bg-white transition-all duration-300
                absolute
                ${t?"-rotate-45 top-3.5":"rotate-0 top-5"}
              `,style:{left:4}})]}),e.jsx("div",{className:`
              absolute right-0 mt-2 w-40 rounded shadow-lg z-50
              transition-all duration-300 overflow-hidden
              bg-slate-800
              ${t?"max-h-40 opacity-100":"max-h-0 opacity-0 pointer-events-none"}
            `,children:e.jsxs("ul",{className:"flex flex-col",children:[e.jsx("li",{children:e.jsx(s,{to:"/maybCardGames/solitaire",className:"block px-4 py-2 hover:bg-slate-700",viewTransition:!0,onClick:()=>a(!1),children:"Solitaire"})}),e.jsx("li",{children:e.jsx(s,{to:"/maybCardGames/blackjack",className:"block px-4 py-2 hover:bg-slate-700",viewTransition:!0,onClick:()=>a(!1),children:"Blackjack"})})]})})]})]})})}const v=()=>[{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"},{rel:"icon",type:"image/png",href:"/maybCardGames/favicon.ico"}];function g({children:t}){return e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(d,{}),e.jsx(m,{})]}),e.jsxs("body",{children:[e.jsx(j,{}),t,e.jsx(h,{}),e.jsx(x,{})]})]})}const k=u(function(){return e.jsx(p,{})}),N=f(function({error:a}){let r="Oops!",n="An unexpected error occurred.",i;return b(a)&&(r=a.status===404?"404":"Error",n=a.status===404?"The requested page could not be found.":a.statusText||n),e.jsxs("main",{className:"pt-16 p-4 container mx-auto",children:[e.jsx("h1",{children:r}),e.jsx("p",{children:n}),i]})});export{N as ErrorBoundary,g as Layout,k as default,v as links};
