/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from 'ts-interface-checker';
// tslint:disable:object-literal-key-quotes

export const SearchEngine = t.iface([], {
	id: 'string',
	name: 'string',
	url: 'string',
	logo_name: 'string',
	default: t.opt('boolean'),
	can_delete: 'boolean'
});

export const Settings = t.iface([], {
	engines: t.array('SearchEngine'),
	tab_mask: t.iface([], {
		title: 'string',
		icon: 'string'
	})
});

const exportedTypeSuite: t.ITypeSuite = {
	SearchEngine,
	Settings
};
export default exportedTypeSuite;