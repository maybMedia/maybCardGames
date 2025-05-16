# mayb Card Games

mayb Card Games is a modern web app that lets you play classic card games like Blackjack and Solitaire right in your browser. Built with React, React Router, and Tailwind CSS, it features a sleek UI, smooth card animations, and responsive design for desktop and mobile.

## Features

- **Blackjack**: Play against a dealer with animated card draws and win/loss detection.
- **Solitaire**: (Coming soon) Enjoy a single-player strategy card game.
- **Responsive Design**: Looks great on all devices.
- **Animated UI**: Smooth card draw and bust animations for an engaging experience.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd maybCardGames
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open your browser and visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

### Build for Production

To build the app for production:

```sh
npm run build
```

The output will be in the `build/` directory.

### Run in Docker

You can also run the app in a Docker container:

```sh
docker build -t maybcardgames .
docker run -p 3000:3000 maybcardgames
```

## Project Structure

- `app/` – Main application code (components, routes, styles)
- `public/` – Static assets (images, favicon)
- `build/` – Production build output
- `.react-router/` – React Router generated files

## Technologies Used

- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

## License

MIT

---

Enjoy playing cards!