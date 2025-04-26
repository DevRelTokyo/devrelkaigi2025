import { useParams } from "@remix-run/react";
import { setLang } from "~/utils/i18n";

export default function Registration() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  return (
    <section className="registration">
      <div className="container-fuild p-0">
        <div className="row">
          <div className="col-lg-6 col-md-12 p-0">
            <div className="service-block bg-service overlay-primary text-center">
              <div className="row no-gutters">
                <div className="col-6">
                  <div className="service-item">
                    <i className="fa fa-microphone"></i>
                    <h5>{t('40+ Speakers')}</h5>
                  </div>
                </div>
                <div className="col-6">
                  <div className="service-item">
                    <i className="fa fa-flag"></i>
                    <h5>500 + Seats</h5>
                  </div>
                </div>
                <div className="col-6">
                  <div className="service-item">
                    <i className="fa fa-ticket"></i>
                    <h5>300 tickets</h5>
                  </div>
                </div>
                <div className="col-6">
                  <div className="service-item">
                    <i className="fa fa-calendar"></i>
                    <h5>3 days event</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}