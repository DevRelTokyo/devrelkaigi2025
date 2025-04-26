import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import Breadcrumb from "~/components/breadcrumb";
import Message, { MessageProps } from "~/components/message";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";

export default function AdminRolesMembers() {
  const params = useParams();
	const { Parse } = useContext(ParseContext)!;
  const { locale } = params;
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [role, setRole] = useState<Parse.Role | undefined>(undefined);
	const [profiles, setProfiles] = useState<Parse.Object[]>([]);
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
  const [language, setLanguage] = useState<string>('');
	// const schema = useSchema(locale!);
	const { t } = setLang(locale!);
	useEffect(() => {
		setUser(Parse.User.current());
	}, []);
	useEffect(() => {
		getRole();
	}, [user]);

  useEffect(() => {
    if (!role) return;
    getProfiles();
  }, [role]);

	const getRole = async () => {
		if (!user) return;
		const query = new Parse.Query(Parse.Role);
		query.equalTo('objectId', params.id);
		const role = await query.first();
		setRole(role);
	};

  const getProfiles = async () => {
    if (!role) return;
    const query = new Parse.Query('Profile');
    query.limit(1000);
    setProfiles(await query.find());
  };

  const addMember = async (profile: Parse.Object) => {
    if (!user) return;
    const q = role!.getUsers();
    q.add(profile.get('user'));
    await role!.save();
    showMessage({
      messages: [t('Member added')],
      type: 'success'
    });
  };

  const filter = async (lang: string) => {
    if (!role) return;
    const query = new Parse.Query('Profile');
    query.equalTo('lang', lang);
    query.limit(1000);
    setProfiles(await query.find());
    setLanguage(lang);
  };

  const showMessage = (message: MessageProps) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(undefined);
    }, 3000);
  };

	const deleteMember = async (profile: Parse.Object) => {
		if (!user) return;
		if (!window.confirm(t('Are you sure you want to delete this member?'))) return;
		try {
      const q = role!.getUsers();
      q.remove(profile.get('user'));
			await role!.save();
      showMessage({
        messages: [t('Member removed')],
        type: 'success'
      });
		} catch (error) {
			showMessage({
				type: 'danger',
				messages: [t('Failed to remove member')]
			});
		}
	};

	return (
		user ? 
		<>
			<div className="container"
				style={{
					paddingTop: '150px',
					paddingBottom: '40px',
				}}
			>
        <Message message={message} />
				<div className="row">
          <div className="col-8 offset-2">
            <Breadcrumb items={[{label: t('Roles'), href: `/${locale}/admin/roles`}, {label: t('Members'), href: `/${locale}/admin/roles/${params.id}`}]} />
          </div>
					<div className="col-8 offset-2">
						<div className="row">
							<div className="col-8">
								<h2>{t('Role members')}: {role?.get('name')}</h2>
							</div>
						</div>
					</div>
          <div className="col-8 offset-2">
            <button className={`btn ${language === 'ja' ? 'btn-primary' : ''}`} onClick={() => filter('ja')}>{t('Japanese')}</button>
            <button className={`btn ${language === 'en' ? 'btn-primary' : ''}`} onClick={() => filter('en')}>{t('English')}</button>
          </div>
					<div className="col-8 offset-2">
						<table className="table table-striped">
							<thead>
								<tr>
									<th>{t('Name')}</th>
									<th>{t('Actions')}</th>
								</tr>
							</thead>
							<tbody>
								{profiles.map((profile, index) => (
									<tr key={index}>
										<td>
											<Link to={`/${locale}/admin/profiles/${profile.id}`}>
												{profile.get('name')}
											</Link>
										</td>
										<td>
                      <button className="btn" onClick={() => addMember(profile)}>
                        <FontAwesomeIcon icon={faPlusCircle} style={{width: 25, height: 25, color: 'green'}} />
                      </button>
                      <button className="btn" onClick={() => deleteMember(profile)}>
												<FontAwesomeIcon icon={faTrash} style={{width: 25, height: 25, color: 'red'}} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>				
					
			</div>
		</>
		: 
		<>{t('Loading...')}</>
	);
}