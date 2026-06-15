import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// Static multi-page site. Each HTML file is its own entry so the
// clean-URL directory structure (/services/, /web-design-vaughan/, ...)
// is preserved in the build output (dist/).
export default defineConfig({
  appType: 'mpa',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: r('./index.html'),
        notFound: r('./404.html'),
        services: r('./services/index.html'),
        portfolio: r('./portfolio/index.html'),
        about: r('./about/index.html'),
        contact: r('./contact/index.html'),
        wdVaughan: r('./web-design-vaughan/index.html'),
        wdWoodbridge: r('./web-design-woodbridge/index.html'),
        wdMaple: r('./web-design-maple/index.html'),
        wdThornhill: r('./web-design-thornhill/index.html'),
        wdRichmondHill: r('./web-design-richmond-hill/index.html'),
        wdMarkham: r('./web-design-markham/index.html'),
      },
    },
  },
});
