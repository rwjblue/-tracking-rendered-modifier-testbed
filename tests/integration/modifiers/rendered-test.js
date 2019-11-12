import { module, test } from 'qunit';
import { setupApplicationTest, setupRenderingTest } from 'ember-qunit';
import { render, visit } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import Router from 'dummy/router';
import { helper } from '@ember/component/helper';

module('tests/integration/modifiers/rendered', function() {
  module('rendering tests', function(hooks) {
    setupRenderingTest(hooks);

    test('fires when rendered the first time', async function(assert) {
      assert.expect(1);

      this.itsHappening = () => {
        assert.ok(true);
      };

      await render(hbs`<div {{rendered this.itsHappening}} ></div>`);
    });
  });

  module('application tests', function(hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(function(assert) {
      class TestRouter extends Router {}
      TestRouter.map(function() {
        this.route('profiles', function() {
          this.route('profile', { path: '/:id' }, function() {
            this.route('edit');
          });
        });
      });

      this.owner.register('router:main', TestRouter);
      this.owner.register('helper:assert-step', helper(function([name]) {
        return () => assert.step(name);
      }));

      this.owner.register('template:profiles', hbs`
        <div {{rendered (assert-step 'profiles rendered')}}></div>
        {{outlet}}
      `);

      this.owner.register('template:profiles/profile', hbs`
        <div {{rendered (assert-step 'profiles.profile rendered')}}></div>
        {{outlet}}
      `);
    });

    test('invokes function upon initial render', async function(assert) {
      await visit('/profiles');

      assert.verifySteps(['profiles rendered']);
    });
  });
});
