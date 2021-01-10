/* eslint-disable */
const path = require("path");
const config = require("./config/index.json");
const isPro = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
// const PrerenderSPAPlugin = require('prerender-spa-plugin')
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer // 内核依赖过大，需要时在添加依赖
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const HtmlIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const HappyPack = require("happypack");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length,
});
const merge = require("webpack-merge");
const tsImportPluginFactory = require("ts-import-plugin");

const {
  openHappyPack,
  openAnalyzer,
  openPrerender,
  openImgMini,
} = config.optimizes;

module.exports = {
  publicPath: config.baseUrl,
  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_BASE_URL,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "",
        },
      },
      "/qiniu": {
        target: "http://fusion.qiniuapi.com",
        changeOrigin: true,
        pathRewrite: {
          "^/qiniu": "",
        },
      },
    },
    disableHostCheck: true
  },
  css: {
    // https://github.com/vuejs/vue-cli/blob/dev/docs/zh/guide/css.md#css-modules
    // 启用 CSS modules
    requireModuleExtension: true,
    // 是否使用css分离插件
    extract: true,
    // 开启 CSS source maps
    sourceMap: !isPro,
    // css预设器配置项
    loaderOptions: {
      sass: {
        // @/ is an alias to src/
        data: `@import "@/styles/settings/index.scss";`,
      },
    },
  },
  // Babel 显式转译 && Type: Array<string | RegExp> && Default: []
  transpileDependencies: ["vuex-module-decorators"],
  // parallel: require("os").cpus().length > 1,
  parallel: false,
  productionSourceMap: !isPro,
  chainWebpack: config => {
    config.plugins.delete('prefetch')
    if (!isDev) {
      openAnalyzer &&
        config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin)
        .end();
      openImgMini &&
        config.module
        .rule("images")
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use("img-loader")
        .loader("img-loader")
        .options({
          plugins: [
            require("imagemin-jpegtran")() /*  */ ,
            require("imagemin-pngquant")({
              quality: [0.75, 0.85],
            }),
          ],
        });
    }
    if (openHappyPack) {
      const jsRule = config.module.rule("js");
      jsRule.uses.clear().end();
      jsRule
        .use("happypack/loader?id=babel")
        .loader("happypack/loader?id=babel")
        .end();
      jsRule.exclude.clear().add(/node_modules/);
    }
    config.optimization.minimizer("terser").tap(args => {
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });
    config.module
      .rule("ts")
      .use("ts-loader")
      .tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "vant",
                libraryDirectory: "es",
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: "es2015"
          }
        });
        return options;
      });
  },
  configureWebpack: config => {
    const myConfig = {
      resolve: {
        alias: {
          vue$: "vue/dist/vue.esm.js", // 'vue/dist/vue.common.js' for webpack 1
        },
      },
      plugins: [
        openHappyPack ?
        new HappyPack({
          id: "babel", // 上面loader?后面指定的id
          loaders: ["babel-loader?cacheDirectory"],
          threadPool: happyThreadPool,
          verbose: true,
        }) :
        () => {},
      ],
    };
    config.optimization.minimizer[0].options.terserOptions.keep_fnames = true;
    if (!isDev) {
      openPrerender &&
        myConfig.plugins.push(
          new PrerenderSPAPlugin({
            // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
            staticDir: path.join(__dirname, "dist"),
            // 路由表
            routes: config.prerender.routeList,
            renderer: new Renderer({
              inject: {
                foo: "bar",
              },
              headless: false,
              // renderAfterTime: 5000,
              // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
              renderAfterDocumentEvent: "render-event",
            }),
          }),
        );
    } else {
      myConfig.devtool = "cheap-source-map"; // 在生成环境中建议使用 "eval"
    }
    return myConfig;
  },
};