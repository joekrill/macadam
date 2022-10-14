# client-mobile

A React-Native/Expo client application.

## Notes

Expo and React Native do not currently work correctly with Yarn PnP mode. This app is ignored by the root yarn configuration (using the `pnpIgnorePatterns` option in the root `.yarnrc.yml`) and is treated as a separate sub-project with it's own yarn configuration using the node_modules linker instead of PnP. This causes a few problems:

- Dependencies of depdendent projects (i.e. client-api) need to be explicitly added to the non-PnP project (because Metro expects packages to be installed in node_modules-style way, and can't find the dependencies when they use Yarn PnP zip files)
- Metro needs to be explicitly told where to find linked projects (see `metro.config.js`)

See:

- https://github.com/yarnpkg/berry/issues/2301#issuecomment-768204408
- https://yarnpkg.com/getting-started/recipes#hybrid-pnp--node_modules-mono-repo
- https://docs.expo.dev/guides/monorepos
