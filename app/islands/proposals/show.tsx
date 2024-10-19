import { useEffect, useState } from "hono/jsx";
import { Parse } from "../../parse";
import { setLang } from "../../i18n";
import { useSchema } from "../../schemas/proposal";
import markdownit from 'markdown-it';
import { editable } from "./utils";
export default function ProposalShow({lang, objectId}: Props) {
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [proposal, setProposal] = useState<Parse.Object | undefined>(undefined);
	const schema = useSchema(lang);
	const { t } = setLang(lang);
	const md = markdownit();
	useEffect(() => {
		setUser(Parse.User.current());
	}, []);
	useEffect(() => {
		getProposal();
	}, [user]);

	const getProposal = async () => {
		if (!user) return;
		const query = new Parse.Query('Proposal');
		query.include('cfp');
		const proposal = await query.get(objectId!);
		setProposal(proposal);
	};

	const getLabel = (key: any, value: string) => {
		const field = schema.find(s => s.name === key);
		if (!field) return value;
		const { options } = field;
		const val = options?.find(o => o.value === value);
		if (key === 'co_speaker' && !value) {
			return t('No. I will speak alone.');
		}
		return val ? val.label : value;
	};

	const deleteProposal = async (proposal: Parse.Object) => {
		if (!confirm(t('Are you sure?'))) return;
		await proposal.destroy();
		location.href = `${lang}/proposals`;
	};

	return (<>
		<div class="container"
			style={{
				paddingTop: '150px',
				paddingBottom: '40px',
			}}
		>
			<div class="row">
				{ proposal ? (<>
					<div class="col-8 offset-2">
						<div class="row">
							<div class="col-8">
								<h2>{proposal.get('title')}</h2>
							</div>
							<div class="col-4">
								{ editable(proposal.get('cfp')) && (
									<>
										<a
											href={`/${lang}/proposals/edit/${proposal.id}`}
											class="btn btn-primary"
										>
											<i class="fa-solid fa-pen-to-square"></i> {t('Edit')}
										</a>
										{' '}
										<a href="#"
											onClick={() => deleteProposal(proposal)}
											class="btn btn-danger"
										>
											<i class="fa-solid fa-trash"></i> {t('Delete')}
										</a>
									</>
								)}
							</div>
						</div>
					</div>
					<div class="col-8 offset-2">
						<div class="form-group">
							<label><strong>{t('Proposal status')}</strong></label>
							<div
								style={{
									paddingBottom: '1em',
								}}
							>
								{t(proposal.get('status'))}
							</div>
						</div>
						{schema.map(field => {
							const value = proposal.get(field.name!);
							if (field.type === 'submit') return null;
							return (<>
								<div class="form-group">
									<label><strong>{field.label}</strong></label>
									{ field.markdown ?
										(
											<div
												style={{
													paddingBottom: '1em',
												}}
												dangerouslySetInnerHTML={{
													__html: md.render(value),
												}}
											>
											</div>
										)
									: (
										<div
											style={{
												paddingBottom: '1em',
											}}
										>
											{getLabel(field.name, value)}
										</div>
									)}
								</div>
							</>);
						})}
					</div>
				</>):
					<div class="col-8 offset-2">
						<h4>{t('Loading...')}</h4>
					</div>
				}
			</div>
		</div>
	</>);
}