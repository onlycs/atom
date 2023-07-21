import { RouteLocationNormalizedLoaded } from '.nuxt/vue-router';
import { xor } from '~/utils/xor';

export function useData<T>(route: RouteLocationNormalizedLoaded, default_data: T): T {
	const maybe_data = route.query.data;

	if (maybe_data) {
		const data = JSON.parse(xor.decode(maybe_data as string)) as T;

		return data;
	} else {
		return default_data;
	}
}

export function addData<T>(url: string, data: T): string {
	const encoded_data = encodeURIComponent(xor.encode(JSON.stringify(data)));
	return `${url}?data=${encoded_data}`;
}