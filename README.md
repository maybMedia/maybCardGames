# mayb Games

mayb Games is a modern web app that lets you play classic games like Blackjack, Solitaire, O's & X's (Tic-Tac-Toe), and Snake right in your browser. Built with React, React Router, and Tailwind CSS, it features a sleek UI, smooth animations, and responsive design for desktop and mobile.

## Features

- **Card Games**
  - **Solitaire**: A single-player strategy card game with simple, modern graphics.
  - **Blackjack**: Play against a dealer with animated card draws and win/loss detection.
- **Single Player Games**
  - **O's & X's**: Classic Tic-Tac-Toe for one player.
  - **Snake**: The classic snake game.
  - **Solitaire**
  - **Blackjack**
- **Two Player Games**
  - **O's & X's**: Classic Tic-Tac-Toe for two players.
- **Responsive Design**: Optimized for all devices, with improved mobile UI (smaller cards, scrollable board, touch-friendly controls).
- **Animated UI**: Smooth card draw, stack movement, and modal transitions for an engaging experience.
- **Modern Navigation**: Categorized dropdown navigation for desktop and mobile, with animated transitions.

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

#### Deploying to GitHub Pages

To support client-side routing (so subroutes like `/maybCardGames/blackjack` work), the build process copies `index.html` to `404.html` in the build output.  
**Make sure your deploy script includes:**

```sh
# For Unix/macOS
cp build/client/index.html build/client/404.html

# For Windows
copy build\client\index.html build\client\404.html
```

Or use a cross-platform tool like `cpx`.

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
