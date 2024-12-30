import { Parse, useParse } from "~/parse";
import { setLang } from "~/utils/i18n";
import { useSchema } from "~/schemas/proposal";
import markdownit from 'markdown-it';
import { editable } from "./utils";
import { useState, useEffect } from "react";
import { useParams } from "@remix-run/react";
import { useRootContext } from "remix-provider";
import { ENV } from "~/types/env";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
export default function ProposalShow() {
	const { env } = useRootContext() as ENV;
	const Parse = useParse(env.PARSE_APP_ID, env.PARSE_JS_KEY, env.PARSE_SERVER_URL);
  const params = useParams();
  const { locale, id } = params;
	
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [proposal, setProposal] = useState<Parse.Object | undefined>(undefined);
	const schema = useSchema(locale!);
	const { t } = setLang(locale!);
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
		const proposal = await query.get(id!);
		setProposal(proposal);
	};

	const getLabel = (key: string, value: string) => {
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
		location.href = `${locale}/proposals`;
	};

	return (<>
		<div className="container"
			style={{
				paddingTop: '150px',
				paddingBottom: '40px',
			}}
		>
			<div className="row">
				{ proposal ? (<>
					<div className="col-8 offset-2">
						<div className="row">
							<div className="col-8">
								<h2>{proposal.get('title')}</h2>
							</div>
							<div className="col-4">
								{ editable(proposal.get('cfp')) && (
									<>
										<a
											href={`/${locale}/proposals/edit/${proposal.id}`}
											className="btn btn-primary"
										>
											<i className="fa-solid fa-pen-to-square"></i> {t('Edit')}
										</a>
										{' '}
										<button
											onClick={() => deleteProposal(proposal)}
											className="btn btn-danger"
										>
											<FontAwesomeIcon icon={faTrash} style={{width: 25, height: 25}} />
										</button>
									</>
								)}
							</div>
						</div>
					</div>
					<div className="col-8 offset-2">
						<div className="form-group">
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
								<div className="form-group">
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
					<div className="col-8 offset-2">
						<h4>{t('Loading...')}</h4>
					</div>
				}
			</div>
		</div>
	</>);
}