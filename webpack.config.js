const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = [
  // Main process configuration
  {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/main.ts',
    target: 'electron-main',
    devtool: isDevelopment ? 'inline-source-map' : false,
    cache: isDevelopment ? {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    } : false,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: isDevelopment,
              compilerOptions: {
                incremental: isDevelopment,
              },
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      clean: false,
    },
    node: {
      __dirname: false,
      __filename: false,
    },
    stats: {
      errorDetails: true,
    },
  },
  // Renderer process configuration
  {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/renderer/index.tsx',
    target: 'electron-renderer',
    devtool: isDevelopment ? 'inline-source-map' : false,
    cache: isDevelopment ? {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    } : false,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: isDevelopment,
              compilerOptions: {
                incremental: isDevelopment,
              },
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'renderer.js',
      clean: false,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/renderer/index.html',
        filename: 'index.html',
        cache: isDevelopment,
      }),
    ],
    stats: {
      errorDetails: true,
    },
  },
];