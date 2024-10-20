import { createRoute } from 'honox/factory'
import Show from '../../proposals/show';
import { getLang, useI18n } from "../../../i18n";
export default createRoute(async (c) => {
	const { path } = c.req;
	const id = c.req.param('id');
  const { t } = useI18n(path);
	const lang = getLang(path);
  return c.render(
    <Show
			objectId={id}
      lang={lang}
    />,
    { title: t('Proposal detail - DevRelKaigi 2025') }
  )
})
