import { createRoute } from 'honox/factory'
import New from '../../proposals/new';
import { getLang, useI18n } from "../../../i18n";
export default createRoute(async (c) => {
	const { path } = c.req;
  const { t } = useI18n(path);
	const lang = getLang(path);
  return c.render(
    <New
      lang={lang}
    />,
    { title: t('New proposal - DevRelKaigi 2025') }
  )
})
