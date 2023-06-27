import path from "path";
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "NFT Transfer System",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["@/plugins/web3.js", "@/plugins/web3-provider.js"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    { path: "~/components", extensions: ["vue"] },
    { path: "~/components/layouts", extensions: ["vue"] },
    { path: "~/components/nftTransfer", extensions: ["vue"] },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    "bootstrap-vue/nuxt",
    "@nuxtjs/toast",
  ],
  toast: {
    position: "top-right",
    duration: 10000,
    keepOnHover: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      // Add rule for WalletConnect package
      config.module.rules.push({
        test: /\.m?js$/,
        include: [path.resolve(__dirname, "node_modules/@walletconnect")],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      });
    },
  },

  publicRuntimeConfig: {
    rootPageUrl: process.env.NUXT_ROOT_PAGE_URL || "https://tool.t2web.co.jp",
    nftSystemAddress:
      process.env.NUXT_ENV_NFT_SYSTEM_ADDRESS ||
      "0x0e79b465A519fF3D70222686745CB1Db58c95Dd0",
  },
};
