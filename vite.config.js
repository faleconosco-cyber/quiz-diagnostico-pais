import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base relativo: o mesmo build serve na raiz (quiz.institutorumo.com) e
  // na subpasta do GitHub Pages (/quiz-diagnostico-pais/), sem duplicar config.
  base: './',
})
