# client-mobile

A React-Native/Expo client application.

## Notes

Expo and React Native do not currently work correctly with Yarn PnP mode. This app is ignored by the root yarn configuration (using the `pnpIgnorePatterns` option in the root `.yarnrc.yml`) and is treated as a separate sub-project with it's own yarn configuration using the node_modules linker instead of PnP.

See:

- https://github.com/yarnpkg/berry/issues/2301#issuecomment-768204408
- https://yarnpkg.com/getting-started/recipes#hybrid-pnp--node_modules-mono-repo
