import { assertEqual } from '@windtunnel/assert';
import {
  format,
  ForegroundColors,
  BackgroundColors,
  Attributes,
} from '../dist/index.mjs';

export function plain() {
  const actual = format('foo', {
    attributes: null,
    background: null,
    foreground: null,
  });
  assertEqual(actual, 'foo');
}

export function black() {
  const actual = format('foo', {
    attributes: null,
    background: null,
    foreground: ForegroundColors.Black,
  });

  assertEqual(actual, '\x1B[30mfoo\x1B[0m');
}

export function red() {
  const actual = format('foo', {
    attributes: null,
    background: null,
    foreground: ForegroundColors.Red,
  });

  assertEqual(actual, '\x1B[31mfoo\x1B[0m');
}

export function yellowBold() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Bold]),
    background: null,
    foreground: ForegroundColors.Yellow,
  });

  assertEqual(actual, '\x1B[1;33mfoo\x1B[0m');
}

export function blueUnderline() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Underline]),
    background: null,
    foreground: ForegroundColors.Blue,
  });

  assertEqual(actual, '\x1B[4;34mfoo\x1B[0m');
}

export function greenBoldUnderline() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Bold, Attributes.Underline]),
    background: null,
    foreground: ForegroundColors.Green,
  });

  assertEqual(actual, '\x1B[1;4;32mfoo\x1B[0m');
}

export function magentaOnWhite() {
  const actual = format('foo', {
    attributes: null,
    background: BackgroundColors.White,
    foreground: ForegroundColors.Magenta,
  });

  assertEqual(actual, '\x1B[35;47mfoo\x1B[0m');
}

export function yellowOnBlue() {
  const actual = format('foo', {
    attributes: null,
    background: BackgroundColors.Blue,
    foreground: ForegroundColors.Yellow,
  });

  assertEqual(actual, '\x1B[33;44mfoo\x1B[0m');
}

export function boldCyanOnWhite() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Bold]),
    background: BackgroundColors.White,
    foreground: ForegroundColors.Cyan,
  });

  assertEqual(actual, '\x1B[1;36;47mfoo\x1B[0m');
}

export function boldUnderlineCyanOnWhite() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Bold, Attributes.Underline]),
    background: BackgroundColors.White,
    foreground: ForegroundColors.Cyan,
  });

  assertEqual(actual, '\x1B[1;4;36;47mfoo\x1B[0m');
}

export function plainBoldUnderline() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Bold, Attributes.Underline]),
    background: null,
    foreground: null,
  });

  assertEqual(actual, '\x1B[1;4mfoo\x1B[0m');
}

export function dimmed() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Dimmed]),
    background: null,
    foreground: null,
  });

  assertEqual(actual, '\x1B[2mfoo\x1B[0m');
}

export function italic() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Italic]),
    background: null,
    foreground: null,
  });

  assertEqual(actual, '\x1B[3mfoo\x1B[0m');
}

export function blink() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Blink]),
    background: null,
    foreground: null,
  });

  assertEqual(actual, '\x1B[5mfoo\x1B[0m');
}

export function invert() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Invert]),
    background: null,
    foreground: null,
  });

  assertEqual(actual, '\x1B[7mfoo\x1B[0m');
}

export function hidden() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Hidden]),
    background: null,
    foreground: null,
  });

  assertEqual(actual, '\x1B[8mfoo\x1B[0m');
}

export function strikethrough() {
  const actual = format('foo', {
    attributes: new Set([Attributes.Strikethrough]),
    background: null,
    foreground: null,
  });

  assertEqual(actual, '\x1B[9mfoo\x1B[0m');
}
