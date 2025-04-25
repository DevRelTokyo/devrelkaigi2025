import Form from '~/components/form';
import { useSchema } from '~/schemas/role';
import { setLang } from '~/utils/i18n';
import { useParams } from '@remix-run/react';
import { useState, useEffect, useContext } from 'react';
import { ParseContext } from '~/contexts/parse';
import { UserContext } from '~/contexts/user';
import { Icon } from '@iconify/react/dist/iconify.js';

interface MessageProps {
	messages: string[];
	type: string;
}

export default function RoleForm() {
	const { Parse } = useContext(ParseContext)!;
	const { user, login } = useContext(UserContext)!;
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
	const schema = useSchema(locale!);

  const [role, setRole] = useState<Parse.Object | undefined>(undefined);
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
	const [status, setStatus] = useState<string>('');
  
	useEffect(() => {
		if (typeof window === 'undefined') return;
		getRole();
	}, [user, params.id]);

	const getRole = async () => {
    if (!user) return;
    if (!params.id) {
      setRole(new Parse.Object('_Role'));
      return;
    }
    try {
      const query = new Parse.Query('_Role');
      query.equalTo('objectId', params.id);
      const role = await query.first();
      if (!role) {
        setRole(new Parse.Object('Role'));
        return;
      }
      setRole(role);
    } catch (error) {
      showMessage('danger', [t('Failed to load role'), (error as Error).message]);
      setRole(undefined);
    }
	};

	const getAcl = () => {
		const acl = new Parse.ACL();
		acl.setPublicReadAccess(true);
		acl.setPublicWriteAccess(false);
		acl.setRoleWriteAccess('Admin', true);
		return acl;
	};

	const submit = async (data: Parse.Object) => {
		setStatus('loading');
		try {
      const acl = getAcl();
      const role = new Parse.Role(data.get('name'), acl);
			await role!.save();
			setStatus('');
			showMessage('primary', [t('Thank you! Your role has been updated!')]);
			setTimeout(() => {
				window.location.href = `/${locale}/admin/roles`;
			}, 3000);
		} catch (error) {
			setStatus('');
			showMessage('danger', ['Error', (error as Error).message]);
		}
	};
  
	const showMessage = (type: string, messages: string[]) => {
		setMessage({type, messages});
    setTimeout(() => {
      setMessage(undefined);
    }, 3000);
	};

	return (
		<>
			{user && role ? (
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
									{ role.id ? t('Edit role') : t('Create new role')}
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
									name="Role"
									schema={schema}
									data={role}
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
							<h4>{t('Please sign up or sign in to create or edit roles')}</h4>
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
