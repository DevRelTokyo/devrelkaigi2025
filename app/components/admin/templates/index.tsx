import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams, useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";

export default function AdminTemplateIndex() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { Parse } = useContext(ParseContext)!;
  const { locale } = params;
  const [user, setUser] = useState<Parse.User | undefined>(undefined);
  const [templates, setTemplates] = useState<Parse.Object[]>([]);
  const { t } = setLang(locale!);

  useEffect(() => {
    setUser(Parse.User.current());
  }, []);

  useEffect(() => {
    getTemplates();
  }, [user]);

  const deleteTemplate = async (template: Parse.Object) => {
    if (!window.confirm(t('Are you sure you want to delete this template?'))) return;
    try {
      await template.destroy();
      setTemplates(templates.filter(t => t.id !== template.id));
    } catch (error) {
      console.error(error);
    }
  };

  const getTemplates = async () => {
    if (!user) return;
    const query = new Parse.Query('EmailTemplate');
    query.limit(parseInt(searchParams.get('limit') || '100'));
    query.skip(parseInt(searchParams.get('skip') || '0'));
    const templates = await query.find() as Parse.Object[];
    setTemplates(templates);
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
                  <h2>{t('Email Templates')}</h2>
                </div>
                <div className="col-4">
                  <Link to={`/${locale}/admin/templates/new`} className="btn btn-primary">{t('New template')}</Link>
                </div>
              </div>
            </div>
            <div className="col-8 offset-2">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t('Slug')}</th>
                    <th>{t('Subject')}</th>
                    <th>{t('Language')}</th>
                    <th>{t('Created at')}</th>
                    <th>{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template, index) => (
                    <tr key={index}>
                      <td>{template.get('slug')}</td>
                      <td>{template.get('subject')}</td>
                      <td>{t(template.get('locale'))}</td>
                      <td>{template.createdAt?.toLocaleString(locale)}</td>
                      <td>
                        <Link to={`/${locale}/admin/templates/${template.id}/edit`}>
                          <FontAwesomeIcon icon={faPenToSquare} style={{ width: 25, height: 25 }} />
                        </Link>
                        <button className="btn" onClick={() => deleteTemplate(template)}>
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