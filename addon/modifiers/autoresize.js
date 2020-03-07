import { modifier } from 'ember-modifier';

function resize(element) {
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

function eventHandler(event) {
  resize(event.target);
}

export default modifier(function autoresize(element) {
  // resize for initial value
  resize(element);

  // resize on every input event
  element.addEventListener('input', eventHandler);

  return () => {
    // clean up
    element.removeEventListener('input', eventHandler);
  };
});
