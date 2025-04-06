import Form from '~/components/form';
import { useSchema } from '~/schemas/profile';
import { setLang } from '~/utils/i18n';
import { useParams } from '@remix-run/react';
import { useState, useEffect, useContext } from 'react';
import { Schema } from '~/types/schema';
import { ParseContext } from '~/contexts/parse';
import { UserContext } from '~/contexts/user';
import { Icon } from '@iconify/react/dist/iconify.js';

interface MessageProps {
	messages: string[];
	type: string;
}

export default function ProfileForm() {
	const { Parse } = useContext(ParseContext)!;
	const { user, login } = useContext(UserContext)!;
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
	const schema = useSchema(locale!);

	const [profile, setProfile] = useState<Parse.Object | undefined>(undefined);
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
	const [status, setStatus] = useState<string>('');

	useEffect(() => {
		if (typeof window === 'undefined') return;
		getProfile();
	}, [user]);

	const getProfile = async () => {
		if (!user) return;
		const query = new Parse.Query('Profile');
		query.equalTo('lang', locale);
		query.equalTo('slug', params.slug);
		const profile = (await query.first()) || new Parse.Object('Profile');
		profile.set('email', user.get('email'));
		setProfile(profile);
	};

	const validate = async (schema: Schema[], profile: Parse.Object) => {
		const errors: string[] = [];
		for (const field of schema) {
			if (field.required && !profile!.get(field.name)) {
				errors.push(t('__label__ is required').replace('__label__', field.label));
			}
			if (field.type === 'array') {
				const values = (profile!.get(field.name!) as string[]) || [];
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
		}
		return errors;
	}

	const getAcl = () => {
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(true);
		acl.setPublicWriteAccess(false);
		acl.setReadAccess(user!, true);
		acl.setWriteAccess(user!, true);
		acl.setRoleWriteAccess('Admin', true);
		acl.setRoleReadAccess('Admin', true);
		return acl;
	};

	const submit = async (profile: Parse.Object) => {
		setStatus('loading');
		profile!.set('lang', locale);
		profile!.set('user', user);
		if (user?.get('email') !== profile.get('email') && !profile.get('email')) {
			user?.set('email', profile.get('email'));
			await user?.save();
			// profile.unset('email');
		}
		
		const errors = await validate(schema, profile);
		if (errors.length > 0) {
			setStatus('');
			return showMessage('danger', errors);
		}
		if (!profile.id) {
			const acl = getAcl();
			profile!.setACL(acl);
		}
		try {
			await profile!.save();
			setStatus('');
			showMessage('primary', [t('Thank you! Your profile has been updated!')]);
			setTimeout(() => {
				window.location.href = `/${locale}/profiles`;
			}, 3000);
		} catch (error) {
			setStatus('');
			showMessage('danger', ['Error', (error as Error).message]);
		}
	};

	const showMessage = (type: string, messages: string[]) => {
		setMessage({type, messages});
		setInterval(() => {
			return setMessage(undefined);
		}, 3000);
	};

	return (
		<>
			{user && profile ? (
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
									{ profile.id ? t('Edit profile') : t('Create new profile')}
								</h2>
							</div>
							<div className="col-8 offset-2">
								<div className="alert alert-primary" role="alert">
									{locale === 'ja' ?
										(<>
											If you want to create or update a profile in English, <a href={`/en/profiles/${profile.get('slug')}/edit`}>please click here</a>.
										</>)
										:
										<>
											日本語のプロフィールを作成、更新する場合は<a href={`/ja/profiles/${profile.get('slug')}/edit`}>こちらをクリック</a>してください
										</>
									}
								</div>
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
