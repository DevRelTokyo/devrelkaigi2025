import { useParams } from "@remix-run/react";
import { setLang } from "../utils/i18n";
import { Link } from "@remix-run/react";

export default function PriceTable() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  const col = locale === "ja" ? 4 : 4;
  return (
    <section className="section pricing">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title">
              <h3
                dangerouslySetInnerHTML={{
                  __html: t('Get <span class="alternate">ticket</span>'),
                }}
              ></h3>
              <p>{t("Our tickets are separate by features")}</p>
              <p>
                <Link to={`/${locale}/contact?category=invoice`}>
                  {t("We support invoice payment. Please contact us here")}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          {locale === "ja" && (
            <>
              <div className={`col-md-${col}`}>
                <div className="pricing-item">
                  <div className="pricing-heading">
                    <div className="title">
                      <h6>{t("Workshop")}</h6>
                    </div>
                    <div className="price">
                      <h2
                        dangerouslySetInnerHTML={{
                          __html: t("<span>$</span>50.00"),
                        }}
                      ></h2>
                    </div>
                  </div>
                  <div className="pricing-body">
                    <ul className="feature-list m-0 p-0">
                      <li>
                        <p>
                          <span className="fa fa-check-circle available"></span>
                          {t("Workshop at 1PM to 5PM on 2nd Oct")}
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="fa fa-check-circle available"></span>
                          {t("Drinks and Refreshments on 2nd Oct")}
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="fa fa-check-circle available"></span>{" "}
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="pricing-footer text-center">
                    <a
                      href="https://ti.to/devrelkaigi/2025/with/japanese"
                      target="_blank"
                      className="btn btn-transparent-md"
                    >
                      {t("Buy a ticket")}
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className={`col-md-${col}`}>
            <div className="pricing-item">
              <div className="pricing-heading">
                <div className="title">
                  <h6>{t("Sessions ticket")}</h6>
                </div>

                <div className="price">
                  <h2
                    dangerouslySetInnerHTML={{
                      __html: t("<span>$</span>20.00"),
                    }}
                  ></h2>
                </div>
              </div>
              <div className="pricing-body">
                <ul className="feature-list m-0 p-0">
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Every sessions on 3rd and 4th Oct")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Refreshments and Drinks on 3rd and 4th Oct")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>{" "}
                    </p>
                  </li>
                </ul>
              </div>
              <div className="pricing-footer text-center">
                <a
                  href="https://ti.to/devrelkaigi/2025/with/only-sessions-3-4"
                  className="btn btn-transparent-md"
                  target="_blank"
                >
                  {t("Buy a ticket")}
                </a>
              </div>
            </div>
          </div>
          <div className={`col-md-${col}`}>
            <div className="pricing-item">
              <div className="pricing-heading">
                <div className="title">
                  <h6>{t("Sessions & Lunch")}</h6>
                </div>

                <div className="price">
                  <h2
                    dangerouslySetInnerHTML={{
                      __html: t("<span>$</span>30.00"),
                    }}
                  ></h2>
                </div>
              </div>
              <div className="pricing-body">
                <ul className="feature-list m-0 p-0">
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Every sessions on 3rd and 4th Oct")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Refreshments and Drinks")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Lunch on 4th Oct")}
                    </p>
                  </li>
                </ul>
              </div>
              <div className="pricing-footer text-center">
                <a
                  href="https://ti.to/devrelkaigi/2025/with/session-lunch"
                  className="btn btn-transparent-md"
                  target="_blank"
                >
                  {t("Buy a ticket")}
                </a>
              </div>
            </div>
          </div>
          <div className={`col-md-${col}`}>
            <div className="pricing-item">
              <div className="pricing-heading">
                <div className="title">
                  <h6>{t("Sessions & after party")}</h6>
                </div>

                <div className="price">
                  <h2
                    dangerouslySetInnerHTML={{
                      __html: t("<span>$</span>50.00"),
                    }}
                  ></h2>
                </div>
              </div>
              <div className="pricing-body">
                <ul className="feature-list m-0 p-0">
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Every sessions on 3rd and 4th Oct")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Refreshments and Drinks")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("After party on 4th Oct")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>{" "}
                    </p>
                  </li>
                </ul>
              </div>
              <div className="pricing-footer text-center">
                <a
                  href="https://ti.to/devrelkaigi/2025/with/xcvl1zeba8m"
                  className="btn btn-transparent-md"
                  target="_blank"
                >
                  {t("Buy a ticket")}
                </a>
              </div>
            </div>
          </div>
          <div className={`col-md-${col}`}>
            <div className="pricing-item">
              <div className="pricing-heading">
                <div className="title">
                  <h6>{t("Full combo")}</h6>
                </div>

                <div className="price">
                  <h2
                    dangerouslySetInnerHTML={{
                      __html: t("<span>$</span>60.00"),
                    }}
                  ></h2>
                </div>
              </div>
              <div className="pricing-body">
                <ul className="feature-list m-0 p-0">
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Every sessions on 3rd and 4th Oct")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Refreshments and Drinks")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Lunch on 4th Oct")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("After party on 4th Oct")}
                    </p>
                  </li>
                </ul>
              </div>
              <div className="pricing-footer text-center">
                <a
                  href="https://ti.to/devrelkaigi/2025/with/full-combo"
                  className="btn btn-transparent-md"
                  target="_blank"
                >
                  {t("Buy a ticket")}
                </a>
              </div>
            </div>
          </div>
          <div className={`col-md-${col}`}>
            <div className="pricing-item featured">
              <div className="pricing-heading">
                <div className="title">
                  <h6>{t("Personal Sponsor")}</h6>
                </div>

                <div className="price">
                  <h2
                    dangerouslySetInnerHTML={{
                      __html: t("<span>$</span>150.00"),
                    }}
                  ></h2>
                </div>
              </div>
              <div className="pricing-body">
                <ul className="feature-list m-0 p-0">
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Including full combo ticket")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("Speaker dinner on 2nd Oct")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>
                      {t("List your name on the website")}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="fa fa-check-circle available"></span>{" "}
                    </p>
                  </li>
                </ul>
              </div>
              <div className="pricing-footer text-center">
                <a
                  href="https://ti.to/devrelkaigi/2025/with/personal-sponsor"
                  className="btn btn-main-md"
                  target="_blank"
                >
                  {t("Buy a ticket")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
