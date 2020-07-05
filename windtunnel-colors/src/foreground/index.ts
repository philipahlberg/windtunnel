import * as ForegroundColors from './constants';

type ForegroundColor = (typeof ForegroundColors)[keyof (typeof ForegroundColors)];

export {
  ForegroundColors,
  ForegroundColor,
}
