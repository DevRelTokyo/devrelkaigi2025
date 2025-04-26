import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams, useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";

export default function AdminArticleIndex() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { Parse } = useContext(ParseContext)!;
  const { locale } = params;
  const [user, setUser] = useState<Parse.User | undefined>(undefined);
  const [articles, setArticles] = useState<Parse.Object[]>([]);
  // const schema = useSchema(locale!);
  const { t } = setLang(locale!);
  useEffect(() => {
    setUser(Parse.User.current());
  }, []);
  useEffect(() => {
    getArticles();
  }, [user]);

  const deleteArticle = async (article: Parse.Object) => {
    if (!window.confirm(t('Are you sure you want to delete this article?'))) return;
    try {
      await article.destroy();
      setArticles(articles.filter(a => a.id !== article.id));
    } catch (error) {
      console.error(error);
    }
  };

  const getArticles = async () => {
    if (!user) return;
    const query = new Parse.Query('Article');
    query.limit(parseInt(searchParams.get('limit') || '10'));
    query.skip(parseInt(searchParams.get('skip') || '0'));
    const articles = await query.find() as Parse.Object[];
    setArticles(articles);
  };

  return (
    user ?
      <>
        <div className="container"
          style={{
            paddingTop: '150px',
            paddingBottom: '40px',
          }}
        >
          <div className="row">
            <div className="col-8 offset-2">
              <div className="row">
                <div className="col-8">
                  <h2>{t('Articles')}</h2>
                </div>
                <div className="col-4">
                  <Link to={`/${locale}/admin/articles/new`} className="btn btn-primary">{t('New article')}</Link>
                </div>
              </div>
            </div>
            <div className="col-8 offset-2">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t('Language')}</th>
                    <th>{t('Article Title')}</th>
                    <th>{t('Published at')}</th>
                    <th>{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article, index) => (
                    <tr key={index}>
                      <td>
                        {t(article.get('lang'))}
                      </td>
                      <td>
                        {article.get('publishedAt') ?
                          <Link to={`/${article.get('lang')}/articles/${article.get('slug')}`}>
                            {article.get('title')}
                          </Link>
                          :
                          article.get('title')
                        }
                      </td>
                      <td>{article.get('publishedAt') ? article.get('publishedAt').toLocaleString(locale) : ''}</td>
                      <td>
                        <Link to={`/${locale}/admin/articles/${article.id}/edit`}>
                          <FontAwesomeIcon icon={faPenToSquare} style={{ width: 25, height: 25 }} />
                        </Link>
                        <button className="btn" onClick={() => deleteArticle(article)}>
                          <FontAwesomeIcon icon={faTrash} style={{ width: 25, height: 25, color: 'red' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </>
      :
      <>{t('Loading...')}</>
  );
}