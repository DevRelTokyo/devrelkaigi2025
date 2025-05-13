import { useParams } from "@remix-run/react";
import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import { setLang } from "~/utils/i18n";
import { useSSR } from "next-ssr";
import markdownIt from "markdown-it";
import { RemixHead } from "remix-head";
import Breadcrumb from "~/components/breadcrumb";
import fs from "fs";
import path from "path";
import yaml from "yaml";

interface PageResponse {
  meta: {
    title: string;
    date: string;
  };
  body: string;
}

export default function Page() {
  const md = markdownIt();
  const { locale, page } = useParams();
  const { t } = setLang(locale!);
  const { data, isLoading } = useSSR<PageResponse | undefined>(async () => {
    const filePath = path.join(process.cwd(), 'app', 'pages', `${locale}`, `${page}.md`);
    try {
      const file = fs.readFileSync(filePath, 'utf8');
      const [_, metaData, body] = file.split('---');
      const meta = yaml.parse(metaData);
      return {
        meta,
        body: body
      };
    } catch (error) {
      return undefined;
    }
  }, { key: JSON.stringify({ locale, page }) });
  if (!data) return <div>loading...</div>;
  const { meta, body } = data;
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
            {isLoading && (
              <div>loading</div>
            )}
            {data && (
              <>
                <RemixHead>
                  <title>{`${meta.title} - DevRelKaigi 2025`}</title>
                </RemixHead>
                <Breadcrumb items={[
                  { label: t('Home'), href: `/${locale}` },
                  { label: meta.title! }
                ]} />
                <div
                  className="article-body"
                  dangerouslySetInnerHTML={{ __html: md.render(body as string) }}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <FooterMain />
      <FooterSub />
    </>
  );
}