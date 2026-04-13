import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const figmaAssetPlugin = () => {
  return {
    name: 'figma-asset-plugin',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        return '\0' + id
      }
    },
    load(id: string) {
      if (id.startsWith('\0figma:asset/')) {
        return `export default "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"`
      }
    }
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    figmaAssetPlugin()
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    port: 5173,
  },
})
