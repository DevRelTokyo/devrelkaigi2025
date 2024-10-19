import { useEffect, useState } from "hono/jsx";
import { setLang } from "../i18n";
import { Parse } from "../parse";
export default function userMenu({lang}: Props) {
	const [user, setUser] = useState<Parse.User | undefined>(undefined);
	const [CFP, setCFP] = useState<Parse.Object | undefined>(undefined);
	const [image, setImage] = useState<string>('/assets/images/icon/user.png');
	useEffect(() => {
		setUser(Parse.User.current());
	}, []);

	useEffect(() => {
		getImage();
		getCFP();
	}, [user]);

	const getImage = async () => {
		if (!user) return;
		const query = new Parse.Query('Profile');
		query.equalTo('user', user);
		const profile = await query.first();
		if (!profile) return;
		const image = profile.get('image_file');
		if (image) {
			return setImage(image.url());
		}
		setImage(profile.get('image_url') || '/assets/images/icon/user.png');
	};

	const getCFP = async () => {
		if (!user) return;
		const query = new Parse.Query('CFP');
		query.lessThanOrEqualTo('start_at', new Date());
		query.greaterThanOrEqualTo('end_at', new Date());
		const CFP = await query.first();
		setCFP(CFP);
	};

	const logout = async () => {
		try {
			await Parse.User.logOut();
		} catch (e) {
		}
		setUser(undefined);
		location.reload();
	};

	const { t } = setLang(lang);
	return (<>
		{ user ? (
			<nav class="navbar navbar-expand-lg">
				<div class="container-fluid">
					<button
						class="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNavDarkDropdown"
						aria-controls="navbarNavDarkDropdown"
						aria-expanded="false"
						aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
						<ul class="navbar-nav">
							<li class="nav-item dropdown dropdown-menu-end">
								<div class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="true">
									<img src={image} alt="User" style={{
										width: 35, height: 35, borderRadius: '50%'
									}} />
								</div>
								<ul class="dropdown-menu dropdown-menu-end" data-bs-popper="static">
									<li><a class="dropdown-item" href={`/${lang}/profiles`}>
										{t('Edit profile')}</a></li>
									{CFP && (
										<li><a class="dropdown-item" href={`/${lang}/proposals/new`}>
											{t('Send a proposal')}
										</a></li>
									)}
									<li><a class="dropdown-item" href={`/${lang}/proposals`}>
										{t('Manage proposal')}</a></li>
									<li>
										<a
											class="dropdown-item"
											href="#"
											onClick={logout}
										>{t('Logout')}</a>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		) : (
			<a href="/auth/github" className="ticket">
				<img src="/assets/images/icon/user.png" alt="User" />
				<span>{t('Register')}</span>
			</a>
		)}
	</>);
}