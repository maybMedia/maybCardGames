import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("solitaire", "routes/solitaire.tsx"),
    route("blackjack", "routes/blackjack.tsx"),
] satisfies RouteConfig;
