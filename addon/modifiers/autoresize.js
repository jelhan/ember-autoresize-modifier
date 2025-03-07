import Modifier from 'ember-modifier';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { registerDestructor } from '@ember/destroyable';

function cleanup(instance) {
  let { el, scheduleResize } = instance;
  el.removeEventListener('input', scheduleResize);
}

export default class AutoresizeModifier extends Modifier {
  listener = null;

  @action
  resize() {
    let { el: element } = this;
    let dimension = this.named.mode ?? 'height';
    let previousWrap = element.style.whiteSpace;

    if (dimension === 'width') {
      // disable default wrapping
      element.style.whiteSpace = 'pre';
    }

    let capitalizeDimension = dimension[0].toUpperCase() + dimension.slice(1);

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
    // Relying on Ember's runloop directly as we don't want to pull in another dependency.
    // eslint-disable-next-line ember/no-runloop
    scheduleOnce('afterRender', this, 'resize');
  }

  modify(element, [value], named) {
    this.el = element;
    this.named = named;
    this.value = value;

    if (this.listener === null) {
      this.listener = this.el.addEventListener('input', this.scheduleResize);
    }

    this.scheduleResize();
    registerDestructor(this, cleanup);
  }
}
