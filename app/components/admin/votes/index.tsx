import { faCheckToSlot, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { useParams, useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";
import markdownit from 'markdown-it'
import Message, { MessageProps } from "~/components/message";

const md = markdownit();

export default function AdminVoteIndex() {
  const limit = 1000;
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { Parse } = useContext(ParseContext)!;
  const { locale } = params;
  const [user, setUser] = useState<Parse.User | undefined>(undefined);
  const [proposals, setProposals] = useState<Parse.Object[]>([]);
  const [visibleProposals, setVisibleProposals] = useState<Parse.Object[]>([]);
  const [message, setMessage] = useState<MessageProps | undefined>(undefined);
  const [skip, setSkip] = useState(parseInt(searchParams.get('skip') || '0'));
  const [selectedProposal, setSelectedProposal] = useState<Parse.Object | undefined>(undefined);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [visible, setVisible] = useState<string>(searchParams.get('visible') || 'all');
  const [votes, setVotes] = useState<Parse.Object[]>([]);
  // const schema = useSchema(locale!);
  const { t } = setLang(locale!);
  useEffect(() => {
    setUser(Parse.User.current());
  }, []);
  useEffect(() => {
    getProposals();
    getVotes();
  }, [user, skip]);

  const updateVisibleProposals = () => {
    if (visible === 'all') {
      setVisibleProposals(proposals.slice(skip, skip + 10));
      setSelectedProposal(undefined);
    } else {
      setVisibleProposals(proposals
        .filter(proposal => !votes.some(vote => vote.get('proposal').id === proposal.id))
        .slice(skip, skip + 10));
      setSelectedProposal(undefined);
    }
  }

  useEffect(() => {
    console.log('Proposals updated', proposals.length, skip, votes.length);
    updateVisibleProposals();
  }, [proposals, skip, votes]);

  const getProposals = async () => {
    if (!user) return;
    const query = new Parse.Query('Proposal');
    setSkip(skip);
    query.notEqualTo('user', user);
    query.doesNotExist('review');
    query.limit(limit);
    query.skip(skip);
    // query.include('user');
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
      } else if (userProfiles.length === 1) {
        proposal.set('profile', userProfiles[0]);
      } else {
        proposal.set('profile', userProfiles.find(p => p.get('lang') === proposal.get('lang')));
      }
    });
    setProposals(proposals);
  };

  const select = (proposal: Parse.Object) => {
    if (selectedProposal?.id === proposal.id) {
      setSelectedProposal(undefined);
    } else {
      setSelectedProposal(proposal);
    }
    const vote = votes.find(vote => vote.get('proposal').id === proposal.id || vote.get('proposal').objectId === proposal.id);
    if (vote) {
      setRating(vote.get('rating'));
      setComment(vote.get('comment'));
    } else {
      setRating(0);
      setComment('');
    }
  }

  const getVotes = async () => {
    if (!user) return;
    const query = new Parse.Query('Vote');
    query.equalTo('user', user);
    query.limit(limit);
    const votes = await query.find() as Parse.Object[];
    setVotes(votes);
  };

  const submitVote = async () => {
    if (!user) return;
    if (!selectedProposal) {
      setMessage({
        type: 'danger',
        messages: [t('Please select a proposal')],
      });
      setTimeout(() => {
        setMessage(undefined);
      }, 3000);
      return;
    }
    const vote = votes.find(vote => vote.get('proposal').id === selectedProposal.id) || new Parse.Object('Vote');
    if (!vote.id) {
      selectedProposal.unset('profile');
      vote.set('proposal', selectedProposal);
      vote.set('user', user);
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(false);
      acl.setPublicWriteAccess(false);
      acl.setRoleReadAccess('admin', true);
      acl.setRoleWriteAccess('admin', true);
      acl.setReadAccess(user, true);
      acl.setWriteAccess(user, true);
      vote.setACL(acl);
    }
    if (!rating) {
      setMessage({
        type: 'danger',
        messages: [t('Please select a rating')],
      });
      setTimeout(() => {
        setMessage(undefined);
      }, 3000);
      return;
    }
    if (!comment) {
      setMessage({
        type: 'danger',
        messages: [t('Please enter a comment')],
      });
      setTimeout(() => {
        setMessage(undefined);
      }, 3000);
      return;
    }
    vote.set('rating', rating);
    vote.set('comment', comment);
    await vote.save();
    setMessage({
      type: 'success',
      messages: [t('Vote submitted successfully')],
    });
    setTimeout(() => {
      setMessage(undefined);
    }, 3000);
    setRating(0);
    setSelectedProposal(undefined);
    setComment('');
    setVotes([...votes, vote]);
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
                <a
                  href={`/${locale}/admin/votes?skip=${skip}`}
                  className={`btn mx-2 ${visible === 'all' ? 'btn-primary' : ''}`}>
                  All
                </a>
                <a
                  href={`/${locale}/admin/votes?skip=${skip}&visible=unreviewed`}
                  className={`btn mx-2 ${visible === 'unreviewed' ? 'btn-primary' : ''}`}>
                  Only not voted
                </a>
              </div>
            </div>
          </div>
          <div className="col-10 offset-1">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th style={{ whiteSpace: 'nowrap' }}>{t('Language')}</th>
                  <th style={{ whiteSpace: 'nowrap' }}>{t('Level')}</th>
                  <th style={{ whiteSpace: 'nowrap' }}>{t('Category')}</th>
                  <th style={{ whiteSpace: 'nowrap' }}>{t('Session Title')}</th>
                  <th style={{ whiteSpace: 'nowrap' }}>{t('Name')}</th>
                  <th style={{ whiteSpace: 'nowrap' }}>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {visibleProposals.map((proposal, index) => (
                  <>
                    <tr key={index}>
                      <td>
                        {t(proposal.get('lang'))}
                      </td>
                      <td>
                        {proposal.get('level')}
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
                        <button className="btn" onClick={() => select(proposal)}>
                          <FontAwesomeIcon icon={faCheckToSlot} style={{ width: 25, height: 25 }} />
                        </button>
                      </td>
                    </tr>
                    {selectedProposal?.id === proposal.id && (
                      <>
                        <tr>
                          <td colSpan={6}>
                            <div className="card">
                              {selectedProposal.get('profile') && (
                                <div className="card-header">
                                  <h5 className="card-title">{t('Profile')}</h5>
                                  <div className="card-text">
                                    {selectedProposal.get('profile').get('name')}{' by '}
                                    {selectedProposal.get('profile').get('organization')}
                                  </div>
                                </div>
                              )}
                              <div className="card-body">
                                <div className="card-text"
                                     dangerouslySetInnerHTML={{ __html: md.render(selectedProposal.get('description')) }}
                                >
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={6}>
                            <div className="card">
                              <div className="card-body">
                                <form>
                                  <div className="form-group">
                                    <label htmlFor="vote">{t('Vote')}</label><br />
                                    {Array.from({ length: 5 }).map((_, index) => (
                                      <FontAwesomeIcon
                                        key={index}
                                        icon={rating >= index + 1 ? faStarSolid : faStar}
                                        onClick={() => {
                                          setRating(index + 1);
                                        }}
                                        style={{ width: 25, height: 25, color: 'black' }}
                                      />
                                    ))}
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="comment">{t('Comment')}</label>
                                    <textarea
                                      className="form-control"
                                      value={comment}
                                      onChange={(e) => {
                                        setComment(e.target.value);
                                      }}
                                    ></textarea>
                                  </div>
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      submitVote();
                                    }}
                                  >{t('Vote')}</button>
                                </form>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
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

      </div>
    </>
    :
    <>{t('Loading...')}</>
  );}

