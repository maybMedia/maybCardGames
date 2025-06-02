import{w as b,a as x}from"./with-props-BW5-PigH.js";import{a as r,o as e,L as m,M as f,p as y,S as j,q as g,O as w,s as v}from"./chunk-D4RADZKF-B3oN04Lp.js";const u=[{label:"Card Games",games:[{label:"Solitaire",to:"/maybCardGames/solitaire"},{label:"Blackjack",to:"/maybCardGames/blackjack"}]},{label:"Single Player Games",games:[{label:"O's & X's",to:"/maybCardGames/naughtsAndCrosses"},{label:"Snake",to:"/maybCardGames/snake"},{label:"Solitaire",to:"/maybCardGames/solitaire"},{label:"Blackjack",to:"/maybCardGames/blackjack"}]},{label:"Two Player Games",games:[{label:"O's & X's",to:"/maybCardGames/naughtsAndCrosses"}]}];function p(s){return[...s].sort((l,n)=>l.label.localeCompare(n.label))}function k(){const[s,l]=r.useState(!1),n=r.useRef(null),[i,c]=r.useState(!1),[d,o]=r.useState(null);r.useEffect(()=>{c(!0)},[]),r.useEffect(()=>{if(!s)return;function a(t){n.current&&!n.current.contains(t.target)&&(l(!1),o(null))}return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[s]);function h(a){window.innerWidth<640&&o(t=>t===a?null:a)}return e.jsx("nav",{className:`
        fixed top-0 left-0 w-full h-16 bg-slate-800 text-white p-4 z-50
        transition-all duration-500 ease-out
        ${i?"opacity-100 translate-y-0":"opacity-0 -translate-y-8"}
      `,style:{willChange:"opacity, transform"},children:e.jsxs("div",{className:"container mx-auto flex justify-between items-center",children:[e.jsx(m,{to:"/maybCardGames/",className:"text-lg font-bold hover:animate-wiggle",viewTransition:!0,children:"maybGames"}),e.jsx("ul",{className:"hidden sm:flex space-x-6",children:u.map(a=>e.jsxs("li",{className:"relative",onMouseEnter:()=>o(a.label),children:[e.jsx("button",{className:"px-2 py-1 font-semibold hover:text-blue-300 transition-colors",tabIndex:0,"aria-haspopup":"true","aria-expanded":d===a.label,children:a.label}),e.jsx("div",{className:`
                  absolute left-0 mt-2 w-40 rounded shadow-lg z-50
                  bg-slate-800 transition-all duration-200
                  ${d===a.label?"opacity-100 pointer-events-auto":"opacity-0 pointer-events-none"}
                `,onMouseEnter:()=>o(a.label),onMouseLeave:()=>o(null),children:e.jsx("ul",{className:"flex flex-col",children:p(a.games).map(t=>e.jsx("li",{children:e.jsx(m,{to:t.to,className:"block px-4 py-2 hover:bg-slate-700",viewTransition:!0,onClick:()=>o(null),children:t.label})},t.label))})})]},a.label))}),e.jsxs("div",{className:"sm:hidden relative",ref:n,children:[e.jsxs("button",{className:"flex flex-col justify-center items-center w-8 h-8 relative",onClick:()=>{l(a=>!a),o(null)},"aria-label":"Toggle menu",children:[e.jsx("span",{className:`
                block w-6 h-0.5 bg-white mb-1 transition-all duration-300
                absolute
                ${s?"rotate-45 top-3.5":"rotate-0 top-2"}
              `,style:{left:4}}),e.jsx("span",{className:`
                block w-6 h-0.5 bg-white mb-1 transition-all duration-300
                absolute
                ${s?"opacity-0":"opacity-100 top-3.5"}
              `,style:{left:4}}),e.jsx("span",{className:`
                block w-6 h-0.5 bg-white transition-all duration-300
                absolute
                ${s?"-rotate-45 top-3.5":"rotate-0 top-5"}
              `,style:{left:4}})]}),e.jsx("div",{className:`
              absolute right-0 mt-2 w-48 rounded shadow-lg z-50
              transition-all duration-300 overflow-hidden
              bg-slate-800
              ${s?"max-h-96 opacity-100":"max-h-0 opacity-0 pointer-events-none"}
            `,children:e.jsx("ul",{className:"flex flex-col",children:u.map(a=>e.jsxs("li",{className:"border-b border-slate-700 last:border-0",children:[e.jsx("button",{className:"w-full text-left px-4 py-2 font-semibold hover:bg-slate-700",onClick:()=>h(a.label),children:a.label}),e.jsx("div",{className:`
                      transition-all duration-200
                      ${d===a.label?"max-h-40 opacity-100":"max-h-0 opacity-0 overflow-hidden"}
                    `,children:e.jsx("ul",{children:p(a.games).map(t=>e.jsx("li",{children:e.jsx(m,{to:t.to,className:"block px-6 py-2 text-sm hover:bg-slate-700",viewTransition:!0,onClick:()=>{l(!1),o(null)},children:t.label})},t.label))})})]},a.label))})})]})]})})}const E=()=>[{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"},{rel:"icon",type:"image/png",href:"/maybCardGames/favicon.ico"}];function G({children:s}){return e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(f,{}),e.jsx(y,{})]}),e.jsxs("body",{className:"min-h-screen flex flex-col",children:[e.jsx(k,{}),e.jsx("div",{className:"main-scroll-area flex-1 overflow-y-auto pt-16",children:s}),e.jsx(j,{}),e.jsx(g,{})]})]})}const S=b(function(){return e.jsx(w,{})}),O=x(function({error:l}){let n="Oops!",i="An unexpected error occurred.",c;return v(l)&&(n=l.status===404?"404":"Error",i=l.status===404?"The requested page could not be found.":l.statusText||i),e.jsxs("main",{className:"pt-4 p-4 container mx-auto",children:[e.jsx("h1",{children:n}),e.jsx("p",{children:i}),c]})});export{O as ErrorBoundary,G as Layout,S as default,E as links};
