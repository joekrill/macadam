// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;

const apiClientRoot = path.resolve(projectRoot, "../api-client");

const config = getDefaultConfig(projectRoot);

// I'm not totally sure why things don't work unless apiClientRoot is in watchFolders
config.watchFolders = [projectRoot, apiClientRoot];

// Let Metro know where to resolve packages and in what order
// We can't include PnP projects here because they don't use a node_modules
// style directory!
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

module.exports = config;
