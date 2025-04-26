import { setLang } from "~/utils/i18n";
import { useSchema } from "~/schemas/proposal";
import { editable } from "./utils";
import { useState, useEffect, useContext } from "react";
import { useParams } from "@remix-run/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ParseContext } from "~/contexts/parse";

export default function ProposalIndex() {
  const { Parse } = useContext(ParseContext)!;
  const [user, setUser] = useState<Parse.User | undefined>(undefined);

  const [proposals, setProposals] = useState<Parse.Object[]>([]);
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  const schema = useSchema(locale!);
  useEffect(() => {
    setUser(Parse.User.current());
  }, []);
  useEffect(() => {
    getProposals();
  }, [user]);

  const getProposals = async () => {
    if (!user) return;
    const query = new Parse.Query('Proposal');
    query.include('cfp');
    query.equalTo('user', user);
    const proposals = await query.find();
    setProposals(proposals);
  };

  const getLabel = (key: string, value: string) => {
    const field = schema.find(s => s.name === key);
    if (!field) return value;
    const { options } = field;
    const val = options?.find(o => o.value === value);
    return val ? val.label : value;
  };

  const deleteProposal = async (proposal: Parse.Object) => {
    if (!confirm(t('Are you sure?'))) return;
    await proposal.destroy();
    getProposals();
  };

  const truncate = (str: string, len: number = 50) => {
    return str.length <= len ? str : `${str.substring(0, len)}...`;
  }

  return (
    user ?
      <>
        <div className="container"
          style={{
            paddingTop: '150px',
            paddingBottom: '40px',
          }}
        >
          {proposals.length === 0 ?
            (<>
              <div className="row">
                <div className="col-8 offset-2">
                  <h2>{t('My proposals')}</h2>
                </div>
                <div className="col-8 offset-2">
                  <p>{t('You have not submitted any proposals yet.')}</p>
                  <p><a href={`/${locale}/proposals/new`}>{t('Let\'s send a proposal here!')}</a></p>
                </div>
              </div>
            </>)
            :
            (<>
              <div className="row">
                <div className="col-8 offset-2">
                  <div className="row">
                    <div className="col-8">
                      <h2>{t('My proposals')}</h2>
                    </div>
                    <div className="col-4 text-right">
                      <a href={`/${locale}/proposals/new`}
                        className="btn btn-primary"
                      >{t('Send a proposal')}</a>
                    </div>
                  </div>
                </div>
                <div className="col-8 offset-2">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>{t('Year')}</th>
                        <th>{t('Session Title')}</th>
                        <th>{t('Level')}</th>
                        <th>{t('Category')}</th>
                        <th>{t('Status')}</th>
                        <th>{t('Actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposals.map((proposal, i) => (
                        <tr key={i}>
                          <td>
                            {proposal.get('cfp')?.get('year')}
                          </td>
                          <td>
                            <a href={`/${proposal.get('lang')}/proposals/${proposal.id}`}>
                              {truncate(proposal.get('title'), 50)}
                            </a>
                          </td>
                          <td>{getLabel('level', proposal.get('level'))}</td>
                          <td>{getLabel('category', proposal.get('category'))}</td>
                          <td>{t(proposal.get('status'))}</td>
                          <td>
                            {editable(proposal.get('cfp')) ? (
                              <>
                                <a href={`/${proposal.get('lang')}/proposals/${proposal.id}/edit`}>
                                  <FontAwesomeIcon icon={faPenToSquare} style={{ width: 25, height: 25, color: 'black' }} />
                                </a>
                                {' '}
                                <button
                                  onClick={() => deleteProposal(proposal)}
                                  style={{ border: 'none', background: 'none' }}
                                >
                                  <FontAwesomeIcon icon={faTrash} style={{ width: 25, height: 25 }} />
                                </button>
                              </>
                            ) : (
                              <FontAwesomeIcon icon={faPenToSquare} style={{ width: 25, height: 25, color: '#ccc' }} />
                            )
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>)
          }
        </div>
      </>
      :
      <>{t('Loading...')}</>
  );
}