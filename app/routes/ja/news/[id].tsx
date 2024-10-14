import { createRoute } from 'honox/factory'
import Show from '../../../components/news/show';
import fs from 'fs';
import path from 'path';
import NotFound from '../../../components/404';
import { getLang } from '../../../i18n';

const resolveFilePath = (filePath: string): string | null => {
	const bol = fs.existsSync(filePath);
	return bol ? fs.readFileSync(filePath, "utf-8") : null;
};

const resolveArticle = (id: string, lang: string) => {
	const basePath = path.resolve(`./app/news/${id}`);
	return resolveFilePath(`${basePath}.${lang}.md`) || resolveFilePath(`${basePath}.en.md`)
};

export default createRoute((c) => {
	const id = c.req.param('id');
	const lang = getLang(c.req.path);
	const content = resolveArticle(id, lang);
	if (!content) {
		c.status(404);
		return c.render(
			<NotFound lang={lang} />
		);
	}
	// Parse YAML to JSON

	const article = {
		title: 'test',
		body: 'test',
		createdAt: 'test',
		updatedAt: 'test',
		author: 'test',
		category: 'test',
	};
  return c.render(
    <Show
			lang={lang}
			article={article} />,
    { title: `${article.title} | DevRelKaigi 2025` }
  )
})
