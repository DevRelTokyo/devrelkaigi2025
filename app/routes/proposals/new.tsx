import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { MetaFunction, json } from "@remix-run/react";
import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import Form from "~/components/proposals/form";
import { setLang } from "~/utils/i18n";
import { ServerRuntimeMetaArgs } from "@remix-run/server-runtime";

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
	return (
		<>
      <Navi />
			<Form />
      <FooterMain />
      <FooterSub />
		</>
	);
}