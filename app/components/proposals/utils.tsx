import type { Parse } from '~/parse';

export const editable = (cfp: Parse.Object | undefined) => {
	if (!cfp) return false;
	const startAt = cfp.get('start_at');
	const endAt = cfp.get('end_at');
	const now = new Date();
	return startAt < now && now < endAt;
}
