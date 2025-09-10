import { useParams } from "@remix-run/react";
import { setLang } from "../utils/i18n";
import SponsorList from "./sponsors/list";

export default function Sponsors() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  return (
    <section className="sponsors section bg-sponsors"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
        backgroundColor: '#333',
        color: 'white',
      }}
    >
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
              <a href={`/${locale}/contact`} className="btn btn-main-md">{t('Request sponsor brochure')}</a>
            </div>
          </div>
        </div>
        <SponsorList level="Platinum" columnCount={6} />
        <SponsorList level="Gold" columnCount={4} />
        <SponsorList level="Silver" columnCount={3} />
        <SponsorList level="Bronze" columnCount={2} />
        <SponsorList level="Media" columnCount={2} />
        <SponsorList level="Personal" columnCount={2} />
        <SponsorList level="Community" columnCount={3} />
        <div className="row">
          <div className="col-12">
            <div className="sponsor-btn text-center">
              <div className="sponsor-btn text-center">
                <a href={`https://docs.google.com/document/d/1Vei8Z1wAgKZbpINErTKrJL3NOaOXWC1nZ9p_Cl7dAOU/edit?tab=t.0#heading=h.3zdk7hfmuxsn`} target="_blank" className="btn btn-main-md" rel="noreferrer">
                  {t('Read the Community Supporter Proposal')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
