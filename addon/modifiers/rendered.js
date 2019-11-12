import { setModifierManager, capabilities } from '@ember/modifier';

export default setModifierManager(
  () => ({
    capabilities: capabilities('3.13', { disableAutoTracking: true }),

    createModifier() {},

    installModifier(_state, element, args) {
      let [fn] = args.positional;

      fn();
    },

    updateModifier() {},
    destroyModifier() {},
  }),

  {} // stable object to associate modifier manager with
);
