import { setModifierManager, capabilities } from '@ember/modifier';

class RenderedModifierStateBucket {
  hasRendered = false;
  lastRenderedModel;

  constructor(callback) {
    this.callback = callback;
  }

  render(model) {
    if (!this.hasRendered || this.lastRenderedModel !== model) {
      this.callback();
    }

    this.hasRendered = true;
    this.lastRenderedModel = model;
  }
}

export default setModifierManager(
  () => ({
    capabilities: capabilities('3.13', { disableAutoTracking: true }),

    createModifier(klass, args) {
      return new RenderedModifierStateBucket(args.positional[0]);
    },

    installModifier(state, _element, args) {
      state.render(args.named.currentRouteModel);
    },

    updateModifier(state, args) {
      state.render(args.named.currentRouteModel);
    },

    destroyModifier() {},
  }),

  class RenderModifier {} // stable object to associate modifier manager with
);
