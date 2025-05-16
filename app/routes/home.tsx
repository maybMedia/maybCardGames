import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the app!" },
  ];
}

export default function Home() {
  return <div>Welcome to your new app!</div>;
}
