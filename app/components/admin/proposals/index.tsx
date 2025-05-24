import { useParams, useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";
import Message, { MessageProps } from "~/components/message";
import { faEnvelope, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminProposalIndex() {
  const limit = 1000;
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { Parse } = useContext(ParseContext)!;
  const { locale } = params;
  const [user, setUser] = useState<Parse.User | undefined>(undefined);
  const [proposals, setProposals] = useState<Parse.Object[]>([]);
  const [message, setMessage] = useState<MessageProps | undefined>(undefined);
  const [skip, setSkip] = useState(parseInt(searchParams.get('skip') || '0'));
  // const schema = useSchema(locale!);
  const { t } = setLang(locale!);
  useEffect(() => {
    setUser(Parse.User.current());
  }, []);
  useEffect(() => {
    getProposals();
  }, [user, skip]);


  const getProposals = async () => {
    if (!user) return;
    const query = new Parse.Query('Proposal');
    query.equalTo('is_enabled', true);
    query.limit(limit);
    query.skip(skip);
    query.descending('rating');
    const proposals = await query.find() as Parse.Object[];
    // Get user profile
    const userIds = proposals.map(proposal => proposal.get('user').id);
    const profileQuery = new Parse.Query('Profile');
    profileQuery.containedIn('user', userIds);
    profileQuery.limit(limit * 2);
    const profiles = await profileQuery.find() as Parse.Object[];
    proposals.forEach(proposal => {
      const userProfiles = profiles.filter(p => p.get('user').id === proposal.get('user').id);
      if (userProfiles.length === 0) {
        const profile = new Parse.Object('Profile');
        profile.set('user', proposal.get('user'));
        profile.set('lang', proposal.get('lang'));
        profile.set('name', proposal.get('user').get('username'));
        proposal.set('profile', profile);
        return;
      }
      const userProfile = userProfiles.find(p => p.get('lang') === proposal.get('lang')) || userProfiles[0];
      proposal.set('profile', userProfile);
    });
    setProposals(proposals);
  };

  const updateRating = async () => {
    await Parse.Cloud.run('updateRating');
    setMessage({
      type: 'success',
      messages: [t('Ratings updated')],
    });
    setTimeout(() => {
      setMessage(undefined);
    }, 3000);
    getProposals();
  }

  const acceptProposal = async (proposal: Parse.Object) => {
    await Parse.Cloud.run('acceptProposal', { proposalId: proposal.id });
    getProposals();
  }

  const rejectProposal = async (proposal: Parse.Object) => {
    await Parse.Cloud.run('rejectProposal', { proposalId: proposal.id });
    getProposals();
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
          <Message message={message} />
          <div className="row">
            <div className="col-8 offset-2">
              <div className="row">
                <div className="col-8">
                  <h2>{t('Proposals')}</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-12 d-flex justify-content-end">
                  <button onClick={updateRating} className={`btn mx-2 btn-primary`}>Update ratings</button>
                </div>
              </div>
            </div>
            <div className="col-10 offset-1">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th style={{ whiteSpace: 'nowrap' }}>{t('Language')}</th>
                    <th style={{ whiteSpace: 'nowrap' }}>{t('Category')}</th>
                    <th style={{ whiteSpace: 'nowrap' }}>{t('Session Title')}</th>
                    <th style={{ whiteSpace: 'nowrap' }}>{t('Name')}</th>
                    <th style={{ whiteSpace: 'nowrap' }}>{t('Email')}</th>
                    <th style={{ whiteSpace: 'nowrap' }}>{t('Rating')}</th>
                    <th style={{ whiteSpace: 'nowrap' }}>{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((proposal, index) => (
                    <>
                      <tr key={index}>
                        <td>
                          {t(proposal.get('lang'))}
                        </td>
                        <td>
                          {proposal.get('category')}
                        </td>
                        <td>
                          {proposal.get('title')}
                        </td>
                        <td>
                          {proposal.get('profile')?.get('name')}
                        </td>
                        <td>
                          {proposal.get('profile')?.get('email') ?
                            <FontAwesomeIcon icon={faEnvelope} style={{ width: 25, height: 25, color: 'blue' }} />
                            :
                            ''
                          }
                        </td>
                        <td>
                          {proposal.get('rating').toFixed(2)}
                        </td>
                        <td>
                          {typeof proposal.get('responseStatus') !== 'undefined' ? (
                            proposal.get('responseStatus') ?
                              <span className="text-success">{t('Accepted')}</span>
                              :
                              <span className="text-danger">{t('Rejected')}</span>
                          ) : (
                            proposal.get('review') ?
                              <span className="text-warning">{t('Done')}</span>
                              :
                              <div className="row">
                                <div className="col-6">
                                  <button className="btn btn-sm" onClick={() => acceptProposal(proposal)}>
                                    <FontAwesomeIcon icon={faThumbsUp} style={{ width: 25, height: 25, color: 'green' }} />
                                  </button>
                                </div>
                                <div className="col-6">
                                  <button className="btn btn-sm" onClick={() => rejectProposal(proposal)}>
                                    <FontAwesomeIcon icon={faThumbsDown} style={{ width: 25, height: 25, color: 'red' }} />
                                  </button>
                                </div>
                              </div>
                          )}
                        </td>
                      </tr >
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-8 offset-2">
              <div className="row">
                <div className="col-12 d-flex justify-content-between">
                  <button className="btn btn-primary" disabled={skip === 0}
                    onClick={() => setSkip(skip - limit)}
                  >
                    {t('Previous')}
                  </button>
                  <button className="btn btn-primary" disabled={proposals.length < limit}
                    onClick={() => setSkip(skip + limit)}
                  >
                    {t('Next')}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div >
      </>
      :
      <>{t('Loading...')}</>
  );
}