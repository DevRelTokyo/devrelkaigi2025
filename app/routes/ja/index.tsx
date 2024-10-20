import { createRoute } from 'honox/factory'
import Index from '..'
import { getLang, useI18n } from "../../i18n";
import { getArticles } from '../../parse/article';

export default createRoute(async (c) => {
  console.log(import.meta.env);
  const { path } = c.req;
  const { t } = useI18n(path);
  const lang = getLang(path);
  const articles = await getArticles(lang, 3);
  return c.render(
    <Index
      lang={lang}
      articles={articles}
    />,
    { title: t('DevRelKaigi 2025') }
  )
})
