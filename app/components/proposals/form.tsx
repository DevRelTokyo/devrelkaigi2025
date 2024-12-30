import Form from '../form/';
import { useSchema } from '~/schemas/proposal';
import { setLang } from '~/utils/i18n';
import { useParse } from '~/parse';
import type {Parse as ParseType} from '~/parse';
import { ENV } from '~/types/env';
import { useRootContext } from 'remix-provider';
import { useParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { signInWithGithub } from '~/utils/github';
import { Schema } from '~/types/schema';

interface MessageProps {
	messages: string[];
	type: string;
}

export default function ProposalForm() {
	const { env } = useRootContext() as ENV;
	const Parse = useParse(env.PARSE_APP_ID, env.PARSE_JS_KEY, env.PARSE_SERVER_URL);
  const params = useParams();
  const { locale, id } = params;
  const { t } = setLang(locale!);
	const schema = useSchema(locale!);
	const [user, setUser] = useState<ParseType.User | undefined>(undefined);
	const [proposal, setProposal] = useState<ParseType.Object | undefined>();
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
	const [CFP, setCFP] = useState<ParseType.Object | undefined>(undefined);
	const [status, setStatus] = useState<string>('');

	useEffect(() => {
		if (typeof window === 'undefined') return;
		setUser(Parse.User.current());
	}, []);

	useEffect(() => {
		getCFP();
		getProposal();
	}, [user]);

	const getCFP = async () => {
		if (!user) return;
		const query = new Parse.Query('CFP');
		query.lessThanOrEqualTo('start_at', new Date());
		query.greaterThanOrEqualTo('end_at', new Date());
		const CFP = await query.first();
		setCFP(CFP);
	};

	const getProposal = async () => {
		if (!id) {
			return setProposal(new Parse.Object('Proposal'));
		}
		const query = new Parse.Query('Proposal');
		const proposal = await query.get(id);
		setProposal(proposal);
	};

	const validate = (schema: Schema[], proposal: ParseType.Object) => {
		const errors: string[] = [];
		schema.forEach(field => {
			if (field.required && !proposal.get(field.name)) {
				errors.push(t('__label__ is required').replace('__label__', field.label));
			}
		});
		return errors;
	}

	const getAcl = (): ParseType.ACL => {
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(false);
		acl.setPublicWriteAccess(false);
		acl.setReadAccess(user!, true);
		acl.setWriteAccess(user!, true);
		acl.setRoleReadAccess(`Voter${env.YEAR}`, true);
		acl.setRoleWriteAccess('admin', true);
		acl.setRoleReadAccess('admin', true);
		return acl;
	}

	const submit = async (proposal: ParseType.Object) => {
		setStatus('loading');
		const errors = validate(schema, proposal);
		if (errors.length > 0) {
			setStatus('');
			return showMessage('danger', errors);
		}
		if (!proposal.id) {
			const acl = getAcl();
			proposal.setACL(acl);
			proposal.set('user', user);
			proposal.set('lang', locale);
			proposal.set('status', 'Sent');
			proposal.set('cfp', CFP);
		}
		await proposal.save();
		setStatus('');
		if (id) {
			showMessage('primary', [t('Thank you! Your proposal has been updated!')]);
		} else {
			showMessage('primary', [t('Thank you! Your proposal has been sent!')]);
		}
		setTimeout(() => {
			window.location.href = `/${locale}/proposals`;
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
				<div className="container"
					style={{
						paddingTop: '150px',
						paddingBottom: '40px',
					}}
				>
					{CFP ? (
						<>
							<div className="row">
								<div className="col-8 offset-2">
									<h2>
										{ id ? t('Edit proposal') : t('Send new proposal')}
									</h2>
								</div>
								<div className="col-8 offset-2">
									<div className="alert alert-primary" role="alert">
										{locale === 'ja' ?
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
												{message.messages.map((msg, i) => (
													<li key={i}>{msg}</li>
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
						<div className="row">
							<div className="col-8 offset-2">
								<h4>{t('Call for Proposal is not available')}</h4>
							</div>
						</div>
					)}
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
							<h2>{t('Please sign up or sign in to send proposal')}</h2>
						</div>
						<div className="col-8 offset-2 text-center"
							style={{paddingTop: '2em', paddingBottom: '2em'}}
						>
							<button type="button" className="btn btn-primary"
								onClick={signInWithGithub}
							>
								Sign in with <i className="fa-brands fa-github"></i>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}