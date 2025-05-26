import Form from '~/components/form';
import { useSchema } from '~/schemas/template';
import { setLang } from '~/utils/i18n';
import { useParams } from '@remix-run/react';
import { useState, useEffect, useContext } from 'react';
import { ParseContext } from '~/contexts/parse';
import { UserContext } from '~/contexts/user';
import { Icon } from '@iconify/react/dist/iconify.js';
import Message, { MessageProps } from '~/components/message';
import Breadcrumb from '~/components/breadcrumb';

export default function TemplateForm() {
  const { Parse } = useContext(ParseContext)!;
  const { user, login } = useContext(UserContext)!;
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  const schema = useSchema(locale!);

  const [template, setTemplate] = useState<Parse.Object | undefined>(undefined);
  const [message, setMessage] = useState<MessageProps | undefined>(undefined);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    getTemplate();
  }, [user, params.id]);

  const getTemplate = async () => {
    if (!user) return;
    if (!params.id) {
      setTemplate(new Parse.Object('EmailTemplate'));
      return;
    }
    try {
      const query = new Parse.Query('EmailTemplate');
      query.equalTo('objectId', params.id);
      const template = await query.first();
      if (!template) {
        setTemplate(new Parse.Object('EmailTemplate'));
        return;
      }
      setTemplate(template);
    } catch (error) {
      setMessage({
        type: 'danger',
        messages: [t('Failed to load template'), (error as Error).message]
      });
      setTemplate(undefined);
    }
  };

  const getAcl = () => {
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setRoleReadAccess(`Organizer${window.ENV.YEAR}`, true);
    acl.setRoleWriteAccess(`Organizer${window.ENV.YEAR}`, true);
    acl.setRoleReadAccess('Admin', true);
    acl.setRoleWriteAccess('Admin', true);
    return acl;
  };

  const submit = async (template: Parse.Object) => {
    setStatus('loading');
    try {
      const acl = getAcl();
      template!.setACL(acl);
      await template!.save();
      setStatus('');
      setMessage({
        type: 'success',
        messages: [t('Thank you! Your template has been updated!')]
      });
      setTimeout(() => {
        window.location.href = `/${locale}/admin/templates`;
      }, 3000);
    } catch (error) {
      setStatus('');
      setMessage({
        type: 'danger',
        messages: ['Error', (error as Error).message]
      });
    }
  };

  return (
    <>
      {user && template ? (
        <div className="container"
          style={{
            paddingTop: '150px',
            paddingBottom: '40px',
          }}
        >
          <>
            <div className="row">
              <div className="col-8 offset-2">
                <Breadcrumb items={[
                  { label: t('Email Templates'), href: `/${locale}/admin/templates` },
                  { label: template.id ? t('Edit template') : t('Create new template') }
                ]} />
              </div>
            </div>
            <div className="row">
              <div className="col-8 offset-2">
                <h2>
                  {template.id ? t('Edit template') : t('Create new template')}
                </h2>
              </div>
            </div>
            <Message message={message} />
            <div className="row">
              <div className="col-8 offset-2">
                <Form
                  name="EmailTemplate"
                  schema={schema}
                  data={template}
                  status={status}
                  onSubmit={submit}
                />
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
              <h4>{t('Please sign up or sign in to create or edit templates')}</h4>
            </div>
            <div className="col-8 offset-2 text-center"
              style={{ paddingTop: '2em', paddingBottom: '2em' }}
            >
              <button type="button" className="btn btn-primary"
                onClick={() => login('github')}
              >
                {t('Sign in with ')}<Icon icon="mdi:github" style={{ fontSize: '2em' }} />
              </button>
              {' '}
              <button type="button" className="btn btn-primary"
                onClick={() => login('google')}
              >
                {t('Sign in with ')}<Icon icon="mdi:google" style={{ fontSize: '2em' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}