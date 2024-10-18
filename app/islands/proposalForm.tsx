import { useEffect, useState } from 'hono/jsx'
import Form from './form';
import { useSchema } from '../schemas/proposal';
import { setLang } from '../i18n';
import { Parse } from '../parse';
import { use } from 'i18next';

interface Props {
	lang: string;
	objectId?: string;
}

export default function ProposalForm({lang, objectId}: Props) {
	const schema = useSchema(lang);
	const { t } = setLang(lang);
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [proposal, setProposal] = useState(new Parse.Object('Proposal'));
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
		schema.map(field => {
			if (field.required && !proposal.get(field.name)) {
				console.log(`${field.label} is required`);
				return;
			}
		});
		console.log(proposal.toJSON());
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
							<Form
								schema={schema}
								data={proposal}
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