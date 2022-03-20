const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");


module.exports = {
  mode: "production",
  target: "node",
  entry: {
    "random-person.lambda": "./src/lambda/random-person.lambda.ts",
  },
  optimization: {
    minimize: false,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts?/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
        ],
        exclude: /node_modules/
      },
    ],
  },
};
