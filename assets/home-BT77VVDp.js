import{w as i}from"./with-props-BW5-PigH.js";import{t as l,o as e}from"./chunk-D4RADZKF-B3oN04Lp.js";const a=({name:t,description:s,imageUrl:r,navigateTo:n})=>{const o=l();return e.jsxs("div",{className:"border-2 border-gray-500 rounded-3xl p-4 m-2 w-full max-w-xs flex flex-col items-center justify-center text-gray-800 bg-gray-100 hover:bg-gray-200 hover:scale-105 transition duration-300 ease-in-out sm:max-w-sm min-h-64",children:[e.jsx("img",{src:r,alt:t,className:"w-24 h-24 object-contain mb-2"}),e.jsx("h2",{className:"text-lg font-bold text-center",children:t}),e.jsx("p",{className:"text-center text-sm flex-1",children:s}),e.jsx("button",{className:"mt-4 bg-blue-500 text-white rounded-full px-4 py-2 w-full hover:bg-blue-600 transition duration-300 ease-in-out",onClick:()=>o(n,{viewTransition:!0}),children:"Play"})]})};function d({}){return[{title:"maybGames"},{name:"description",content:"Welcome to the app!"}]}const g=i(function(){return e.jsxs("div",{className:"flex flex-col items-center min-h-full pt-6 pb-8 px-4",children:[e.jsx("h1",{className:"text-2xl font-bold",children:"Select your game!"}),e.jsxs("div",{className:`\r
          grid\r
          grid-cols-1\r
          sm:grid-cols-2\r
          lg:grid-cols-3\r
          gap-4\r
          justify-items-center\r
          w-full\r
          max-w-3xl\r
          mt-4\r
        `,children:[e.jsx(a,{name:"Solitaire",description:"A strategy card game played by one player",imageUrl:"./solitaire.png",navigateTo:"/maybCardGames/solitaire"}),e.jsx(a,{name:"Blackjack",description:"A game where you aim to get as close to 21 as possible",imageUrl:"./blackjack.png",navigateTo:"/maybCardGames/blackjack"}),e.jsx(a,{name:"Naughts and Crosses",description:"Play with a friend or against the computer, try to get three in a row!",imageUrl:"./naughtsAndCrosses.png",navigateTo:"/maybCardGames/naughtsAndCrosses"}),e.jsx(a,{name:"Snake",description:"A classic game where you control a snake to eat food and grow",imageUrl:"./snake.png",navigateTo:"/maybCardGames/snake"})]})]})});export{g as default,d as meta};
