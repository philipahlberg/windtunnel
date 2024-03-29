import { Attribute } from "./attributes/index";
import { BackgroundColor } from "./background/index";
import { ForegroundColor } from "./foreground/index";

export interface Options {
	foreground?: ForegroundColor;
	background?: BackgroundColor;
	attributes?: Set<Attribute>;
}

type EscapeCode = Attribute | BackgroundColor | ForegroundColor;

export const codes = (options: Options): EscapeCode[] => {
	const codes: EscapeCode[] = [];

	if (options.attributes != null) {
		codes.push(...options.attributes);
	}

	if (options.background != null) {
		codes.push(options.background);
	}

	if (options.foreground != null) {
		codes.push(options.foreground);
	}

	return codes.sort((a: EscapeCode, b: EscapeCode) => a - b);
};
