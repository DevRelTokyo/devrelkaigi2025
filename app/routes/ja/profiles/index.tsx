import { createRoute } from 'honox/factory'
import { getLang, useI18n } from "../../../i18n";
import Index from '../../profiles';
export default createRoute(async (c) => {
	const { path } = c.req;
  const { t } = useI18n(path);
	const lang = getLang(path);
  return c.render(<>
			<Index lang={lang} />
		</>,
    { title: t('My profiles - DevRelKaigi 2025') }
  )
})
