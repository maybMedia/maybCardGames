import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
    route("maybCardGames", "routes/home.tsx"),
    route("maybCardGames/solitaire", "routes/solitaire.tsx"),
    route("maybCardGames/blackjack", "routes/blackjack.tsx"),
    route("maybCardGames/naughtsAndCrosses", "routes/naughtsAndCrosses.tsx"),
    route("maybCardGames/snake", "routes/snake.tsx"),
] satisfies RouteConfig;
