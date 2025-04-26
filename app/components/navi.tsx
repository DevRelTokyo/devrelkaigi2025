import { useParams } from "@remix-run/react";
import { setLang } from "../utils/i18n";
import UserMenu from "./userMenu";

export default function Navi() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);

  return (
    <nav className="navbar main-nav fixed-top navbar-expand-lg p-0">
      <div className="container-fluid p-0">
        <a className="navbar-brand" href="/">
          <img src="/assets/images/logo.png" alt="logo" width={150} />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="fa fa-bars"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item dropdown active">
              <a className="nav-link" href={`/${locale}`} data-toggle="dropdown">
                {t('Home')}
                <i className="fa fa-angle-down"></i>
                <span>/</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/${locale}/#speakers`}>{t('Speakers')}
                <span>/</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/${locale}/#schedule`}>{t('Schedule')}<span>/</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/${locale}/#sponsors`}>{t('Sponsors')}<span>/</span></a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link" href={`/${locale}/#news`} data-toggle="dropdown">{t('News')} <i className="fa fa-angle-down"></i><span>/</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={`/${locale}/contact`}>{t('Contact')}</a>
            </li>
          </ul>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}