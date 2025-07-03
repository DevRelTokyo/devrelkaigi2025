import { faReply, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams, useSearchParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";

export default function AdminEmailIndex() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { Parse } = useContext(ParseContext)!;
  const { locale } = params;
  const [user, setUser] = useState<Parse.User | undefined>(undefined);
  const [emails, setEmails] = useState<Parse.Object[]>([]);
  const [replyEmail, setReplyEmail] = useState<Parse.Object | undefined>(undefined);
  const [selectedEmail, setSelectedEmail] = useState<Parse.Object | undefined>(undefined);
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const [body, setBody] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<{ type: string, messages: string[] } | undefined>(undefined);
  // const schema = useSchema(locale!);
  const { t } = setLang(locale!);
  useEffect(() => {
    setUser(Parse.User.current());
  }, []);
  useEffect(() => {
    getEmails();
  }, [user]);

  const deleteEmail = async (email: Parse.Object) => {
    if (!window.confirm(t('Are you sure you want to delete this email?'))) return;
    try {
      email.set('deleted', true);
      await email.save();
      getEmails();
    } catch (error) {
      console.error(error);
    }
  };

  const getEmails = async () => {
    if (!user) return;
    const query = new Parse.Query('Contact');
    query.descending('createdAt');
    query.notEqualTo('deleted', true);
    query.doesNotExist('contact');
    query.limit(parseInt(searchParams.get('limit') || '10'));
    query.skip(parseInt(searchParams.get('skip') || '0'));
    const emails = await query.find() as Parse.Object[];
    setEmails(emails);
  };

  const toQuote = (body: string) => {
    return body.split('\n').slice(1).map((line) => `> ${line}`).join('\n');
  };

  const toSubject = (body: string) => {
    return `Re: ${body.split('\n')[0]}`;
  };

  const sendEmail = async (email: Parse.Object) => {
    const contact = new Parse.Object('Contact');
    contact.set('email', email.get('email'));
    contact.set('name', 'From email');
    contact.set('lang', email.get('lang') || 'en');
    contact.set('category', 'reply');
    contact.set('contact', email);
    contact.set('reply', true);
    contact.set('subject', subject);
    contact.set('body', body);
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setRoleWriteAccess(`Organizer${window.ENV.YEAR}`, true);
    acl.setRoleReadAccess(`Organizer${window.ENV.YEAR}`, true);
    acl.setRoleReadAccess('Admin', true);
    acl.setRoleReadAccess('Admin', true);
    contact.setACL(acl);
    await contact.save();
    setMessage({ type: 'success', messages: [t('Email sent successfully')] });
    setTimeout(() => {
      setMessage(undefined);
    }, 3000);
    setReplyEmail(undefined);
    setSubject(undefined);
    setBody(undefined);
    getEmails();
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
            {message && (
              <div className={`alert alert-${message.type}`} role="alert"
                style={{
                  position: "fixed",
                  top: "50px",
                  right: "50px",
                  width: "600px",
                  zIndex: 9999,
                  borderRadius: "0px",
                }}
              >
                <ul
                  style={{ listStyleType: 'none', padding: 0 }}
                >
                  {message.messages.map((msg: string, i: number) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="col-8 offset-2">
              <div className="row">
                <div className="col-8">
                  <h2>{t('Emails')}</h2>
                </div>
              </div>
            </div>
            <div className="col-8 offset-2">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t('Reply')}</th>
                    <th>{t('Email')}</th>
                    <th>{t('Title')}</th>
                    <th>{t('Created at')}</th>
                    <th>{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email, index) => (
                    <>
                      <tr key={index}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          {email.get('reply') ? t('✔️') : t('')}
                        </td>
                        <td
                          style={{
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {email.get('email')}
                        </td>
                        <td
                          style={{
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <button
                            onClick={() => setSelectedEmail(selectedEmail && selectedEmail.id === email.id ? undefined : email)}
                            className="btn"
                          >
                            {(email.get('body') || '').split('\n')[0]}
                          </button>
                        </td>
                        <td>{email.get('createdAt') ? email.get('createdAt').toLocaleString(locale) : ''}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => {
                              if (replyEmail && replyEmail.id === email.id) {
                                setReplyEmail(undefined);
                                setSubject(undefined);
                                setBody(undefined);
                              } else {
                                setReplyEmail(email);
                                setSubject(toSubject(email.get('body')!));
                                setBody(toQuote(email.get('body')!));
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faReply} style={{ width: 25, height: 25 }} />
                          </button>
                          <button className="btn" onClick={() => deleteEmail(email)}>
                            <FontAwesomeIcon icon={faTrash} style={{ width: 25, height: 25, color: 'red' }} />
                          </button>
                        </td>
                      </tr>
                      {selectedEmail && selectedEmail.id === email.id && (
                        <>
                          <tr>
                            <td colSpan={5}
                              style={{
                                backgroundColor: '#ccc',
                                padding: '10px',
                              }}
                            >
                              <div dangerouslySetInnerHTML={{ __html: email.get('body').replace(/\n/g, '<br />') || '' }} style={{ whiteSpace: 'pre-wrap' }} />
                            </td>
                          </tr>
                          {email.get('attachments') && email.get('attachments').length > 0 && (
                            <tr>
                              <td colSpan={5}>
                                <div>
                                  {email.get('attachments').map((attachment: string, i: number) => (
                                    attachment.endsWith('.png') || attachment.endsWith('.jpg') || attachment.endsWith('.jpeg') || attachment.endsWith('.gif') || attachment.endsWith('.webp') ? (
                                      <div key={i}>
                                        <img src={attachment} alt={attachment} style={{ width: 100, height: 100 }} />
                                      </div>
                                    ) : (
                                      <div key={i}>{attachment}</div>
                                    )
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                      {replyEmail && replyEmail.id === email.id && (
                        <>
                          <tr>
                            <td colSpan={5}>
                              <div>
                                <label>{t('To')}</label>
                                <input type="text" className="form-control" value={email.get('email')} disabled />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5}>
                              <div>
                                <label>{t('Subject')}</label>
                                <input type="text" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5}>
                              <div>
                                <label>{t('Body')}</label>
                                <textarea
                                  className="form-control"
                                  style={{
                                    height: '300px',
                                  }}
                                  value={body}
                                  rows={20}
                                  onChange={(e) => setBody(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={() => sendEmail(email)}>{t('Send')}</button>
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
          </div>

        </div>
      </>
      :
      <>{t('Loading...')}</>
  );
}