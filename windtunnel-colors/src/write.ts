import { Options, codes } from './options';

export function write(content: string, options: Options): string {
  if (
    options.attributes == null &&
    options.background == null &&
    options.foreground == null
  ) {
    return content;
  }

  return `\x1B[${codes(options).join(';')}m${content}\x1B[0m`;
}
