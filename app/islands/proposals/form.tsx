import { useEffect, useState } from 'hono/jsx'
import Form from '../form/';
import { useSchema } from '../../schemas/proposal';
import { setLang } from '../../i18n';
import { Parse } from '../../parse';

interface Props {
	lang: string;
	objectId?: string;
}

interface MessageProps {
	messages: string[];
	type: string;
}

export default function ProposalForm({lang, objectId}: Props) {
	const schema = useSchema(lang);
	const { t } = setLang(lang);
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [proposal, setProposal] = useState(new Parse.Object('Proposal'));
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
	const [CFP, setCFP] = useState<Parse.Object | undefined>(undefined);
	const [status, setStatus] = useState<string>('');
	const signInWithGithub = async () => {
		if (typeof window === 'undefined') return;
		window.location.href = `/auth/github?redirect=${encodeURIComponent(window.location.pathname)}`;
	};

	useEffect(() => {
		setUser(Parse.User.current());
	}, []);

	useEffect(() => {
		getCFP();
		fetchProposal();
	}, [user]);

	const getCFP = async () => {
		if (!user) return;
		const query = new Parse.Query('CFP');
		query.lessThanOrEqualTo('start_at', new Date());
		query.greaterThanOrEqualTo('end_at', new Date());
		const CFP = await query.first();
		setCFP(CFP);
	};

	const fetchProposal = async () => {
		if (!objectId) return;
		const query = new Parse.Query('Proposal');
		const proposal = await query.get(objectId);
		setProposal(proposal);
	};

	const submit = async (e: any) => {
		e.preventDefault();
		setStatus('loading');
		const errors: string[] = [];
		schema.forEach(field => {
			if (field.required && !proposal.get(field.name)) {
				errors.push(t('__label__ is required').replace('__label__', field.label));
			}
		});
		if (errors.length > 0) {
			setStatus('');
			return showMessage('danger', errors);
		}
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(false);
		acl.setPublicWriteAccess(false);
		acl.setReadAccess(user!, true);
		acl.setWriteAccess(user!, true);
		acl.setRoleWriteAccess(`Organizer${import.meta.env.VITE_YEAR}`, true);
		acl.setRoleReadAccess(`Organizer${import.meta.env.VITE_YEAR}`, true);
		proposal.setACL(acl);
		proposal.set('user', user);
		proposal.set('lang', lang);
		proposal.set('status', 'Sent');
		proposal.set('cfp', CFP);
		await proposal.save();
		setStatus('');
		if (objectId) {
			showMessage('primary', [t('Thank you! Your proposal has been updated!')]);
		} else {
			showMessage('primary', [t('Thank you! Your proposal has been sent!')]);
		}
		setTimeout(() => {
			window.location.href = `/${lang}/proposals`;
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
					{CFP ? (
						<>
							<div class="row">
								<div class="col-8 offset-2">
									<h2>
										{ objectId ? t('Edit proposal') : t('Send new proposal')}
									</h2>
								</div>
								<div class="col-8 offset-2">
									<div class="alert alert-primary" role="alert">
										{lang === 'ja' ?
											(<>
												If you want to send the proposal in English track, <a href="/en/proposals/new">please click here</a>.
											</>)
											:
											<>
												もし日本語トラック向けにプロポーザルを送りたい場合には、<a href="/ja/proposals/new">こちらをクリック</a>してください
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
										data={proposal}
										status={status}
										onSubmit={submit}
									/>
								</div>
							</div>
						</>
					) : (
						<div class="row">
							<div class="col-8 offset-2">
								<h4>{t('Call for Proposal is not available')}</h4>
							</div>
						</div>
					)}
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
							<h2>{t('Please sign up or sign in to send proposal')}</h2>
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