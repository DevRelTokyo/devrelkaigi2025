import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams, useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";

export default function AdminSponsorIndex() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { Parse } = useContext(ParseContext)!;
  const { locale } = params;
  const [user, setUser] = useState<Parse.User | undefined>(undefined);
  const [sponsors, setSponsors] = useState<Parse.Object[]>([]);
  const { t } = setLang(locale!);
  
  useEffect(() => {
    setUser(Parse.User.current());
  }, []);
  
  useEffect(() => {
    getSponsors();
  }, [user]);

  const deleteSponsor = async (sponsor: Parse.Object) => {
    if (!window.confirm(t('Are you sure you want to delete this sponsor?'))) return;
    try {
      await sponsor.destroy();
      setSponsors(sponsors.filter(s => s.id !== sponsor.id));
    } catch (error) {
      console.error(error);
    }
  };

  const getSponsors = async () => {
    if (!user) return;
    const query = new Parse.Query('Sponsor');
    query.limit(parseInt(searchParams.get('limit') || '10'));
    query.skip(parseInt(searchParams.get('skip') || '0'));
    const sponsors = await query.find() as Parse.Object[];
    setSponsors(sponsors);
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
                  <h2>{t('Sponsors')}</h2>
                </div>
                <div className="col-4">
                  <Link to={`/${locale}/admin/sponsors/new`} className="btn btn-primary">{t('New sponsor')}</Link>
                </div>
              </div>
            </div>
            <div className="col-8 offset-2">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t('Name')}</th>
                    <th>{t('Level')}</th>
                    <th>{t('URL')}</th>
                    <th>{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((sponsor, index) => (
                    <tr key={index}>
                      <td>{sponsor.get('name')}</td>
                      <td>{sponsor.get('level')}</td>
                      <td>
                        {sponsor.get('url') && (
                          <a href={sponsor.get('url')} target="_blank" rel="noopener noreferrer">
                            {sponsor.get('url')}
                          </a>
                        )}
                      </td>
                      <td>
                        <Link to={`/${locale}/admin/sponsors/${sponsor.id}/edit`}>
                          <FontAwesomeIcon icon={faPenToSquare} style={{ width: 25, height: 25 }} />
                        </Link>
                        <button className="btn" onClick={() => deleteSponsor(sponsor)}>
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