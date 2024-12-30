import { useContext, useEffect, useState } from "react";
import { setLang } from "../utils/i18n";
import { useParams } from "@remix-run/react";
import { Icon } from '@iconify/react';
import { ParseContext } from "~/contexts/parse";
import { UserContext } from "~/contexts/user";

export default function UserMenu() {
	const { Parse } = useContext(ParseContext)!;
	const { login, user, logout } = useContext(UserContext)!;
	const [CFP, setCFP] = useState<Parse.Object | undefined>(undefined);
	const [roles, setRoles] = useState<Parse.Role[]>([]);
	const [image, setImage] = useState<string>('/assets/images/icon/user.png');
	const year = typeof window !== 'undefined' ? window.ENV.YEAR : 0;

  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		getImage();
		getCFP();
		getRoles();
	}, [user]);

	const getImage = async () => {
		if (!user) return;
		const query1 = new Parse.Query('Profile');
		query1.exists('image_file');
		const query2 = new Parse.Query('Profile');
		query2.exists('image_url');
		const query = Parse.Query.or(query1, query2);
		query.equalTo('user', user);
		console.log(query);
		const profile = await query.first();
		console.log(profile);
		if (!profile) return '/assets/images/icon/user.png';
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

	const getRoles = async () => {
		if (!user) return;
		const res = await new Parse.Query(Parse.Role).equalTo('users', user).find();
		setRoles(res);
	};

	const role = (roleName: string) => {
		if (!user) return false;
		if (!roles.length) return false;
		return roles.map(r => r.get('name')).includes(roleName);
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
										{t('Manage proposal')}</a>
									</li>
									{ role(`Organizer${year}`) && (
										<li>
											<button
												className="dropdown-item"
											>{t('Admin menu')} &raquo;</button>
											<ul className="dropdown-menu-end dropdown-submenu">
												{ role(`Admin`) && (
													<>
														<li>
															<a className="dropdown-item" href={`/${locale}/admin/organizers`}>
																{t('Manage organizers')}
															</a>
														</li>
														<li>
															<a className="dropdown-item" href={`/${locale}/admin/blog`}>{t('CFP')} &raquo; </a>
															<ul className="dropdown-menu-end dropdown-submenu">
																<li>
																	<a className="dropdown-item" href={`/${locale}/admin/fcp`}>{t('Manage CFPs')}</a>
																</li>
																<li>
																	<a className="dropdown-item" href={`/${locale}/admin/cfp/new`}>{t('New CFP')}</a>
																</li>
															</ul>
														</li>
													</>
												)}
												<li>
													<a className="dropdown-item" href={`/${locale}/admin/blog`}>{t('Blog')} &raquo; </a>
													<ul className="dropdown-menu-end dropdown-submenu">
														<li>
															<a className="dropdown-item" href={`/${locale}/admin/blog`}>{t('Manage articles')}</a>
														</li>
														<li>
															<a className="dropdown-item" href={`/${locale}/admin/blog/new`}>{t('New article')}</a>
														</li>
													</ul>
												</li>
												<li>
													<a className="dropdown-item" href={`/${locale}/admin/speakers`}>{t('Speakers')}</a>
												</li>
												<li>
													<a className="dropdown-item" href={`/${locale}/admin/sessions`}>{t('Sessions')}</a>
												</li>
											</ul>
										</li>
									)}
									{ role(`Voter${year}`) && (
										<li>
											<a className="dropdown-item" href={`/${locale}/admin/votes`}>{t('Vote')}</a>
										</li>
									)}
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
									<strong>{t('Sign up or Login')}</strong>
								</div>
								<ul className="dropdown-menu dropdown-menu-end" data-bs-popper="static">
									<li><button className="dropdown-item"
										onClick={() => login('github')}
										>
										<Icon icon="akar-icons:github-fill" style={{fontSize: '1.5em', marginRight: '0.5em'}} />
										{t('GitHub')}
									</button></li>
									<li><button className="dropdown-item"
										onClick={() => login('google')}
									>
										<Icon icon="akar-icons:google-fill" style={{fontSize: '1.5em', marginRight: '0.5em'}} />
										{t('Google')}
									</button></li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		)}
	</>);
}