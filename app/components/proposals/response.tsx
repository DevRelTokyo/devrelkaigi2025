import { setLang } from '~/utils/i18n';
import { Link, useParams } from '@remix-run/react';
import { useContext, useEffect, useState } from 'react';
import { ParseContext } from '~/contexts/parse';
import { Icon } from '@iconify/react/dist/iconify.js';
import { UserContext } from '~/contexts/user';
import ProfileMessage from '../profiles/message';
import Message, { MessageProps } from '~/components/message';

export default function ProposalForm() {
  const { Parse } = useContext(ParseContext)!;
  const { login, user } = useContext(UserContext)!;
  const params = useParams();
  const { locale, id } = params;
  const { t } = setLang(locale!);
  const [proposal, setProposal] = useState<Parse.Object | undefined>();
  const [message, setMessage] = useState<MessageProps | undefined>(undefined);

  useEffect(() => {
    getProposal();
  }, [user]);

  const getProposal = async () => {
    if (!id) {
      return setProposal(new Parse.Object('Proposal'));
    }
    const query = new Parse.Query('Proposal');
    query.greaterThanOrEqualTo('deadline', new Date());
    query.equalTo('responseStatus', undefined);
    query.equalTo('key', id);
    const proposal = await query.first();
    setProposal(proposal);
  };

  const responseProposal = async (response: boolean) => {
    if (!proposal) return;
    proposal.set('responseStatus', response);
    try {
      await proposal.save();
      const message = response ? t('Thank you for accepting to speak at DevRelKaigi!') : t('Thank you for your response!');
      setMessage({
        type: 'success',
        messages: [message]
      });
      await Parse.Cloud.run('sendResponseEmail', {
        proposalId: proposal.id,
      });
    } catch (error) {
      setMessage({
        type: 'danger',
        messages: [t(`You can't response to this proposal anymore!`)]
      });
    }
    setTimeout(() => {
      setMessage(undefined);
    }, 3000);
  }

  return (
    <>
      {user ? (
        <div className="container"
          style={{
            paddingTop: '150px',
            paddingBottom: '40px',
          }}
        >
          <>
            <ProfileMessage locale={locale!} />
            <div className="row">
              <div className="col-8 offset-2">
                <h2>
                  {t('Response about proposal')}
                </h2>
              </div>
              <div className="col-8 offset-2">
                <div className="alert alert-primary" role="alert">
                  {locale === 'ja' ?
                    (<>
                      If you want change the locale to English, <Link to={`/en/proposals/${id}/response`}>please click here</Link>.
                    </>)
                    :
                    <>
                      もし言語を日本語に切り替えたい場合には、<Link to={`/ja/proposals/${id}/response`}>こちらをクリック</Link>してください
                    </>
                  }
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-8 offset-2">
                <Message message={message} />
                {proposal ?
                  <>
                    <div className="row">
                      <div className="col-12">
                        <h4>Proposal title</h4>
                      </div>
                      <div className="col-12">
                        {proposal.get('title')}
                      </div>
                    </div>
                    <div className="row text-center" style={{ paddingTop: '2em' }}>
                      <div className="col-3 offset-3">
                        <button className="btn btn-danger" onClick={() => responseProposal(false)}>Reject</button>
                      </div>
                      <div className="col-3">
                        <button className="btn btn-success" onClick={() => responseProposal(true)}>Accept</button>
                      </div>
                    </div>
                  </>
                  :
                  <div className="row">
                    <div className="col-12">
                      <h4>Proposal not found, or you have already responded to this proposal.</h4>
                    </div>
                  </div>
                }
              </div>
            </div>
          </>
        </div>
      ) : (
        <div className="container"
          style={{
            paddingTop: '150px',
            paddingBottom: '150px',
          }}
        >
          <div className="row">
            <div className="col-8 offset-2">
              <h2>{t('Please sign up or sign in to send proposal')}</h2>
            </div>
            <div className="col-8 offset-2 text-center"
              style={{ paddingTop: '2em', paddingBottom: '2em' }}
            >
              <button type="button" className="btn btn-primary"
                onClick={() => login('github')}
              >
                Sign in with <Icon icon="mdi:github" style={{ fontSize: '2em' }} />
              </button>
              {' '}
              <button type="button" className="btn btn-primary"
                onClick={() => login('google')}
              >
                Sign in with <Icon icon="mdi:google" style={{ fontSize: '2em' }} />
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}