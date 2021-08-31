import { ModuleTree } from 'vuex';

/**
 * Automatically imports all the modules and exports as a single module object
 */
const requireModule = require.context('.', false, /\.store\.(t|j)s$/);
const modules: ModuleTree<__WebpackModuleApi.RequireContext> = {};

requireModule.keys().forEach((filename) => {
  const moduleName = filename.replace(/(\.\/|\.store\.(t|j)s)/g, '');

  modules[moduleName] = requireModule(filename).default || requireModule(filename);
});

export default modules;
