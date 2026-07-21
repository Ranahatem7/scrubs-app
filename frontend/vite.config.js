import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Lets the app call same-origin "/api/..." in dev and have Vite forward
    // it to Express, sidestepping CORS. VITE_API_URL still points at the
    // backend directly by default — set it to "/api" to route through this.
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
})
