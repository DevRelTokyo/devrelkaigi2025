import { useParams } from "@remix-run/react";
import { setLang } from "~/utils/i18n";

export default function Banner() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  return (
    <section className="banner bg-banner-one">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="block">
              <div className="timer"></div>
              <h1>DevRelKaigi</h1>
              <h2>2025</h2>
              <h6>{t('02-04 Oct 2025 Tokyo')}</h6>
              <a href="/#tickets" className="btn btn-white-md">{t('Buy a ticket')}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
