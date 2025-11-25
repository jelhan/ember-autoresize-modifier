# ember-autoresize-modifier

Element Modifier that resizes a `<textarea>` accordingly to the input.

> **Note**: Resizing textareas to fit their content is supported by the
> CSS [`field-sizing`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing)
> feature natively. As of the time writing this note (November 2025)
> the feature is supported by Google Chrome and Microsoft Edge. This
> modifier should only be used until all your targeted browsers
> support the feature.

## Compatibility

* Ember.js v4.12 or above
* Ember CLI v4.12 or above
* Node.js v18 or above

## Installation

```sh
ember install ember-autoresize-modifier
```

## Usage

```hbs
<textarea {{autoresize}}>
<textarea {{autoresize mode='width'}}>
```

If you bind a property to the value of the textarea, you must also pass it as
an argument to `{{autoresize}}` modifier. Otherwise the textarea won't resize
when the value is changed programmatically:

```hbs
<textarea value={{this.foo}} {{autoresize this.foo}}>
<textarea value={{this.foo}} {{autoresize this.foo mode='width'}}>
```

The addon takes resizes the textarea by setting `height` / `width` CSS
property. It overrules all custom values of the `height` / `width` property.
Therefore styles of textareas using this modifier must not rely on `height` /
`width` CSS property.

Use CSS `min-height` / `min-width` and `max-height` / `max-width` properties
to enforce a minimum and/or maximum height / width.


Known Limitations
------------------------------------------------------------------------------

- Element Modifiers are not executed in server-side rendering / FastBoot. The
  textarea won't be resized until rehydration.

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
