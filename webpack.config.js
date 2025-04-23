const { resolve } = require("path");
const path = require("path");
const DEV_PORT = process.env.PORT || 3333;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack')
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const now = new Date();
const yyyymmdd =
  now.getFullYear() +
  ("0" + (now.getMonth() + 1)).slice(-2) +
  ("0" + now.getDate()).slice(-2) +
  ("0" + now.getHours()).slice(-2) +
  ("0" + now.getMinutes()).slice(-2);

module.exports = (env, argv) => ({
  entry: {
    app: ["./src/index.tsx"],
  },
  output: {
    filename: "[name].bundle.js?v=" + yyyymmdd,
    path: path.resolve(__dirname, "dist"),
    publicPath: "./",
    clean: true,
  },
  devtool: process.env.GENERATE_SOURCEMAP === "false" ? false : "source-map",
  devServer: {
    host: '0.0.0.0',
    devMiddleware: {
      publicPath: "/spa/",
      writeToDisk: true,
    },
    static: {
      directory: path.resolve(__dirname, "dist/"),
    },
    historyApiFallback: true,
    port: DEV_PORT,
  },
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".html", ".styl"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    fallback: {
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      vm: require.resolve("vm-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["react-hot-loader/babel"],
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /component/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"],
                  plugins: ["react-hot-loader/babel"],
                },
              },
              {
                loader: "react-svg-loader",
                options: {
                  jsx: true, // true outputs JSX tags
                  svgo: {
                    plugins: [
                      {
                        inlineStyles: false, // styleを適用するとclassが消去されてしまうので無効にする
                      },
                    ],
                  },
                },
              },
            ],
          },
          {
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, // 10kb
              },
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 80 * 1024, // 80kb
          },
        },
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: false, // ブラウザを自動で開くかどうか　http://127.0.0.1:8888/
      analyzerHost: "0.0.0.0",
      analyzerMode: argv.mode === "production" ? "disabled" : "server",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/assets/css/",
          to: "css/",
        },
        {
          from: "src/assets/fonts/",
          to: "fonts/",
        },
        {
          from: "src/assets/js",
          to: "js/",
        },
        {
          from: "public/favicon.ico",
          to: "",
        },
        {
          from: "public/content/mypage/index.html",
          to: "content/mypage/index.html",
        },
        {
          from: "public/content/help/index.html",
          to: "content/help/index.html",
        },
      ],
    }),
    new HtmlWebpackPlugin({ template: resolve(__dirname, "public/index.html") }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
});
