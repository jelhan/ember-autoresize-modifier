import { modifier } from 'ember-modifier';

function resize(element) {
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
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
  }
});
