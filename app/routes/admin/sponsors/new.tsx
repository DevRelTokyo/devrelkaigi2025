import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { MetaFunction, json } from "@remix-run/react";
import { ServerRuntimeMetaArgs } from "@remix-run/server-runtime";
import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import SponsorForm from "~/components/admin/sponsors/form";
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
    title: t('Create sponsor | DevRelKaigi 2025'),
    description: t("Create sponsor for DevRelKaigi 2025"),
  });
}

export default function SponsorNew() {
  return (
    <>
      <Navi />
      <SponsorForm />
      <FooterMain />
      <FooterSub />
    </>
  );
}