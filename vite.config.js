import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        contact: resolve(__dirname, "contact.html"),
        project1: resolve(__dirname, "projects/project-1.html"),
        project2: resolve(__dirname, "projects/project-2.html"),
        project3: resolve(__dirname, "projects/project-3.html"),
        project4: resolve(__dirname, "projects/project-4.html"),
        project5: resolve(__dirname, "projects/project-5.html"),
        project6: resolve(__dirname, "projects/project-6.html"),
      },
    },
    assetsInclude: ["**/*.jpeg", "**/*.jpg", "**/*.png", "**/*.svg", "**/*.gif", "**/*.pdf"],
    copyPublicDir: true,
  },
});
