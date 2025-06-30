import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { ServerRuntimeMetaArgs } from "@remix-run/server-runtime";
import About from "~/components/about";
import Banner from "~/components/banner";
import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import Price from "~/components/priceTable";
import Schedule from "~/components/schedule";
import Speakers from "~/components/speakers";
import Sponsors from "~/components/sponsors";
import Subscribe from "~/components/subscribe";
import Organizers from "~/components/organizers";
import MapView from "~/components/mapView";
import { setLang } from "~/utils/i18n";

interface MetaProps {
  title: string;
  description: string;
}
export const meta: MetaFunction = ({ data }: ServerRuntimeMetaArgs) => {
  const { title, description } = data as MetaProps;
  return [{ title }, { name: "description", content: description }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { locale } = params;
  const { t } = setLang(locale!);
  return json({
    title: t("DevRelKaigi 2025"),
    description: t(
      "DevRelKaigi is an international conference of developer relations from Tokyo with ❤️."
    ),
  });
}

export default function Index() {
  return (
    <>
      <Navi />
      <Banner />
      <About />
      <Speakers />
      <Schedule />
      <Price />
      <Sponsors />
      <Subscribe />
      <MapView />
      <Organizers />
      <FooterMain />
      <FooterSub />
    </>
  );
}
