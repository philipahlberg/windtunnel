import * as BackgroundColors from './constants';
type BackgroundColor = (typeof BackgroundColors)[keyof (typeof BackgroundColors)];

export {
	BackgroundColors,
	BackgroundColor,
}
