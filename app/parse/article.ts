import { Parse } from '.';

export const getArticles = (lang: string, limit: number) => {
	const query = new Parse.Query('Article');
	query.descending('createdAt');
	query.equalTo('lang', lang);
	query.limit(limit);
	return query.find();
}