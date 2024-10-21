import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { json, ServerRuntimeMetaArgs } from "@remix-run/server-runtime";
import FooterMain from '~/components/footerMain';
import FooterSub from '~/components/footerSub';

import Show from '~/components/members/show';
import Navi from '~/components/navi';
import { ENV } from '~/types/env';
import { Profile, ProfileResult } from '~/types/profile';
import { setLang } from '~/utils/i18n';

interface MetaProps {
  title: string;
  description: string;
	member: Profile;
}
export const meta: MetaFunction = ({ data }: ServerRuntimeMetaArgs) => {
	const { title, description } = data as MetaProps;
  return [
    { title },
    { name: 'description', content: description },
  ];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { locale, slug } = params;
	const { env } = (context as { cloudflare: ENV }).cloudflare;
	const res = await fetch(`${env.PARSE_SERVER_URL}/classes/Profile`, {
		headers: {
			"content-type": "applicaiton/json",
		},
		body: JSON.stringify({
			where: {
				lang: locale,
				slug,
			},
			limit: 1,
			_method: 'GET',
			_ApplicationId: env.PARSE_APP_ID,
			_JavaScriptKey: env.PARSE_JS_KEY,
		}),
		method: 'POST',
	});
	const results = await res.json() as ProfileResult;
	const member = results.results[0];
	if (!member) {
		return new Response('Not Found', { status: 404 });
	}
  const { t } = setLang(locale!);
  return json({
    title: t('__name__ | DevRelKaigi 2025').replace('__name__', member.name),
    description: t('This ia __name__\'s profile page.').replace('__name__', member.name),
		member,
  });
}

export default function ProfileShow() {
	const data = useLoaderData<typeof loader>() as MetaProps;
  return (<>
		<Navi />
		<Show
			member={data.member}
		/>
		<FooterMain />
		<FooterSub />
	</>);
}
