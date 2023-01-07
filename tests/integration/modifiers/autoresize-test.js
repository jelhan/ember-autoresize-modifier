import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fillIn, find, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Modifier | autoresize', function (hooks) {
  setupRenderingTest(hooks);

  let shortString = 'abc';
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
        doesNotOverflowX(message = 'element does not overflow') {
          let element = find(selector);
          let result = element.clientWidth === element.scrollWidth;
          assert.ok(result, message);
        },
      };
    };
  });

  test('it resizes textarea height to fit input on initial render', async function (assert) {
    this.set('value', longString);

    await render(
      hbs`<textarea value={{this.value}} {{autoresize}}></textarea>`
    );
    assert.extendedDom('textarea').doesNotOverflowY();
  });

  test('it resizes textarea height to fit input min height on initial render with small value', async function (assert) {
    this.set('value', shortString);

    await render(
      hbs`<textarea style="padding: 0; min-height: 50px;" value={{this.value}} {{autoresize}} />`
    );
    let textarea = find('textarea');
    assert.strictEqual(textarea.scrollHeight, 50);
    assert.extendedDom('textarea').doesNotOverflowY();
  });

  test('it resizes textarea height to fit input min height on initial render with long value', async function (assert) {
    this.set('value', longString);

    await render(
      hbs`<textarea style="min-height: 50px;" value={{this.value}} {{autoresize}} />`
    );
    let textarea = find('textarea');
    assert.ok(textarea.scrollHeight > 50);
    assert.extendedDom('textarea').doesNotOverflowY();
  });

  test('it resizes textarea width to fit input min width on initial render', async function (assert) {
    this.set('value', shortString);

    await render(
      hbs`<textarea style="padding: 0; min-width: 200px;" value={{this.value}} {{autoresize mode="width"}} />`
    );
    let textarea = find('textarea');
    assert.strictEqual(textarea.scrollWidth, 200);
    assert.extendedDom('textarea').doesNotOverflowX();
  });

  test('it resizes textarea width to fit input min width on initial render with long value', async function (assert) {
    this.set('value', longString);

    await render(
      hbs`<textarea style="min-width: 50px;" value={{this.value}} {{autoresize mode="width"}} />`
    );
    let textarea = find('textarea');
    assert.ok(textarea.scrollWidth > 50);
    assert.extendedDom('textarea').doesNotOverflowX();
  });

  test('it grows textarea height on input to fit value', async function (assert) {
    await render(hbs`<textarea {{autoresize}}></textarea>`);

    let element = find('textarea');
    let heightBefore = element.clientHeight;

    assert
      .extendedDom(element)
      .doesNotOverflowY('textarea does not overflow before input');

    await fillIn(element, longString);
    assert.ok(
      heightBefore < element.clientHeight,
      'textarea grows on input of long string'
    );
    assert
      .extendedDom(element)
      .doesNotOverflowY(
        'textarea does not overflow after input of long string'
      );
  });

  test('it shrinks textarea height on input to fit value', async function (assert) {
    this.set('value', longString);

    await render(
      hbs`<textarea value={{this.value}} {{autoresize}}></textarea>`
    );

    let element = find('textarea');
    let heightBefore = element.clientHeight;

    assert
      .extendedDom(element)
      .doesNotOverflowY('textarea does not overflow before input');

    await fillIn(element, '');
    assert.ok(
      heightBefore > element.clientHeight,
      'textarea shrinks on input of shorter string'
    );
    assert
      .extendedDom(element)
      .doesNotOverflowY(
        'textarea does not overflow after input of shorter string'
      );
  });

  test('it resizes height if value changes programmatically', async function (assert) {
    this.set('value', '');

    await render(
      hbs`<textarea value={{this.value}} {{autoresize this.value}}></textarea>`
    );

    let element = find('textarea');
    let heightBefore = element.clientHeight;

    this.set('value', longString);
    assert.ok(
      heightBefore < element.clientHeight,
      'textarea resizes on programmatic change'
    );
    assert
      .extendedDom(element)
      .doesNotOverflowY('textarea does not overflow after programmatic change');
  });

  test('it supports box-sizing: border-box', async function (assert) {
    this.set('value', longString);

    await render(
      hbs`{{! template-lint-disable no-inline-styles  }}
<textarea
  style='box-sizing: border-box'
  value={{this.value}}
  {{autoresize}}
></textarea>`
    );
    assert.extendedDom('textarea').doesNotOverflowY();

    await render(
      hbs`{{! template-lint-disable no-inline-styles  }}
<textarea
  style='box-sizing: border-box'
  value={{this.value}}
  {{autoresize mode='width'}}
></textarea>`
    );
    assert.extendedDom('textarea').doesNotOverflowX();
  });

  test('it resizes textarea width to fit input on initial render', async function (assert) {
    this.set('value', longString);

    await render(
      hbs`<textarea value={{this.value}} {{autoresize mode='width'}}></textarea>`
    );
    assert.extendedDom('textarea').doesNotOverflowX();
  });

  test('it grows textarea width on input to fit value', async function (assert) {
    await render(hbs`<textarea {{autoresize mode='width'}}></textarea>`);

    let element = find('textarea');
    let widthBefore = element.clientWidth;

    assert
      .extendedDom(element)
      .doesNotOverflowX('textarea does not overflow before input');

    await fillIn(element, longString);
    assert.ok(
      widthBefore < element.clientWidth,
      'textarea grows on input of long string'
    );
    assert
      .extendedDom(element)
      .doesNotOverflowX(
        'textarea does not overflow after input of long string'
      );
  });

  test('it shrinks textarea width on input to fit value', async function (assert) {
    this.set('value', longString);

    await render(
      hbs`<textarea value={{this.value}} {{autoresize mode='width'}}></textarea>`
    );

    let element = find('textarea');
    let widthBefore = element.clientWidth;

    assert
      .extendedDom(element)
      .doesNotOverflowX('textarea does not overflow before input');

    await fillIn(element, '');
    assert.ok(
      widthBefore > element.clientWidth,
      'textarea shrinks on input of shorter string'
    );
    assert
      .extendedDom(element)
      .doesNotOverflowX(
        'textarea does not overflow after input of shorter string'
      );
  });

  test('it resizes width if value changes programmatically', async function (assert) {
    this.set('value', '');

    await render(
      hbs`<textarea
  value={{this.value}}
  {{autoresize this.value mode='width'}}
></textarea>`
    );

    let element = find('textarea');
    let widthBefore = element.clientWidth;

    this.set('value', longString);
    assert.ok(
      widthBefore < element.clientWidth,
      'textarea resizes on programmatic change'
    );
    assert
      .extendedDom(element)
      .doesNotOverflowX('textarea does not overflow after programmatic change');
  });
});
