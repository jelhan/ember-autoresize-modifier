import Modifier from 'ember-modifier';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class AutoresizeModifier extends Modifier {
  @action
  resize() {
    let { element } = this;

    // height must be calculated independently from height previously enforced
    element.style.height = 'auto';

    let isBorderBox = window.getComputedStyle(element).boxSizing === 'border-box';
    let requiredHeight = element.scrollHeight;

    if (isBorderBox) {
      // borders must be added on top of scrollHeight if box-sizing is border-box
      let borderHeight = element.offsetHeight - element.clientHeight;
      requiredHeight += borderHeight;
    }

    element.style.height = `${requiredHeight}px`;
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
