import { useEffect, useState } from "hono/jsx";
import { Parse } from "../../parse";
import { setLang } from "../../i18n";
import { useSchema } from "../../schemas/proposal";
import { editable } from "./utils";

export default function ProposalIndex({lang}: Props) {
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [proposals, setProposals] = useState<Parse.Object[]>([]);
	const schema = useSchema(lang);
	const { t } = setLang(lang);
	useEffect(() => {
		setUser(Parse.User.current());
	}, []);
	useEffect(() => {
		getProposals();
	}, [user]);

	const getProposals = async () => {
		if (!user) return;
		const query = new Parse.Query('Proposal');
		query.include('cfp');
		const proposals = await query.find();
		setProposals(proposals);
	};

	const getLabel = (key: any, value: string) => {
		const field = schema.find(s => s.name === key);
		if (!field) return value;
		const { options } = field;
		const val = options?.find(o => o.value === value);
		return val ? val.label : value;
	};

	const deleteProposal = async (proposal: Parse.Object) => {
		if (!confirm(t('Are you sure?'))) return;
		await proposal.destroy();
		getProposals();
	};

	const truncate = (str: string, len: number = 50) => {
		return str.length <= len ? str: `${str.substring(0, len)}...`;
	}

	return (
		user ? 
		<>
			<div class="container"
				style={{
					paddingTop: '150px',
					paddingBottom: '40px',
				}}
			>
				{ proposals.length === 0 ?
					(<>
						<div class="row">
							<div class="col-8 offset-2">
								<h2>{t('My proposals')}</h2>
							</div>
							<div class="col-8 offset-2">
								<p>{t('You have not submitted any proposals yet.')}</p>
								<p><a href={`/${lang}/proposals/new`}>{t('Let\'s send a proposal here!')}</a></p>
							</div>
						</div>
					</>)
					:
					(<>
						<div class="row">
							<div class="col-8 offset-2">
								<div class="row">
									<div class="col-8">
										<h2>{t('My proposals')}</h2>
									</div>
									<div class="col-4 text-right">
										<a href={`/${lang}/proposals/new`}
											class="btn btn-primary"
										>{t('Send a proposal')}</a>
									</div>
								</div>
							</div>
							<div class="col-8 offset-2">
								<table class="table table-striped">
									<thead>
										<tr>
											<th>{t('Year')}</th>
											<th>{t('Session Title')}</th>
											<th>{t('Level')}</th>
											<th>{t('Category')}</th>
											<th>{t('Status')}</th>
											<th>{t('Actions')}</th>
										</tr>
									</thead>
									<tbody>
										{proposals.map((proposal: Parse.Object) => (
											<tr>
												<td>
													{proposal.get('cfp')?.get('year')}
												</td>
												<td>
													<a href={`/${lang}/proposals/${proposal.id}`}>
														{truncate(proposal.get('title'), 50)}
													</a>
												</td>
												<td>{getLabel('level', proposal.get('level'))}</td>
												<td>{getLabel('category', proposal.get('category'))}</td>
												<td>{t(proposal.get('status'))}</td>
												<td>
													{ editable(proposal.get('cfp')) ? (
															<>
																<a href={`/${lang}/proposals/edit/${proposal.id}`}>
																	<i class="fa-solid fa-pen-to-square"></i>
																</a>
																{' '}
																<a href="#"
																	onClick={() => deleteProposal(proposal)}
																>
																	<i class="fa-solid fa-trash"></i>
																</a>
															</>
														) : (
															<i class="fa-solid fa-pen-to-square"
																style={{
																	color: '#ccc',
																}}
															></i>
														)
													}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>				
					</>)
				}
			</div>
		</>
		: 
		<>{t('Loading...')}</>
	);
};