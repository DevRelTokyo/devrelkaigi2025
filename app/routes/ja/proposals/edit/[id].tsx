import { createRoute } from 'honox/factory'
import Edit from '../../../proposals/edit';
import { getLang, useI18n } from "../../../../i18n";
export default createRoute(async (c) => {
	const { path } = c.req;
	const id = c.req.param('id');
  const { t } = useI18n(path);
	const lang = getLang(path);
  return c.render(
    <Edit
			objectId={id}
      lang={lang}
    />,
    { title: t('New proposal - DevRelKaigi 2025') }
  )
})
