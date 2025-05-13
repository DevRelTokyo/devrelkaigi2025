import { useParams } from "@remix-run/react";
import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import { setLang } from "~/utils/i18n";
import { RemixHead } from "remix-head";
import Breadcrumb from "~/components/breadcrumb";

import "./page.css";
import "~/types/page.d";

import * as WhatIsDevRelKaigiEn from "~/pages/en/what-is-devrelkaigi.mdx";
import * as WhatIsDevRelKaigiJa from "~/pages/ja/what-is-devrelkaigi.mdx";

const getPage = (locale: string, page: string) => {
  if (page === 'what-is-devrelkaigi') {
    return locale === 'en' ?
      WhatIsDevRelKaigiEn :
      WhatIsDevRelKaigiJa;
  }
  return undefined;
};

export default function Page() {
  const { locale, page } = useParams();
  const { t } = setLang(locale || 'en');
  const pageData = getPage(locale!, page!);
  if (!pageData) return <div>404</div>;
  const Component = pageData.default;
  const meta = pageData.meta;
  return (
    <>
      <Navi />
      <div className="container"
        style={{
          paddingTop: '150px',
          paddingBottom: '40px',
        }}
      >
        <div className="row">
          <div className="col-8 offset-2">
            <>
              <RemixHead>
                <title>{`${meta.title} - DevRelKaigi 2025`}</title>
              </RemixHead>
              <Breadcrumb items={[
                { label: t('Home'), href: `/${locale}` },
                { label: meta.title || 'Page' }
              ]} />
              <div className="page-body">
                <Component />
              </div>
            </>
          </div>
        </div>
      </div>
      <FooterMain />
      <FooterSub />
    </>
  );
}