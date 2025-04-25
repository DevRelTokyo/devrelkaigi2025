import { useParams } from "@remix-run/react";
import { useContext } from "react";
import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";
import { useSSR } from "next-ssr";
import markdownIt from "markdown-it";
import { RemixHead } from "remix-head";
import { Article } from "~/types/article";
import Breadcrumb from "~/components/breadcrumb";

export default function ArticleEdit() {
  const md = markdownIt();
  const { Parse } = useContext(ParseContext)!;
  const { locale, slug } = useParams();
  const { t } = setLang(locale!);
  const { data, isLoading } = useSSR<Article | undefined>(async () => {
    const query = new Parse.Query('Article');
    query.equalTo('lang', locale);
    query.equalTo('slug', slug);
    query.lessThanOrEqualTo('publishedAt', new Date());
    const data = await query.first();
    return data ? data.toJSON() as Article : undefined;
  }, { key: JSON.stringify({ locale, slug }) });
  if (!data) return <div>loading...</div>;
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
            { data && (
              <>
                <RemixHead>
                  <title>{`${data.title} - DevRelKaigi 2025`}</title>
                </RemixHead>
                <Breadcrumb items={[
                  { label: t('Home'), href: `/${locale}` },
                  { label: t('Articles'), href: `/${locale}/articles` },
                  { label: data.title! }
                ]} />
                <h1>{data.title}</h1>
                <div
                  className="article-body"
                  dangerouslySetInnerHTML={{ __html: md.render(data.body as string) }}
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