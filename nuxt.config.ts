// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line import/no-extraneous-dependencies
import { NuxtConfig } from "nuxt/config";
import vueI18n from "./i18n.config";

const modules: NuxtConfig["modules"] = [
  ["nuxt-typed-router", { strict: true }],
  "@nuxt/devtools",
  // Use TS-path as workaround (See https://github.com/nuxt/nuxt/issues/20912)
  "~/modules/figma2tailwind/index.ts", // Must be placed before "@nuxtjs/tailwindcss"
  "~/modules/icons/module.ts",
  "@nuxtjs/tailwindcss",
  "@nuxtjs/i18n",
  "@nuxtjs/color-mode",
  "nuxt-vitest",
  ["@pinia/nuxt", { autoImports: ["defineStore"] }],
  "@vueuse/nuxt",
];

if (process.env.ELECTRON) modules.push("nuxt-electron");

export default defineNuxtConfig({
  modules,
  runtimeConfig: {
    public: {
      apiUrl: "https://bmm-api.brunstad.org",
      authUrl: "https://login.bcc.no",
      clientId: "L9891KdcqtoKmHg4r65lT7zbSjv55dNN",
      applicationInsights: "",
    },
  },
  spaLoadingTemplate: "spa-loading-template.html",
  i18n: {
    strategy: "no_prefix",
    skipSettingLocaleOnNavigate: true,
    defaultLocale: "en",
    // Due to a bug in @nuxtjs/i18n@8.0.0-beta.11 we have to use beta.10 with inline configuration. See: https://github.com/nuxt-modules/i18n/issues/1990
    // Due to Electron not supporting ESM, we cannot switch to beta.13.
    vueI18n,
  },
  imports: {
    dirs: ["stores"],
  },
  // TODO: Remove after https://github.com/nuxt-modules/i18n/issues/2000 is fixed
  ssr: false,
  vite: {
    // https://stackoverflow.com/a/75655669/517914
    optimizeDeps: { exclude: ["fsevents"] },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: { base: { href: "/" } },
  },
  router: {
    options: {
      // Setting app.head.base changes the default for "hashMode" to "true" ...
      hashMode: false,
    },
  },
  colorMode: {
    classSuffix: "",
  },
  // TODO: Option is marked as invalid if env ELECTRON is not enabled, because this enables the module which allows the configuration.
  electron: {
    build: [
      {
        entry: "electron/main.ts",
      },
      {
        entry: "electron/preload.ts",
      },
    ],
  },
});
