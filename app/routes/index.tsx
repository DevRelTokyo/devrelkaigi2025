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
  ogImageUrl: string;
  currentUrl: string;
}
export const meta: MetaFunction = ({ data }: ServerRuntimeMetaArgs) => {
  const { title, description, ogImageUrl, currentUrl } = data as MetaProps;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: currentUrl },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImageUrl },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { locale } = params;
  const { t } = setLang(locale!);
  const url = new URL(request.url);
  const ogImageUrl = `${url.origin}/assets/images/ogp.jpg`;
  
  return json({
    title: t("DevRelKaigi 2025"),
    description: t(
      "DevRelKaigi is an international conference of developer relations from Tokyo with ❤️."
    ),
    ogImageUrl,
    currentUrl: request.url,
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
