import { createRoute } from 'honox/factory'
import New from '../../proposals/new';
import { getLang, useI18n } from "../../../i18n";
import { newProposal } from '../../../parse/proposal';

export default createRoute(async (c) => {
	const { path } = c.req;
  const { t } = useI18n(path);
	const lang = getLang(path);
  const proposal = newProposal();
  return c.render(
    <New
      lang={lang}
      proposal={proposal}
    />,
    { title: t('New proposal - DevRelKaigi 2025') }
  )
})
