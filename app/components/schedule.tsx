import { useParams } from "@remix-run/react";
import { setLang } from "../utils/i18n";
import workshopJson from "../data/workshops.json";
import profileJson from "../data/profiles.json";
import { Link } from "@remix-run/react";
import { Workshop } from "../types/data";
import scheduleJson from '../data/schedule.json';
import ScheduleDay from "./schedule_day";

export default function Schedule() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  const workshops: Workshop[] = workshopJson.map(workshop => {
    return { ...workshop, profile: profileJson.find(profile => profile.user === workshop.user) };
  });
  return (
    <section className="section schedule" id="schedule">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title">
              <h3
                dangerouslySetInnerHTML={{
                  __html: t('Conference <span className="alternate">Schedule</span>')
                }}
              ></h3>
              <p>{t('What is your interested in?')}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="schedule-tab">
              <ul className="nav nav-pills text-center">
                <li className="nav-item">
                  <a className="nav-link active" href="#oct2" data-toggle="pill">
                    {t('Day 1')}
                    <span>{t('2nd October')}</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#oct3" data-toggle="pill">
                    {t('Day 2')}
                    <span>{t('3rd October')}</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#oct4" data-toggle="pill">
                    {t('Day 3')}
                    <span>{t('4th October')}</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="schedule-contents">
              <div className="schedule-item" id="oct2">
                <div className="row" style={{ marginBottom: '1em' }}>
                  <div className="col offset-md-2">
                    <h4>{t('2nd October')} {t('Workshop day')}</h4>
                    <p>
                      {t('The workshop will be provided by in only Japanese')}
                    </p>
                  </div>
                </div>
                <div className="row">
                  { workshops.map((workshop, index) => (<div
                    key={index}
                  >
                    <div className="col-10 offset-md-2 text-center">
                      <h4>🕒 {workshop.start_at}</h4>
                    </div>
                    <div className="col-10 offset-md-2">
                      <div className="row" style={{ marginBottom: '1em' }}>
                        <div className="col-md-3">
                          <p>
                            <img src={workshop.profile?.image_url || JSON.parse(workshop.profile?.image_file!).url} alt={workshop.profile?.name} width="200px" />
                            <br />
                            {workshop.profile?.name}@{workshop.profile?.organization}
                          </p>
                        </div>
                        <div className="col-md-9">
                          <div className="schedule-item">
                            <h5>
                              <Link to={`/${locale}/workshops/${workshop.id}`}
                                style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem' }}
                              >
                                {workshop.session_title}
                              </Link>
                            </h5>
                            <p>{workshop.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>))}
                </div>
              </div>
              <div className="schedule-item" id="oct3" style={{ paddingTop: '1em' }}>
                <div className="row">
                  <div className="col offset-md-2">
                    <h4>{t('3rd October')} {t('Business & Marketing day')}</h4>
                    <p>
                      <ScheduleDay schedule={scheduleJson[2] as any} />
                    </p>
                  </div>
                </div>
              </div>
              <div className="schedule-item" id="oct4" style={{ paddingTop: '1em' }}>
                <div className="row">
                  <div className="col offset-md-2">
                    <h4>{t('4th October')} {t('Developer & Community day')}</h4>
                    <p>
                      <ScheduleDay schedule={scheduleJson[3] as any} />
                    </p>
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