ember-autoresize-modifier
==============================================================================

Element Modifier that resizes a `<textarea>` accordingly to the input.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```sh
ember install ember-autoresize-modifier
```


Usage
------------------------------------------------------------------------------

```hbs
<textarea {{autoresize}}>
```

If you bind a property to the value of the textarea, you must also pass it as
an argument to `{{autoresize}}` modifier. Otherwise the textarea won't resize
when the value is changed programmatically:

```hbs
<textarea value={{this.foo}} {{autoresize this.foo}}>
```

Use CSS `min-height` and `max-height` properties to enforce a minimum and/or
maximum height.


Known Limitations
------------------------------------------------------------------------------

- Element Modifiers are not executed in server-side rendering / FastBoot. The
  textarea won't be resized until rehydration.
- Resizing the width of a textarea is not supported yet. Pull requests are
  welcome.


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
