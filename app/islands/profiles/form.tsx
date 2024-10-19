import { useEffect, useState } from 'hono/jsx'
import Form from '../form';
import { useSchema } from '../../schemas/profile';
import { setLang } from '../../i18n';
import { Parse } from '../../parse';
import { signInWithGithub } from '../utils';

interface Props {
	lang: string;
	objectId?: string;
}

interface MessageProps {
	messages: string[];
	type: string;
}

export default function ProfileForm({lang, objectId}: Props) {
	const schema = useSchema(lang);
	const { t } = setLang(lang);
	const [user, setUser] = useState<Parse.User | undefined>(Parse.User.current());
	const [profile, setProfile] = useState<Parse.Object | undefined>(undefined);
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
	const [status, setStatus] = useState<string>('');

	useEffect(() => {
		getProfile();
	}, []);

	const getProfile = async () => {
		if (!user) return;
		const query = new Parse.Query('Profile');
		query.equalTo('lang', lang);
		const profile = await query.first();
		setProfile(profile || new Parse.Object('Profile'));
	};

	const submit = async (e: any) => {
		e.preventDefault();
		setStatus('loading');
		profile!.set('lang', lang);
		profile!.set('user', user);
		const errors: string[] = [];
		for (const field of schema) {
			if (field.required && !profile!.get(field.name)) {
				errors.push(t('__label__ is required').replace('__label__', field.label));
			}
			if (field.type === 'array') {
				const values = profile!.get(field.name!) as string[];
				values.filter(v => v === '').length > 0 && 
					errors.push(t('__sub_label__ of __label__ is required')
						.replace('__label__', field.label)
						.replace('__sub_label__', field.schema!.label)
					);
			}
			const value = profile!.get(field.name!);
			if (field.pattern && value) {
				const re = new RegExp(field.pattern);
				if (!re.test(profile!.get(field.name))) {
					errors.push(t('__label__ is invalid').replace('__label__', field.label));
				}
			}
			if (field.ignores && value) {
				if (field.ignores.indexOf(profile!.get(field.name)) >= 0) {
					errors.push(t('__label__ is invalid').replace('__label__', field.label));
				}
			}
			if (field.unique && value) {
				const query = new Parse.Query('Profile');
				query.equalTo(field.name, value);
				if (field.groupBy) {
					field.groupBy.forEach(key => {
						query.equalTo(key, profile!.get(key));
					});
				}
				const res = await query.first();
				if (res && res.id !== profile!.id) {
					errors.push(t('This slug is already taken'));
				}
			}
		};
		if (errors.length > 0) {
			setStatus('');
			return showMessage('danger', errors);
		}
		
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(true);
		acl.setPublicWriteAccess(false);
		acl.setReadAccess(user!, true);
		acl.setWriteAccess(user!, true);
		acl.setRoleWriteAccess(`Organizer${import.meta.env.VITE_YEAR}`, true);
		acl.setRoleReadAccess(`Organizer${import.meta.env.VITE_YEAR}`, true);
		profile!.setACL(acl);
		await profile!.save();
		setStatus('');
		showMessage('primary', [t('Thank you! Your profile has been updated!')]);
		setTimeout(() => {
			window.location.href = `/${lang}/profiles`;
		}, 3000);
	};

	const showMessage = (type: string, messages: string[]) => {
		setMessage({type, messages});
		setInterval(() => {
			return setMessage(undefined);
		}, 3000);
	};

	return (
		<>
			{user ? (
				<div class="container"
					style={{
						paddingTop: '150px',
						paddingBottom: '40px',
					}}
				>
					<>
						<div class="row">
							<div class="col-8 offset-2">
								<h2>
									{ objectId ? t('Edit profile') : t('Create new profile')}
								</h2>
							</div>
							<div class="col-8 offset-2">
								<div class="alert alert-primary" role="alert">
									{lang === 'ja' ?
										(<>
											If you want to create or update a profile in English, <a href="/en/profiles/edit">please click here</a>.
										</>)
										:
										<>
											日本語のプロフィールを作成、更新する場合は<a href="/ja/profiles/edit">こちらをクリック</a>してください
										</>
									}
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-8 offset-2">
								{message && (
									<div class={`alert alert-${message.type}`} role="alert"
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
											{message.messages.map(msg => (
												<li>{msg}</li>
											))}
										</ul>
									</div>
								)}
								<Form
									schema={schema}
									data={profile}
									status={status}
									onSubmit={submit}
								/>
							</div>
						</div>
					</>
				</div>
			) : (
				<div class="container"
					style={{
						paddingTop: '150px',
						paddingBottom: '150px',
					}}
				>
					<div class="row">
						<div class="col-8 offset-2">
							<h4>{t('Please sign up or sign in to update your profile')}</h4>
						</div>
						<div class="col-8 offset-2 text-center"
							style={{paddingTop: '2em', paddingBottom: '2em'}}
						>
							<button type="button" class="btn btn-primary"
								onClick={signInWithGithub}
							>
								Sign in with <i class="fa-brands fa-github"></i>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}