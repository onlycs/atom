<script lang="ts">
import { PropType } from 'vue';

type ID = string | number;

export interface Option<T> {
	id: ID;
	name: string;
	value: T;
	disabled?: boolean;
}

interface Setting {
	id: ID;
	name: string;
	type: string;
	disabled?: boolean;
	onchange?: (value: any) => void;
}

export interface BooleanSetting extends Setting {
	type: 'boolean';
	value?: boolean;
	incompatible?: ID[];
	onchange?: (value: boolean) => void;
}

export interface StringSetting extends Setting {
	type: 'string';
	value?: string;
	validate?: (value: string) => boolean;
	onchange?: (value: string) => void;
}

export interface NumberSetting extends Setting {
	type: 'number';
	value?: number;
	validate?: (value: number) => boolean;
	onchange?: (value: number) => void;
}

export interface SelectSetting<T> extends Setting {
	type: 'select';
	value?: ID;
	options: Option<T>[];
	onchange?: (value: Option<T>) => void;
}

export type AnySetting = BooleanSetting | StringSetting | NumberSetting | SelectSetting<any>;
export type AnySettingT<T> = BooleanSetting | StringSetting | NumberSetting | SelectSetting<T>;

export type AnySettingValue = boolean | string | number | Option<any>;
export type AnySettingValueT<T> = boolean | string | number | Option<T>;

export default {
	props: {
		settings: {
			type: Array as PropType<AnySetting[]>,
			required: true,
			validator: (settings: AnySetting[]) => {
				const nodupes = settings
					.map(setting => setting.id)
					.sort()
					.every((id, index, array) => id !== array[index - 1]);
				
				const incompat_valid = settings
					.filter(setting => setting.type == 'boolean')
					.map(setting => (setting as BooleanSetting).incompatible)
					.flat()
					.filter(e => e !== undefined)
					.every(
						incompatible => settings
							.map(setting => setting.id)
							.includes(incompatible as string)
					);

				settings.forEach((setting, index, settings) => {
					if (setting.type === 'boolean') {
						if (setting.value === undefined) {
							settings[index].value = false;
						}
					} else if (setting.type === 'string') {
						if (setting.value === undefined) {
							settings[index].value = '';
						}
					} else if (setting.type === 'number') {
						if (setting.value === undefined) {
							settings[index].value = 0;
						}
					} else if (setting.type === 'select') {
						if (setting.value === undefined) {
							settings[index].value = setting.options[0].id;
						}
					}
				});

				return nodupes && incompat_valid;
			}
		},
		size: {
			type: String as PropType<'sm' | 'md' | 'lg'>,
			default: 'md'
		},
		dropdown_class: {
			type: String,
			default: 'dropdown-bottom'
		},
		content_class: {
			type: String,
			default: 'bg-base-200'
		}
	},
	methods: {
		get_value<T>(id:string): AnySettingValueT<T> | undefined {
			const option = (this.settings as AnySetting[]).find(option => option.id === id);
			return option?.value;
		},
		update_setting(id: ID, value: AnySettingValue) {
			const setting = this.settings.find(e => e.id === id);

			(setting?.onchange as ((value: AnySettingValue) => void) | undefined)?.(value);

			if (setting?.type == 'boolean') {
				const boolean_setting = setting as BooleanSetting;
				const boolean_value = value as boolean;

				if (boolean_value) {
					if (boolean_setting.incompatible !== undefined) {
						const incompatible = boolean_setting.incompatible as ID[];
						incompatible.forEach(incompatible_id => {
							this.update_setting(incompatible_id, false);
						});
					}
				}
			}
		}
	}
};

</script>

<template>
	<div ref="dropdown" :class="`dropdown ${dropdown_class}`">
		<label
			ref="dropdown_btn"
			tabindex="0"
			aria-label="Settings"
			:class="`btn btn-${size} btn-ghost btn-square settings-btn`"
		>
			<Icon
				class="settings-icon"
				name="solar:settings-linear"
				color="white"
				:size="(() => {
					switch (size) {
						case 'sm':
							return '1rem';
						case 'md':
							return '1.5rem';
						case 'lg':
							return '2rem';
					}
				})()
				"
			/>
		</label>
		<ul
			tabindex="0"
			:class="`mt-2 dropdown-content z-1 p-4 shadow rounded-box w-60 ${content_class}`"
		>
			<li v-for="setting in settings" :key="setting.id">
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">{{ setting.name }}</span>
						<input
							v-if="setting.type == 'boolean'"
							type="checkbox"
							class="toggle toggle-primary"
							:checked="setting.value"
							:disabled="setting.disabled"
							@change.prevent="update_setting(setting.id, ($event as any).target.checked);"
						>
					</label>
				</div>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.settings-icon {
	transition: transform 0.2s ease-in-out;
}

.dropdown:focus-within > .settings-btn > .settings-icon {
	transform: rotate(calc(360deg/6));
}
</style>