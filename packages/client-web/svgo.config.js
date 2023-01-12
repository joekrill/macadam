module.exports = {
  // Pass over SVGs multiple times to ensure all optimizations are applied
  multipass: true,

  // Match .editorconfig/prettier preferences
  js2svg: {
    indent: 2,
    pretty: true,
  },

  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // keep viewbox attribute
          removeViewBox: false,
        },
      },
    },
    {
      // Remove `data-` attributes
      name: "removeAttrs",
      params: {
        attrs: "data.*",
      },
    },
  ],
};
