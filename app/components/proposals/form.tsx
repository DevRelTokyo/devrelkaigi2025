import Form from '../form/';
import { useSchema } from '~/schemas/proposal';
import { setLang } from '~/utils/i18n';
import { useParams } from '@remix-run/react';
import { useContext, useEffect, useState } from 'react';
import { ParseContext } from '~/contexts/parse';
import { Icon } from '@iconify/react/dist/iconify.js';
import { UserContext } from '~/contexts/user';
import ProfileMessage from '../profiles/message';
import Message, { MessageProps } from '~/components/message';

interface ProposalFormProps {
	cfp?: Parse.Object
}

export default function ProposalForm({ cfp }: ProposalFormProps) {
	const { Parse } = useContext(ParseContext)!;
	const { login, user } = useContext(UserContext)!;
  const params = useParams();
  const { locale, id } = params;
  const { t } = setLang(locale!);
	const schema = useSchema(locale!);
	const [proposal, setProposal] = useState<Parse.Object | undefined>();
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
	const [CFP, setCFP] = useState<Parse.Object | undefined>(cfp);
	const [status, setStatus] = useState<string>('');

	useEffect(() => {
		getProposal();
	}, [user]);

	useEffect(() => {
		if (cfp) {
			setCFP(cfp);
		}
	}, [cfp]);

	const getProposal = async () => {
		if (!id) {
			return setProposal(new Parse.Object('Proposal'));
		}
		const query = new Parse.Query('Proposal');
		query.include('cfp');
		const proposal = await query.get(id);
		setProposal(proposal);
		if (!cfp) {
			setCFP(proposal.get('cfp'));
		}
	};

	const getAcl = (): Parse.ACL => {
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(false);
		acl.setPublicWriteAccess(false);
		acl.setReadAccess(user!, true);
		acl.setWriteAccess(user!, true);
		acl.setRoleReadAccess(`Voter${window.ENV.YEAR}`, true);
		acl.setRoleWriteAccess('Admin', true);
		acl.setRoleReadAccess('Admin', true);
		return acl;
	}

	const submit = async (proposal: Parse.Object) => {
		setStatus('loading');
		if (!proposal.id) {
			const acl = getAcl();
			proposal.setACL(acl);
			proposal.set('user', user);
			proposal.set('lang', locale);
			proposal.set('status', 'Sent');
			if (cfp) {
				proposal.set('cfp', cfp);
			}
		}
		await proposal.save();
		setStatus('');
		const message = id ? t('Thank you! Your proposal has been updated!') : t('Thank you! Your proposal has been sent!');
		setMessage({
			type: 'success',
			messages: [message]
		});
		setTimeout(() => {
			window.location.href = `/${locale}/proposals`;
		}, 3000);
	};

	const showDate = () => {
		if (!CFP) return '';
		const date = CFP.get('end_at');
		return `${(date as Date).toLocaleDateString()} ${(date as Date).toLocaleTimeString()}`;
	}

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
							<ProfileMessage locale={locale!} />
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
								<div className="col-8 offset-2">
									<div className="alert alert-info" role="alert">
										{t('This CFP (__name__) will close on __end__')
											.replace('__name__', CFP.get('name'))
											.replace('__end__', showDate())}
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-8 offset-2">
									<Message message={message} />
									{ proposal &&
										<Form
											name="Proposal"
											schema={schema}
											data={proposal}
											status={status}
											onSubmit={submit}
										/>
									}
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
								onClick={() => login('github')}
							>
								Sign in with <Icon icon="mdi:github" style={{fontSize: '2em'}} />
							</button>
							{' '}
							<button type="button" className="btn btn-primary"
								onClick={() => login('google')}
							>
								Sign in with <Icon icon="mdi:google" style={{fontSize: '2em'}} />
							</button>

						</div>
					</div>
				</div>
			)}
		</>
	);
}