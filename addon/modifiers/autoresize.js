import Modifier from 'ember-modifier';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { capitalize } from '@ember/string';

export default class AutoresizeModifier extends Modifier {
  @action
  resize() {
    let { element } = this;
    let dimension = this.args.named.mode ?? 'height';
    let previousWrap = element.style.whiteSpace;

    if (dimension === 'width') {
      // disable default wrapping
      element.style.whiteSpace = 'pre';
    }

    let capitalizeDimension = capitalize(dimension);

    // disable default wrapping

    // height / width must be calculated independently from height / width previously enforced
    element.style[dimension] = 'auto';

    let isBorderBox = window.getComputedStyle(element).boxSizing === 'border-box';
    let requiredDimension = element[`scroll${capitalizeDimension}`];

    if (isBorderBox) {
      // borders must be added on top of scrollHeight / scrollWidth if box-sizing is border-box
      let borderDimension =
        element[`offset${capitalizeDimension}`] - element[`client${capitalizeDimension}`];
      requiredDimension += borderDimension;
    }

    element.style[dimension] = `${requiredDimension}px`;

    element.style.whiteSpace = previousWrap;
  }

  @action
  scheduleResize() {
    scheduleOnce('afterRender', this, 'resize');
  }

  didInstall() {
    // resize for initial value
    this.scheduleResize();

    // resize on every input event
    this.element.addEventListener('input', this.scheduleResize);
  }

  didUpdateArguments() {
    // resize when arguments changes
    this.scheduleResize();
  }

  willRemove() {
    // clean up
    this.element.removeEventListener('input', this.scheduleResize);
  }
}
