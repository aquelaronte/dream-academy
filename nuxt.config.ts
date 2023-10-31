import { resolve } from "path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  srcDir: resolve("./src"),
  serverDir: resolve('./server'),
  modules: ["@pinia/nuxt", "vuetify-nuxt-module"],
  app: {
    head: {
      link: [
        {
          rel: "icon",
          href: "/favicon.png?url",
        },
      ],
      title: "Dream Academy",
    },
  },
});
