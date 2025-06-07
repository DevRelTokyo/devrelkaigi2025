import Form from '~/components/form';
import { useSchema } from '~/schemas/sponsor';
import { setLang } from '~/utils/i18n';
import { useParams } from '@remix-run/react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { ParseContext } from '~/contexts/parse';
import { UserContext } from '~/contexts/user';
import { Icon } from '@iconify/react/dist/iconify.js';
import Message, { MessageProps } from '~/components/message';
import Breadcrumb from '~/components/breadcrumb';

export default function SponsorForm() {
  const { Parse } = useContext(ParseContext)!;
  const { user, login } = useContext(UserContext)!;
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  const schema = useSchema(locale!);

  const [sponsor, setSponsor] = useState<Parse.Object | undefined>(undefined);
  const [message, setMessage] = useState<MessageProps | undefined>(undefined);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    getSponsor();
  }, []);

  const getSponsor = useCallback(async () => {
    if (!user) return;
    if (!params.id) {
      setSponsor(new Parse.Object('Sponsor'));
      return;
    }
    try {
      const query = new Parse.Query('Sponsor');
      query.equalTo('objectId', params.id);
      const sponsor = await query.first();
      if (!sponsor) {
        setSponsor(new Parse.Object('Sponsor'));
        return;
      }
      setSponsor(sponsor);
    } catch (error) {
      setMessage({
        type: 'danger',
        messages: [t('Failed to load sponsor'), (error as Error).message]
      });
      setSponsor(undefined);
    }
  }, [user, params.id, Parse, t]);

  const onSubmit = async (sponsor: Parse.Object) => {
    if (!sponsor) return;
    setStatus('submitting');
    try {
      if (!sponsor.id) {
        sponsor.set('year', parseInt(import.meta.env.YEAR));
        const acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        acl.setPublicWriteAccess(false);
        acl.setRoleWriteAccess('Admin', true);
        acl.setRoleWriteAccess(`Organizer${import.meta.env.YEAR}`, true);
        sponsor.setACL(acl);
      }
      await sponsor.save();

      setMessage({
        type: 'success',
        messages: [t('Thank you! Your sponsor has been saved!')]
      });
      setStatus('success');
      setTimeout(() => {
        setMessage(undefined);
      }, 3000);
      window.location.href = `/${locale}/admin/sponsors`;
    } catch (error) {
      setMessage({
        type: 'danger',
        messages: [(error as Error).message]
      });
      setStatus('error');
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: '150px', paddingBottom: '40px' }}>
        <div className="row">
          <div className="col-8 offset-2">
            <h2>{params.id ? t('Edit sponsor') : t('Create new sponsor')}</h2>
            <p>{t('Please sign up or sign in to create or edit sponsors')}</p>
            <button className="btn btn-primary" onClick={() => login('github')}>
              <Icon icon="akar-icons:github-fill" style={{ fontSize: '1.5em', marginRight: '0.5em' }} />
              {t('Sign in with ')} GitHub
            </button>
            <button className="btn btn-primary ms-2" onClick={() => login('google')}>
              <Icon icon="akar-icons:google-fill" style={{ fontSize: '1.5em', marginRight: '0.5em' }} />
              {t('Sign in with ')} Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="container" style={{ paddingTop: '150px', paddingBottom: '40px' }}>
        <div className="row">
          <div className="col-8 offset-2">
            <h2>{t('Loading...')}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '150px', paddingBottom: '40px' }}>
      <div className="row">
        <div className="col-8 offset-2">
          <Breadcrumb items={[
            { label: t('Sponsors'), href: `/${locale}/admin/sponsors` },
            { label: params.id ? t('Edit sponsor') : t('Create new sponsor') }
          ]} />
        </div>
      </div>
      <div className="row">
        <div className="col-8 offset-2">
          <h2>{params.id ? t('Edit sponsor') : t('Create new sponsor')}</h2>
          {message && <Message message={message} />}
          <Form
            name="sponsor"
            schema={schema}
            data={sponsor}
            onSubmit={onSubmit}
            status={status}
          />
        </div>
      </div>
    </div>
  );
}
