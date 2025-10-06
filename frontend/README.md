# Lucasopoka.com React Frontend

This is the React version of the lucasopoka.com frontend, converted from vanilla JavaScript to use Vite and React.

## Features

- ✅ Modern React architecture with functional components
- ✅ React Router for client-side routing
- ✅ Preserved terminal theme and styling
- ✅ Responsive design
- ✅ Hot reload during development
- ✅ Optimized production builds

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Production

### Docker

Build and run with Docker:

```bash
# Build the image
docker build -t lucasopoka-react .

# Run the container
docker run -p 8042:8042 lucasopoka-react
```

### Docker Compose

Use the provided docker-compose file:

```bash
# From the project root
docker-compose -f docker-compose-react.yml up --build
```

## Project Structure

```
frontend-react/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx
│   │   └── Navigation.css
│   ├── views/
│   │   ├── HomeView.jsx
│   │   ├── HomeView.css
│   │   ├── ContactView.jsx
│   │   ├── ContactView.css
│   │   ├── PongView.jsx
│   │   └── PongView.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── Dockerfile
├── nginx.conf
└── README.md
```

## Migration Notes

This React version preserves all the original functionality:

- ✅ Navigation system (converted to React Router)
- ✅ Terminal theme and styling
- ✅ All visual elements and animations
- ✅ Responsive design
- ✅ Docker configuration

The Pong game is currently a placeholder and will be implemented in a future update.

## Next Steps

1. Install dependencies: `npm install`
2. Start development: `npm run dev`
3. Implement Pong game logic when ready
4. Deploy with Docker when ready for production


