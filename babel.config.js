module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          utils: './src/utils',
          storage: './src/shared/storage',
          src: './src',
        },
      },
    ],
  ],
}
