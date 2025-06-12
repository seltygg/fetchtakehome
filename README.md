# Fetch Take Home

A modern React + TypeScript app to help dog-lovers search, filter, and match with shelter dogs!

## Features
- Secure login (with session cookie)
- Browse, filter, and sort available dogs
- Paginated results with advanced, Amazon-style pagination UX
- Favorite dogs and find your match
- Favorites pagination (with URL sync)
- Responsive, mobile-friendly UI
- Quick dog details popup on hover (like Amazon quick view)
- Persistent favorites (per device)
- Robust error handling and session management

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm

### Run Locally
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd fetch-dogs
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment
- No environment variables are required. The app connects to the Fetch API at `https://frontend-take-home-service.fetch.com`.

## Live Project

You can view the live project here:

👉 [https://takehomesankalp.netlify.app](https://takehomesankalp.netlify.app)

## Project Structure
```
src/
  api/           # API helpers
  components/    # Reusable UI components
  context/       # React context (auth)
  pages/         # Page components (Login, Search)
  types.ts       # TypeScript types
  App.tsx        # App entry
  main.tsx       # Main render
```

## Usage Notes
- The app uses session cookies for authentication. For best results, use a regular browser window (not incognito) and ensure third-party cookies are enabled.
- Favorites are persisted per device/browser. For true multi-user isolation, server-side storage is recommended.
- If you encounter network/auth errors, check your browser console and ensure CORS/cookies are supported by your deployment platform (Vercel/Netlify both work).

## License
MIT
