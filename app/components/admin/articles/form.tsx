import Form from '~/components/form';
import { useSchema } from '~/schemas/article';
import { setLang } from '~/utils/i18n';
import { useParams } from '@remix-run/react';
import { useState, useEffect, useContext } from 'react';
import { ParseContext } from '~/contexts/parse';
import { UserContext } from '~/contexts/user';
import { Icon } from '@iconify/react/dist/iconify.js';
import Message, { MessageProps } from '~/components/message';

export default function ArticleForm() {
	const { Parse } = useContext(ParseContext)!;
	const { user, login } = useContext(UserContext)!;
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
	const schema = useSchema(locale!);

  const [article, setArticle] = useState<Parse.Object | undefined>(undefined);
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
	const [status, setStatus] = useState<string>('');
  
	useEffect(() => {
		if (typeof window === 'undefined') return;
		getArticle();
	}, [user, params.id]);

	const getArticle = async () => {
    if (!user) return;
    if (!params.id) {
      setArticle(new Parse.Object('Article'));
      return;
    }
    try {
      const query = new Parse.Query('Article');
      query.equalTo('objectId', params.id);
      const article = await query.first();
      if (!article) {
        setArticle(new Parse.Object('Article'));
        return;
      }
      setArticle(article);
    } catch (error) {
      setMessage({
        type: 'danger',
        messages: [t('Failed to load article'), (error as Error).message]
      });
      setArticle(undefined);
    }
	};

	const getAcl = () => {
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(true);
		acl.setPublicWriteAccess(false);
		acl.setReadAccess(user!, true);
		acl.setWriteAccess(user!, true);
		acl.setRoleWriteAccess(`Organizer${window.ENV.YEAR}`, true);
		acl.setRoleWriteAccess('Admin', true);
		return acl;
	};

	const submit = async (article: Parse.Object) => {
		setStatus('loading');
		try {
      const acl = getAcl();
      article!.setACL(acl);
      article.set('year', parseInt(import.meta.env.YEAR));
			await article!.save();
			setStatus('');
			setMessage({
				type: 'success',
				messages: [t('Thank you! Your article has been updated!')]
			});
			setTimeout(() => {
				window.location.href = `/${locale}/admin/articles`;
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
			{user && article ? (
				<div className="container"
					style={{
						paddingTop: '150px',
						paddingBottom: '40px',
					}}
				>
					<>
						<div className="row">
							<div className="col-8 offset-2">
								<h2>
									{ article.id ? t('Edit article') : t('Create new article')}
								</h2>
							</div>
						</div>
						<Message message={message} />
						<div className="row">
							<div className="col-8 offset-2">
								<Form
									name="Article"
									schema={schema}
									data={article}
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
							<h4>{t('Please sign up or sign in to create or edit articles')}</h4>
						</div>
						<div className="col-8 offset-2 text-center"
							style={{paddingTop: '2em', paddingBottom: '2em'}}
						>
							<button type="button" className="btn btn-primary"
								onClick={() => login('github')}
							>
								{t('Sign in with ')}<Icon icon="mdi:github" style={{fontSize: '2em'}} />
							</button>
							{' '}
							<button type="button" className="btn btn-primary"
								onClick={() => login('google')}
							>
								{t('Sign in with ')}<Icon icon="mdi:google" style={{fontSize: '2em'}} />
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
