import Form from '~/components/form';
import { useSchema } from '~/schemas/article';
import { setLang } from '~/utils/i18n';
import { useParams } from '@remix-run/react';
import { useState, useEffect, useContext } from 'react';
import { ParseContext } from '~/contexts/parse';
import { UserContext } from '~/contexts/user';
import { Icon } from '@iconify/react/dist/iconify.js';

interface MessageProps {
	messages: string[];
	type: string;
}

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
  const [messageTimerId, setMessageTimerId] = useState<NodeJS.Timeout | null>(null);
  
	useEffect(() => {
		if (typeof window === 'undefined') return;
		getArticle();
	}, [user]);

	const getArticle = async () => {
		if (!user) return;
    if (!params.id) {
      setArticle(new Parse.Object('Article'));
      return;
    }
		const query = new Parse.Query('Article');
		query.equalTo('objectId', params.id);
		const article = await query.first();
    if (!article) {
      setArticle(new Parse.Object('Article'));
      return;
    }
		setArticle(article);
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
			await article!.save();
			setStatus('');
			showMessage('primary', [t('Thank you! Your article has been updated!')]);
			setTimeout(() => {
				window.location.href = `/${locale}/admin/articles`;
			}, 3000);
		} catch (error) {
			setStatus('');
			showMessage('danger', ['Error', (error as Error).message]);
		}
	};
  
	const showMessage = (type: string, messages: string[]) => {
		setMessage({type, messages});
    if (messageTimerId) clearTimeout(messageTimerId);
		setMessageTimerId(setInterval(() => {
			return setMessage(undefined);
		}, 3000));
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
						<div className="row">
							<div className="col-8 offset-2">
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
											style={{listStyleType: 'none', padding: 0}}
										>
											{message.messages.map((msg: string, i: number) => (
												<li key={i}>{msg}</li>
											))}
										</ul>
									</div>
								)}
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
							<h4>{t('Please sign up or sign in to update your profile')}</h4>
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
