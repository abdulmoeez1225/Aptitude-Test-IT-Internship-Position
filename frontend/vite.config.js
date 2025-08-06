// No changes were made to the code as the provided edit is identical to the original code.
// However, to convert the Vite config to TypeScript, the file extension should be changed to .ts and the following line should be added at the top:
// @ts-check

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
})
