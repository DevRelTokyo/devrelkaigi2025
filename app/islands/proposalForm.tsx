import { useEffect, useState } from 'hono/jsx'
import Form from './form';
import { useSchema } from '../schemas/proposal';
import { setLang } from '../i18n';
import { Parse } from '../parse';

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
	const [errors, setErrors] = useState<MessageProps | undefined>(undefined);
	const [status, setStatus] = useState<string>('');
	const signInWithGithub = async () => {
		if (typeof window === 'undefined') return;
		window.location.href = `/auth/github?redirect=${encodeURIComponent(window.location.pathname)}`;
	};

	useEffect(() => {
		setUser(Parse.User.current());
	}, []);

	useEffect(() => {
		fetchProposal();
	}, [user]);

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
			return setMessage('danger', errors);
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
		await proposal.save();
		setStatus('');
		setMessage('primary', [t('Thank you! Your proposal has been sent!')]);
		setProposal(new Parse.Object('Proposal'));
	};

	const setMessage = (type: string, messages: string[]) => {
		setErrors({type, messages});
		setInterval(() => {
			setErrors({type, messages});
		}, 3000);
		return setErrors(undefined);
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
					<div class="row">
						<div class="col-8 offset-2">
							<h2>{t('Send new proposal')}</h2>
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
							{errors && (
								<div class={`alert alert-${errors.type}`} role="alert"
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
										{errors.messages.map(error => (
											<li>{error}</li>
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