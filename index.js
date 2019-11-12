'use strict';

module.exports = {
  name: require('./package').name,

  setupPreprocessorRegistry(type, registry) {
    registry.add('htmlbars-ast-plugin', this.buildPlugin());
  },

  buildPlugin() {
    // https://astexplorer.net/#/gist/d54628e13b6b34ea293aee8286f04a1b/03069c59d3776126323ce877da6b652c292fc1d1
    return {
      name: 'rendered-modifier-route-state',

      baseDir() {
        return __dirname;
      },

      parallelBabel: {
        requireFile: __filename,
        buildUsing: 'buildPlugin',
        params: {},
      },

      plugin(env) {
        let b = env.syntax.builders;

        return {
          name: 'rendered-modifier-route-state',

          visitor: {
            ElementModifierStatement(node) {
              if (node.path.original === 'rendered') {
                let hashPairs = node.hash.pairs;
                let hasRouteName = hashPairs.find(p => p.key === 'routeName');
                let hasRouteModel = hashPairs.find(p => p.key === 'currentRouteModel');

                let getOutletState = b.sexpr('-get-dynamic-var', [b.string('outletState')]);

                if (!hasRouteName) {
                  hashPairs.push(b.pair('routeName', b.sexpr('get', [getOutletState, b.string('render.name')])));
                }

                if (!hasRouteModel) {
                  hashPairs.push(b.pair('currentRouteModel', b.sexpr('get', [getOutletState, b.string('render.model')])));
                }
              }
            },
          },
        };
      },
    };
  },
};
