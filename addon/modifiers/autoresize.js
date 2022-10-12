import Modifier from 'ember-modifier';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { capitalize } from '@ember/string';
import { registerDestructor } from '@ember/destroyable';

function cleanup(instance) {
  let { el, scheduleResize } = instance;

  if (el && scheduleResize) {
    console.log('clean');
    el.removeEventListener('input', scheduleResize);
    instance.el = null;
  }
}

export default class AutoresizeModifier extends Modifier {
  _oldValue = null;

  @action
  resize() {
    let { el: element } = this;
    let dimension = this.named.mode ?? 'height';
    let previousWrap = element.style.whiteSpace;

    if (dimension === 'width') {
      // disable default wrapping
      element.style.whiteSpace = 'pre';
    }

    let capitalizeDimension = capitalize(dimension);

    // height / width must be calculated independently from height / width previously enforced
    element.style[dimension] = 'auto';

    let isBorderBox =
      window.getComputedStyle(element).boxSizing === 'border-box';
    let requiredDimension = element[`scroll${capitalizeDimension}`];

    if (isBorderBox) {
      // borders must be added on top of scrollHeight / scrollWidth if box-sizing is border-box
      let borderDimension =
        element[`offset${capitalizeDimension}`] -
        element[`client${capitalizeDimension}`];
      requiredDimension += borderDimension;
    }

    element.style[dimension] = `${requiredDimension}px`;

    element.style.whiteSpace = previousWrap;
  }

  @action
  scheduleResize() {
    scheduleOnce('afterRender', this, 'resize');
  }

  modify(element, [value], named) {
    this.el = element;
    this.named = named;

    if (this.value === null) {
      this.el.addEventListener('input', this.scheduleResize);
    }

    this.value = value;

    this.scheduleResize();
    registerDestructor(this, cleanup)
  }
}
