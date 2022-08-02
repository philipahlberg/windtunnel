import * as Attributes from './constants';

type Attribute = (typeof Attributes)[keyof (typeof Attributes)];

export {
	Attributes,
	Attribute,
}
