const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

// 读取 version.json  中的版本号
const versionJsonPath = path.resolve(__dirname, "public/version.json");
const versionInfo = JSON.parse(fs.readFileSync(versionJsonPath, "utf8"));
const versionSuffix = versionInfo.version;

const projectName = process.env.VUE_APP_PROJECT_NAME;

module.exports = {
  devServer: {
    port: 8060,
    host: "0.0.0.0",
    open: true,
    hot: true, // 启用热更新
    clientLogLevel: "none", // 禁用浏览器控制台的HMR日志
    quiet: true, // 静默Webpack编译输出（关键设置）
    noInfo: true, // 隐藏打包信息
    overlay: false, // 禁用全屏错误覆盖（可选）
    stats: "none", // 完全禁用统计信息
    progress: false // 禁用进度条
  },
  lintOnSave: false,
  publicPath: process.env.VUE_APP_NODE_PATH || "/",
  outputDir: versionSuffix + "/" + projectName,
  productionSourceMap: false,
  crossorigin: "anonymous",

  // 全局SCSS变量注入
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        path.resolve(__dirname, "src/assets/hdtyui/css/animates/animate.scss"),
        path.resolve(__dirname, "src/assets/hdtyui/css/themes/theme.scss"),
        path.resolve(__dirname, "src/assets/hdtyui/css/themes/variable.scss")
      ]
    }
  },

  configureWebpack: (config) => {
    return {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
          assets: path.resolve(__dirname, "src/assets")
        },
        extensions: [".js", ".vue", ".json"],
        symlinks: false
      },
      stats: {
        modules: false,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        assets: false,
        builtAt: false,
        moduleTrace: false,
        reasons: false
      },
      plugins: [
        // 缓存加速
        // new HardSourceWebpackPlugin(),

        // 环境变量
        new webpack.DefinePlugin({
          "process.env": {
            NODE_PATH: JSON.stringify(process.env.VUE_APP_NODE_PATH),
            VUE_APP_PROJECT_NAME: JSON.stringify(
              process.env.VUE_APP_PROJECT_NAME
            )
          }
        }),

        // 打包分析（按需启用）
        process.env.ANALYZE &&
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: path.resolve(
              __dirname,
              `${projectName}/report.html`
            )
          }),

        // 生产环境专用插件
        process.env.NODE_ENV === "production" &&
          new (class {
            apply(compiler) {
              let startTime;
              compiler.hooks.beforeRun.tap("BuildTimePlugin", () => {
                startTime = Date.now();
              });

              compiler.hooks.done.tap("BuildTimePlugin", (stats) => {
                const endTime = Date.now();
                const buildDuration = ((endTime - startTime) / 1000).toFixed(2);

                const assets = stats
                  .toJson()
                  .assets.filter((asset) => !asset.name.endsWith(".map"))
                  .reduce(
                    (acc, asset) => {
                      const sizeKB = (asset.size / 1024).toFixed(2);
                      if (asset.name.endsWith(".js"))
                        acc.js += parseFloat(sizeKB);
                      if (asset.name.endsWith(".css"))
                        acc.css += parseFloat(sizeKB);
                      acc.total += parseFloat(sizeKB);
                      return acc;
                    },
                    { js: 0, css: 0, total: 0 }
                  );

                console.log(
                  `\n\x1b[32m✅  打包完成 (${buildDuration}s)\x1b[0m`
                );
                console.log(
                  `\x1b[36m📊  资源大小: JS ${assets.js.toFixed(
                    2
                  )}KB  | CSS ${assets.css.toFixed(
                    2
                  )}KB  | 总计 ${assets.total.toFixed(2)}KB\x1b[0m`
                );
              });
            }
          })()
      ].filter(Boolean),
      optimization: {
        minimize: process.env.NODE_ENV === "production",
        minimizer: [
          new TerserPlugin({
            parallel: true,
            extractComments: false,
            terserOptions: {
              compress: {
                drop_console: process.env.NODE_ENV === "production",
                drop_debugger: true
              },
              output: {
                comments: false
              }
            }
          }),
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              safe: true,
              discardComments: { removeAll: true }
            }
          })
        ]
      }
    };
  },

  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // 1. 删除 prefetch 插件（避免预加载所有小文件）
      config.plugins.delete("prefetch");

      // 2. 优化拆包策略
      config.optimization.splitChunks({
        chunks: "all",
        minSize: 30000, // 30KB 以下的模块不拆分（默认值）
        maxSize: 500000, // 尝试将大于 500KB 的包拆分成更小的文件
        minChunks: 2, // 至少被引用 2 次才拆包
        maxAsyncRequests: 8, // 每个异步请求最多 8 个 chunk
        maxInitialRequests: 6, // 初始页面加载时最多 6 个 chunk
        automaticNameDelimiter: "~",
        cacheGroups: {
          // 核心库单独打包（优先级更高）
          vue: {
            name: "chunk-vue",
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
            priority: 30, // 优先级最高
            enforce: true // 忽略 minSize/minChunks 等限制
          },
          elementUI: {
            name: "chunk-element-ui",
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            priority: 25,
            enforce: true
          },
          echarts: {
            name: "chunk-echarts",
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            priority: 20,
            enforce: true
          },
          // 其他 node_modules 合并为一个 vendors 包
          vendors: {
            name: "chunk-vendors",
            test: /[\\/]node_modules[\\/]/,
            priority: 10, // 优先级低于核心库
            reuseExistingChunk: true
          },
          // 公共代码（非 node_modules）
          common: {
            name: "chunk-common",
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });

      // 3. 合并运行时 chunk（减少一个文件）
      config.optimization.runtimeChunk("single");
    }

    // 开发环境配置（保持原样）
    if (process.env.NODE_ENV === "development") {
      config.module
        .rule("js")
        .use("thread-loader")
        .loader("thread-loader")
        .options({
          workers: require("os").cpus().length - 1
        });
    }
  }
};
