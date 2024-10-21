import { useEffect, useState } from "react";
import { setLang } from "../utils/i18n";
import { useParse } from "../parse";
import type ParseType from '@goofmint/parse';
import { useParams } from "@remix-run/react";
import { useRootContext } from "remix-provider";
import { ENV } from "../types/env";
export default function UserMenu() {
	const { env } = useRootContext() as ENV;
	const Parse = useParse(env.PARSE_APP_ID, env.PARSE_JS_KEY, env.PARSE_SERVER_URL);
	const [user, setUser] = useState<ParseType.User | undefined>(undefined);
	const [CFP, setCFP] = useState<ParseType.Object | undefined>(undefined);
	const [image, setImage] = useState<string>('/assets/images/icon/user.png');
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		setUser(Parse.User.current());
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
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
			console.log('');
		}
		setUser(undefined);
		location.reload();
	};

	return (<>
		{ user ? (
			<nav className="navbar navbar-expand-lg">
				<div className="container-fluid">
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNavDarkDropdown"
						aria-controls="navbarNavDarkDropdown"
						aria-expanded="false"
						aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
						<ul className="navbar-nav">
							<li className="nav-item dropdown dropdown-menu-end">
								<div className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="true">
									<img src={image} alt="User" style={{
										width: 35, height: 35, borderRadius: '50%'
									}} />
								</div>
								<ul className="dropdown-menu dropdown-menu-end" data-bs-popper="static">
									<li><a className="dropdown-item" href={`/${locale}/profiles`}>
										{t('Edit profile')}</a></li>
									{CFP && (
										<li><a className="dropdown-item" href={`/${locale}/proposals/new`}>
											{t('Send a proposal')}
										</a></li>
									)}
									<li><a className="dropdown-item" href={`/${locale}/proposals`}>
										{t('Manage proposal')}</a></li>
									<li>
										<button
											className="dropdown-item"
											onClick={logout}
										>{t('Logout')}</button>
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