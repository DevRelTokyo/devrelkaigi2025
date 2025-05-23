import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import ProposalForm from "~/components/proposals/form";
import { json, LoaderFunctionArgs, ServerRuntimeMetaArgs } from "@remix-run/server-runtime";
import { MetaFunction } from "@remix-run/react";
import { setLang } from "~/utils/i18n";

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
    title: t('Edit proposal | DevRelKaigi 2025'),
    description: t("Edit proposal"),
  });
}

export default function Edit() {
  return (
    <>
      <Navi />
      <ProposalForm />
      <FooterMain />
      <FooterSub />
    </>
  );
}
