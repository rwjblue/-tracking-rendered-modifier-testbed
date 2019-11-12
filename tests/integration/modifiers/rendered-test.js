import { module, test } from 'qunit';
import { setupApplicationTest, setupRenderingTest } from 'ember-qunit';
import { render, visit } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import Router from 'dummy/router';
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

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
      this.owner.register('helper:assert-step', class extends Helper {
        @service router;

        compute([name]) {

          return () => assert.step(`${name} - ${this.router.currentURL}`);
        }
      });

      this.owner.register('template:profiles', hbs`
        <div {{rendered (assert-step 'profiles') }}></div>

        {{outlet}}
      `);

      this.owner.register('template:profiles/profile', hbs`
        <div {{rendered (assert-step 'profiles.profile') }}></div>

        {{outlet}}
      `);
    });

    test('invokes function upon initial render', async function(assert) {
      await visit('/profiles');

      assert.verifySteps(['profiles - /profiles']);
    });

    test('re-invokes function upon route transition', async function(assert) {
      await visit('/profiles/1');

      assert.verifySteps([
        'profiles - /profiles/1',
        'profiles.profile - /profiles/1'
      ]);

      await visit('/profiles/2');

      assert.verifySteps([
        'profiles.profile - /profiles/2'
      ]);
    });
  });
});
