import { useEffect, useState } from "hono/jsx";
import { Parse } from "../../parse";
import { setLang } from "../../i18n";
import { useSchema } from "../../schemas/proposal";

export default function ProposalIndex({lang}: Props) {
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [profiles, setProfiles] = useState<Parse.Object[]>([]);
	const schema = useSchema(lang);
	const { t } = setLang(lang);
	useEffect(() => {
		setUser(Parse.User.current());
	}, []);
	useEffect(() => {
		getProfiles();
	}, [user]);

	const getProfiles = async () => {
		if (!user) return;
		const query = new Parse.Query('Profile');
		const profiles = await query.find();
		['en', 'ja'].forEach(lang => {
			if (profiles.find(p => p.get('lang') === lang)) return;
			const profile = new Parse.Object('Profile');
			profile.set('lang', lang);
			profile.set('user', user);
			profiles.push(profile);
		});
		setProfiles(profiles);
	};

	const deleteProfile = async (proposal: Parse.Object) => {
		if (!confirm(t('Are you sure?'))) return;
		await proposal.destroy();
		getProfiles();
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
				<div class="row">
					<div class="col-8 offset-2">
						<div class="row">
							<div class="col-8">
								<h2>{t('My profiles')}</h2>
							</div>
						</div>
					</div>
					<div class="col-8 offset-2">
						<table class="table table-striped">
							<thead>
								<tr>
									<th>{t('Language')}</th>
									<th>{t('Organization')}</th>
									<th>{t('Title')}</th>
									<th>{t('Name')}</th>
								</tr>
							</thead>
							<tbody>
								{profiles.map((profile: Parse.Object) => (
									<tr>
										<td>
											{t(profile.get('lang'))}
										</td>
										<td>
											<a href={`/${lang}/profiles/${profile.id}`}>
												{profile.get('organization')}
											</a>
										</td>
										<td>{t(profile.get('title'))}</td>
										<td>
											{profile.get('name')}
										</td>
										<td>
											<a href={`/${lang}/profiles/edit`}>
												<i class="fa-solid fa-pen-to-square"></i>
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
};