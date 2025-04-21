import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { MetaFunction, json } from "@remix-run/react";
import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import Form from "~/components/proposals/form";
import { setLang } from "~/utils/i18n";
import { ServerRuntimeMetaArgs } from "@remix-run/server-runtime";
import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { UserContext } from "~/contexts/user";

interface MetaProps {
  title: string;
  description: string;
}

export const meta: MetaFunction = ({ data }: ServerRuntimeMetaArgs) => {
	const { title, description } = data as MetaProps;
  return [
    { title },
    { name: "description", content: description },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { locale } = params;
  const { t } = setLang(locale!);
  return json({
    title: t('New proposal | DevRelKaigi 2025'),
    description: t("Create new proposal"),
  });
}

export default function New() {
  const { Parse } = useContext(ParseContext)!;
  const { user } = useContext(UserContext)!;
  const [cfp, setCFP] = useState<Parse.Object | undefined>(undefined);

  const getCFP = async () => {
		const query = new Parse.Query('CFP');
		query.lessThanOrEqualTo('start_at', new Date());
		query.greaterThanOrEqualTo('end_at', new Date());
    const cfp = await query.first();
		setCFP(cfp);
	};
  
	useEffect(() => {
		getCFP();
	}, []);

	useEffect(() => {
		getCFP();
	}, [user]);
  
	return (
		<>
      <Navi />
			<Form cfp={cfp} />
      <FooterMain />
      <FooterSub />
		</>
	);
}