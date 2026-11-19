import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [tailwindcss(), reactRouter()],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      host: '0.0.0.0',
      port: 3100,
      allowedHosts: true,
      proxy: {
        '/api': env.API
      },
      watch: {
        ignored: [
          '**/*.db',
          '**/*.db-shm',
          '**/*.db-wal',
        ]
      }
    },
  }
})
// export default defineConfig({
//   plugins: [tailwindcss(), reactRouter()],
//   resolve: {
//     tsconfigPaths: true,
//   },
//   server: {
//     host: '0.0.0.0',
//     port: 3100,
//     allowedHosts: true,
//     proxy: {
//       '/api': API
//     },
//     watch: {
//       ignored: [
//         '**/*.db',
//         '**/*.db-shm',
//         '**/*.db-wal',
//       ]
//     }
//   },
// });
