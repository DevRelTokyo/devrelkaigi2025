import Form from '~/components/form';
import { useSchema } from '~/schemas/contact';
import { setLang } from '~/utils/i18n';
import { useParams, useSearchParams } from '@remix-run/react';
import { useState, useEffect, useContext } from 'react';
import { ParseContext } from '~/contexts/parse';

interface MessageProps {
	messages: string[];
	type: string;
}

export default function ContactForm() {
	const { Parse } = useContext(ParseContext)!;
	const [searchParams] = useSearchParams();
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
	const schema = useSchema(locale!);	
	
	const [contact, setContact] = useState<Parse.Object | undefined>(undefined);
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
	const [status, setStatus] = useState<string>('');

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const contact = new Parse.Object('Contact');
		contact.set('category', searchParams.get('category'));
		setContact(contact);
	}, []);


	const getAcl = () => {
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(false);
		acl.setPublicWriteAccess(false);
		acl.setRoleReadAccess('Admin', true);
		acl.setRoleWriteAccess('Admin', true);
		acl.setRoleReadAccess(`Organizer${window.ENV.YEAR}`, true);		
		return acl;
	}

	const submit = async (contact: Parse.Object) => {
		setStatus('loading');
		contact.set('lang', locale);
		contact.set('reply', true);
		contact.setACL(getAcl());
		await contact.save();
		setStatus('');
		showMessage('primary', [t('Thank you! We will contact you soon.')]);
		setContact(new Parse.Object('Contact'));
	};

	const showMessage = (type: string, messages: string[]) => {
		setMessage({type, messages});
		setInterval(() => {
			return setMessage(undefined);
		}, 3000);
	};

	return (
		<>
			{contact && (
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
									{t('Contact us')}
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
								<Form
									schema={schema}
									data={contact}
									status={status}
									onSubmit={submit}
								/>
							</div>
						</div>
					</>
				</div>
			)}
		</>
	);
}
