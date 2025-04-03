import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.REACT_APP_URL,
    port: 3500, // Lấy giá trị từ .env, nếu không có thì mặc định là 5173
  },
})
