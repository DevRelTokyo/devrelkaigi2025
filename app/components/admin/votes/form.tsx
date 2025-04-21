import Form from '~/components/form';
import { useSchema } from '~/schemas/profile';
import { setLang } from '~/utils/i18n';
import { useParams } from '@remix-run/react';
import { useState, useEffect, useContext } from 'react';
import { Schema } from '~/types/schema';
import { ParseContext } from '~/contexts/parse';
import { UserContext } from '~/contexts/user';
import { Icon } from '@iconify/react/dist/iconify.js';
import markdownit from 'markdown-it'
const md = markdownit();

interface MessageProps {
	messages: string[];
	type: string;
}

export default function VoteForm() {
	const { Parse } = useContext(ParseContext)!;
	const { user, login } = useContext(UserContext)!;
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
	const schema = useSchema(locale!);

  const [proposal, setProposal] = useState<Parse.Object | undefined>(undefined);
	const [profile, setProfile] = useState<Parse.Object | undefined>(undefined);
	const [vote, setVote] = useState<Parse.Object | undefined>(undefined);
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
	const [status, setStatus] = useState<string>('');

	useEffect(() => {
		if (typeof window === 'undefined') return;
		getProposal();
	}, [user]);

	const getProposal = async () => {
		if (!user) return;
		const query = new Parse.Query('Proposal');
		query.equalTo('lang', locale);
		query.equalTo('objectId', params.id);
		const proposal = await query.first();
		setProposal(proposal);
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

	const submit = async (vote: Parse.Object) => {
		setStatus('loading');
		vote!.set('lang', locale);
		vote!.set('user', user);
		if (user?.get('email') !== vote.get('email') && !vote.get('email')) {
			user?.set('email', vote.get('email'));
			await user?.save();
			// vote.unset('email');
		}
		
		const errors = await validate(schema, vote);
		if (errors.length > 0) {
			setStatus('');
			return showMessage('danger', errors);
		}
		if (!vote.id) {
			const acl = getAcl();
			vote!.setACL(acl);
		}
		try {
			await vote!.save();
			setStatus('');
			showMessage('primary', [t('Thank you! Your vote has been updated!')]);
			setTimeout(() => {
				window.location.href = `/${locale}/votes`;
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
			{user && proposal ? (
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
									{ t('Add vote') }
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
								<div className="row">
									<div className="col-12">
										<h3>{proposal.get('title')}</h3>
									</div>
                  { profile && 
                    <>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12">
                            <h4>{ t('Profile')}</h4>
                          </div>
                          <div className="col-12">
                            { proposal.get('level') }
                          </div>
                        </div>
                      </div>
                    </>
                  }
                  <div className="col-12">
                    <p
                      style={{
                        backgroundColor: '#f8f9fa',
                        padding: '10px',
                        borderRadius: '5px',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: md.render(proposal.get('description') as string),
                      }}
                    />
                  </div>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12">
                        <h4>{ t('Why am I suitable for this proposal?')}</h4>
                      </div>
                      <div className="col-12">
                        { proposal.get('reason') }
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12">
                        <h4>{ t('First event')}</h4>
                      </div>
                      <div className="col-12">
                        { proposal.get('first_event') || t('I have never discussed this topic before.') }
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12">
                        <h4>{ t('Category')}</h4>
                      </div>
                      <div className="col-12">
                        { proposal.get('category') }
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12">
                        <h4>{ t('Co speaker')}</h4>
                      </div>
                      <div className="col-12">
                        { proposal.get('co_speaker') ? t('Yes') : t('No') }
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-12">
                        <h4>{ t('Level')}</h4>
                      </div>
                      <div className="col-12">
                        { proposal.get('level') }
                      </div>
                    </div>
                  </div>
								</div>
								<Form
									schema={schema}
									data={proposal}
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
