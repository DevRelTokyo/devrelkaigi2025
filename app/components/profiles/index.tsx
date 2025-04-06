import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { setLang } from "~/utils/i18n";

export default function ProposalIndex() {
  const params = useParams();
  const { locale } = params;
	const { Parse } = useContext(ParseContext)!;
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [profiles, setProfiles] = useState<Parse.Object[]>([]);
	// const schema = useSchema(locale!);
	const { t } = setLang(locale!);
	useEffect(() => {
		setUser(Parse.User.current());
	}, []);
	useEffect(() => {
		getProfiles();
	}, [user]);

	const getProfiles = async () => {
		if (!user) return;
		const query = new Parse.Query('Profile');
		query.equalTo('user', user);
		const profiles = await query.find() as Parse.Object[];
		['en', 'ja'].forEach(lang => {
			if (profiles.find(p => p.get('lang') === lang)) return;
			const profile = new Parse.Object('Profile');
			profile.set('lang', lang);
			profile.set('slug', Math.random().toString(36).substring(2, 15));
			profile.set('user', user);
			profiles.push(profile);
		});
		setProfiles(profiles);
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
						<div className="row">
							<div className="col-8">
								<h2>{t('My profiles')}</h2>
							</div>
						</div>
					</div>
					<div className="col-8 offset-2">
						<table className="table table-striped">
							<thead>
								<tr>
									<th>{t('Language')}</th>
									<th>{t('Organization')}</th>
									<th>{t('Title')}</th>
									<th>{t('Name')}</th>
									<th>{t('Actions')}</th>
								</tr>
							</thead>
							<tbody>
								{profiles.map((profile: Parse.Object, index: number) => (
									<tr key={index}>
										<td>
											{t(profile.get('lang'))}
										</td>
										<td>
											{profile.get('organization')}
										</td>
										<td>{t(profile.get('title'))}</td>
										<td>
											<a href={`/${profile.get('lang')}/members/${profile.get('slug')}`}>
												{profile.get('name')}
											</a>
										</td>
										<td>
											<a href={`/${profile.get('lang')}/profiles/${profile.get('slug')}/edit`}>
												<FontAwesomeIcon icon={faPenToSquare} style={{width: 25, height: 25}} />
											</a>
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