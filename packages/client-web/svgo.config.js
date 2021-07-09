const { extendDefaultPlugins } = require("svgo");

module.exports = {
  // Pass over SVGs multiple times to ensure all optimizations are applied
  multipass: true,

  // Match .editorconfig/prettier preferences
  js2svg: {
    indent: 2,
    pretty: true,
  },

  plugins: extendDefaultPlugins([
    // Remove `data-` attributes
    {
      name: "removeAttrs",
      params: { attrs: "data.*" },
    },
    // keep viewbox attribute
    {
      name: "removeViewBox",
      active: false,
    },
  ]),
};
