import babel from '@rollup/plugin-babel';
import { Addon } from '@embroider/addon-dev/rollup';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default {
  output: addon.output(),

  plugins: [
    addon.publicEntrypoints(['modifiers/autoresize.js']),

    addon.appReexports(['modifiers/autoresize.js']),

    babel({
      babelHelpers: 'bundled',
    }),

    addon.dependencies(),

    addon.clean(),
  ],
};
