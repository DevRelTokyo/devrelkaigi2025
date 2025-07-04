import { useState, useEffect, useContext } from "react";
import { useSearchParams, useParams } from "@remix-run/react";
import Form from "~/components/form";
import { useSchema } from "~/schemas/email";
import { setLang } from "~/utils/i18n";
import { ParseContext } from "~/contexts/parse";
import Message, { MessageProps } from "~/components/message";

export default function AdminEmailsNew() {
  const { Parse } = useContext(ParseContext)!;
  const [searchParams] = useSearchParams();
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  const schema = useSchema(locale!);

  const [selectedSpeakers, setSelectedSpeakers] = useState<Parse.Object[]>([]);
  const [emailData, setEmailData] = useState<Parse.Object>(new Parse.Object('Email'));
  const [message, setMessage] = useState<MessageProps | undefined>(undefined);
  const [status, setStatus] = useState<string>('');
  const [previewEmail, setPreviewEmail] = useState<string>('');

  useEffect(() => {
    const speakersParam = searchParams.get("speakers") || "";
    const speakerIds = speakersParam.split(",").filter(Boolean);
    getSpeakers(speakerIds);
  }, [searchParams]);

  const getSpeakers = async (speakerIds: string[]) => {
    const query = new Parse.Query('Profile');
    query.containedIn('objectId', speakerIds);
    const speakers = await query.find();
    setSelectedSpeakers(speakers);
  };

  const handleEmailSubmit = async (emailObj: Parse.Object) => {
    setStatus('loading');
    setMessage(undefined);
    try {
      emailObj.set('recipients', selectedSpeakers.map(speaker => speaker.id));
      // Simulate API call
      const acl = new Parse.ACL();
      acl.setPublicReadAccess(false);
      acl.setPublicWriteAccess(false);
      emailObj.setACL(acl);
      await emailObj.save();
      setStatus('');
      setMessage({
        type: 'success',
        messages: [t('Email sent successfully!')]
      });
      setTimeout(() => {
        setStatus('');
        setMessage(undefined);
      }, 3000);
      // Reset form
      setEmailData(new Parse.Object('Email'));
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus('');
      setMessage({
        type: 'danger',
        messages: [t('Failed to send email. Please try again.')]
      });
    }
  };

  const handlePreviewEmail = async () => {
    const profile = await new Parse.Query('Profile').get(selectedSpeakers[0].id);
    console.log(profile.toJSON());
    console.log(profile.get('user'));
    const proposal = await new Parse.Query('Proposal')
      .equalTo('user', profile.get('user'))
      .equalTo('responseStatus', true)
      .first();
    const object: { [key: string]: any } = {};
    for (const key in proposal!.toJSON()) {
      object[`proposal.${key}`] = proposal!.get(key);
    }
    for (const key in profile!.toJSON()) {
      object[`profile.${key}`] = profile!.get(key);
    }
    console.log(object);
    setPreviewEmail(replaceMessage(emailData.get('body'), object));
  };

  const replaceMessage = (message: string, object: { [key: string]: any }) => {
    return message.replace(/__(.*?)__/g, (match, p1) => {
      return object[p1] || match;
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h1 className="h3 mb-4">メール送信</h1>


          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">送信対象スピーカー ({selectedSpeakers.length}名)</h5>
            </div>
            <div className="card-body">
              {selectedSpeakers.length > 0 ? (
                <div className="row">
                  {selectedSpeakers.map((speaker) => (
                    <div key={`${speaker.id}`} className="col-md-6 mb-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <strong>{speaker.get('name')} ({speaker.get('email')})</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">選択されたスピーカーはありません</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">メール作成</h5>
            </div>
            <div className="card-body">
              {emailData && (
                <>
                  <Message message={message} />
                  <Form
                    name="Email"
                    schema={schema}
                    data={emailData}
                    status={status}
                    onSubmit={handleEmailSubmit}
                  />
                </>
              )}
            </div>
            <div className="card-footer">
              <button className="btn btn-primary" onClick={handlePreviewEmail}>
                {t('Preview Email')}
              </button>
            </div>
          </div>
          {previewEmail && (
            <div className="card">
              <div className="card-body">
                <div className="card-text">
                  <pre>{previewEmail}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}