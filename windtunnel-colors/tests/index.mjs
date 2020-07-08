import { deepEqual } from 'assert';
import {
  write,
  ForegroundColors,
  BackgroundColors,
  Attributes,
} from '../dist/index.mjs';

export function plain() {
  const actual = write('foo', {
    attributes: null,
    background: null,
    foreground: null,
  });
  deepEqual(actual, 'foo');
}

export function black() {
  const actual = write('foo', {
    attributes: null,
    background: null,
    foreground: ForegroundColors.Black,
  });

  deepEqual(actual, '\x1B[30mfoo\x1B[0m');
}

export function red() {
  const actual = write('foo', {
    attributes: null,
    background: null,
    foreground: ForegroundColors.Red,
  });

  deepEqual(actual, '\x1B[31mfoo\x1B[0m');
}

export function yellowBold() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Bold]),
    background: null,
    foreground: ForegroundColors.Yellow,
  });

  deepEqual(actual, '\x1B[1;33mfoo\x1B[0m');
}

export function blueUnderline() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Underline]),
    background: null,
    foreground: ForegroundColors.Blue,
  });

  deepEqual(actual, '\x1B[4;34mfoo\x1B[0m');
}

export function greenBoldUnderline() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Bold, Attributes.Underline]),
    background: null,
    foreground: ForegroundColors.Green,
  });

  deepEqual(actual, '\x1B[1;4;32mfoo\x1B[0m');
}

export function magentaOnWhite() {
  const actual = write('foo', {
    attributes: null,
    background: BackgroundColors.White,
    foreground: ForegroundColors.Magenta,
  });

  deepEqual(actual, '\x1B[35;47mfoo\x1B[0m');
}

export function yellowOnBlue() {
  const actual = write('foo', {
    attributes: null,
    background: BackgroundColors.Blue,
    foreground: ForegroundColors.Yellow,
  });

  deepEqual(actual, '\x1B[33;44mfoo\x1B[0m');
}

export function boldCyanOnWhite() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Bold]),
    background: BackgroundColors.White,
    foreground: ForegroundColors.Cyan,
  });

  deepEqual(actual, '\x1B[1;36;47mfoo\x1B[0m');
}

export function boldUnderlineCyanOnWhite() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Bold, Attributes.Underline]),
    background: BackgroundColors.White,
    foreground: ForegroundColors.Cyan,
  });

  deepEqual(actual, '\x1B[1;4;36;47mfoo\x1B[0m');
}

export function plainBoldUnderline() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Bold, Attributes.Underline]),
    background: null,
    foreground: null,
  });

  deepEqual(actual, '\x1B[1;4mfoo\x1B[0m');
}

export function dimmed() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Dimmed]),
    background: null,
    foreground: null,
  });

  deepEqual(actual, '\x1B[2mfoo\x1B[0m');
}

export function italic() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Italic]),
    background: null,
    foreground: null,
  });

  deepEqual(actual, '\x1B[3mfoo\x1B[0m');
}

export function blink() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Blink]),
    background: null,
    foreground: null,
  });

  deepEqual(actual, '\x1B[5mfoo\x1B[0m');
}

export function invert() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Invert]),
    background: null,
    foreground: null,
  });

  deepEqual(actual, '\x1B[7mfoo\x1B[0m');
}

export function hidden() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Hidden]),
    background: null,
    foreground: null,
  });

  deepEqual(actual, '\x1B[8mfoo\x1B[0m');
}

export function strikethrough() {
  const actual = write('foo', {
    attributes: new Set([Attributes.Strikethrough]),
    background: null,
    foreground: null,
  });

  deepEqual(actual, '\x1B[9mfoo\x1B[0m');
}
