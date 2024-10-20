import { createRoute } from 'honox/factory'
import Show from '../../members/show';
import { getLang, useI18n } from "../../../i18n";
import { Parse } from '../../../parse';

export default createRoute(async (c) => {
	const { path } = c.req;
	const id = c.req.param('id');
  const { t } = useI18n(path);
	const lang = getLang(path);
	const query = new Parse.Query('Profile');
	query.equalTo('slug', id);
	query.equalTo('lang', lang);
	const member = await query.first();
	if (!member) {
		c.status(404);
		c.render('Not Found');
		return;
	}
	console.log(member);
  return c.render(
    <Show
			member={member}
      lang={lang}
    />,
    { title: t(`${member.get('name')} - DevRelKaigi 2025`)}
  )
})
