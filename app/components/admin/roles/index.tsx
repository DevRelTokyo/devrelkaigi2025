import { faPeopleLine, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";
import Message, { MessageProps } from "~/components/message";
export default function AdminRolesIndex() {
  const params = useParams();
	const { Parse } = useContext(ParseContext)!;
  const { locale } = params;
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [roles, setRoles] = useState<Parse.Object[]>([]);
	const [message, setMessage] = useState<MessageProps | undefined>(undefined);
	// const schema = useSchema(locale!);
	const { t } = setLang(locale!);
	useEffect(() => {
		setUser(Parse.User.current());
	}, []);
	useEffect(() => {
		getRoles();
	}, [user]);


	const getRoles = async () => {
		if (!user) return;
		try {
			const query = new Parse.Query(Parse.Role);
			const roles = await query.find();
			setRoles(roles);
		} catch (error) {
			setMessage({
				type: 'danger',
				messages: [t('Failed to load roles')]
			});
		}
	};

	const deleteRole = async (role: Parse.Object) => {
		if (!user) return;
		if (!window.confirm(t('Are you sure you want to delete this role?'))) return;
		try {
			await role.destroy();
			setRoles(roles.filter(r => r.id !== role.id));
		} catch (error) {
			console.error(error);
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
				<div className="row">
					<div className="col-8 offset-2">
						<Message message={message} />
						<div className="row">
							<div className="col-8">
								<h2>{t('Roles')}</h2>
							</div>
							<div className="col-4">
								<Link to={`/${locale}/admin/roles/new`} className="btn btn-primary">{t('New role')}</Link>
							</div>
						</div>
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
								{roles.map((role, index) => (
									<tr key={index}>
										<td>
											<Link to={`/${locale}/admin/roles/${role.id}`}>
												{t(role.get('name'))}
											</Link>
										</td>
										<td>
											<Link to={`/${locale}/admin/roles/${role.id}`}>
												<FontAwesomeIcon icon={faPeopleLine} style={{width: 25, height: 25}} />
											</Link>
											<button className="btn" onClick={() => deleteRole(role)}>
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