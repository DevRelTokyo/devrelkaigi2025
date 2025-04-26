import { useParams } from "@remix-run/react";
import { setLang } from "../utils/i18n";

export default function Sponsors() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  return (
    <section className="sponsors section bg-sponsors">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title">
              <h3
                dangerouslySetInnerHTML={{
                  __html: t('Our <span class="alternate">Sponsors</span>')
                }}
                style={{ color: 'white' }}
              ></h3>
              <p
                style={{ color: 'white' }}
              >
                {t('DevRelKaigi 2025 is supported by wonderful sponsors.')}
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="sponsor-btn text-center">
              <a href={`${locale}/contact`} className="btn btn-main-md">{t('Request sponsor brochure')}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
