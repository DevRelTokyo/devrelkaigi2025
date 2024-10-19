import { createRoute } from 'honox/factory'
import Edit from '../../profiles/edit';
import { getLang, useI18n } from "../../../i18n";
export default createRoute(async (c) => {
	const { path } = c.req;
  const { t } = useI18n(path);
	const lang = getLang(path);
  return c.render(
    <Edit
      lang={lang}
    />,
    { title: t('Edit profile - DevRelKaigi 2025') }
  )
})
