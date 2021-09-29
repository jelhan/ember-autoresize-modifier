import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fillIn, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Modifier | autoresize', function (hooks) {
  setupRenderingTest(hooks);

  let longString;
  hooks.beforeEach(function () {
    longString = '';

    for (let i = 0; i < 100; i++) {
      longString += 'ab cd ef gh ij kl mn op qr st uv wx yz.';
      if (i % 6 === 0) {
        longString += '\n';
      }
    }
  });

  hooks.beforeEach(function (assert) {
    assert.extendedDom = function (selector) {
      return {
        doesNotOverflowY(message = 'element does not overflow') {
          let element = find(selector);
          let result = element.clientHeight === element.scrollHeight;
          assert.ok(result, message);
        },
      };
    };
  });

  test('it resizes textarea height to fit input on initial render', async function (assert) {
    this.set('value', longString);

    await render(hbs`<textarea value={{this.value}} {{autoresize}} />`);
    assert.extendedDom('textarea').doesNotOverflowY();
  });

  test('it grows textarea height on input to fit value', async function (assert) {
    await render(hbs`<textarea {{autoresize}} />`);

    let element = find('textarea');
    let heightBefore = element.clientHeight;

    assert.extendedDom(element).doesNotOverflowY('textarea does not overflow before input');

    await fillIn(element, longString);
    assert.ok(heightBefore < element.clientHeight, 'textarea grows on input of long string');
    assert
      .extendedDom(element)
      .doesNotOverflowY('textarea does not overflow after input of long string');
  });

  test('it shrinks textarea height on input to fit value', async function (assert) {
    this.set('value', longString);

    await render(hbs`<textarea value={{this.value}} {{autoresize}} />`);

    let element = find('textarea');
    let heightBefore = element.clientHeight;

    assert.extendedDom(element).doesNotOverflowY('textarea does not overflow before input');

    await fillIn(element, '');
    assert.ok(heightBefore > element.clientHeight, 'textarea shrinks on input of shorter string');
    assert
      .extendedDom(element)
      .doesNotOverflowY('textarea does not overflow after input of shorter string');
  });

  test('it resizes height if value changes programmatically', async function (assert) {
    this.set('value', '');

    await render(hbs`<textarea value={{this.value}} {{autoresize this.value}} />`);

    let element = find('textarea');
    let heightBefore = element.clientHeight;

    this.set('value', longString);
    assert.ok(heightBefore < element.clientHeight, 'textarea resizes on programmatic change');
    assert
      .extendedDom(element)
      .doesNotOverflowY('textarea does not overflow after programmatic change');
  });

  test('it supports box-sizing: border-box', async function (assert) {
    this.set('value', longString);

    await render(
      hbs`<textarea style="box-sizing: border-box" value={{this.value}} {{autoresize}} />`
    );
    assert.extendedDom('textarea').doesNotOverflowY();
  });
});
