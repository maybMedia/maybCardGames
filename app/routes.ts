import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
    route("maybCardGames", "routes/home.tsx"),
    route("maybCardGames/solitaire", "routes/solitaire.tsx"),
    route("maybCardGames/blackjack", "routes/blackjack.tsx"),
] satisfies RouteConfig;
