import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "@remix-run/react";
import { setLang } from "~/utils/i18n";

export default function FooterSub() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  return (
    <footer className="subfooter">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <ul className="list-inline">
              <li className="list-inline-item"><a href={`/${locale}/coc`}>{t('Code of Conduct')}</a></li>
              <li className="list-inline-item"><a href={`/${locale}/privacy-policy`}>{t('Privacy Policy')}</a></li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 align-self-center">
            <div className="copyright-text">
              <p><a href="index.html">Eventre</a> &copy; 2021, Designed &amp; Developed by <a href="https://themefisher.com/">Themefisher</a>. The logo is designed by <a href="https://x.com/taiponrock" target="_blank" rel="noreferrer">Taiji Hagino</a>
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <a href="/" className="to-top">
              <FontAwesomeIcon icon={faAngleUp} style={{ fontSize: 50 }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}