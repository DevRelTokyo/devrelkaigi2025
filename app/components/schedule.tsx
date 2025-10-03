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
                  <a className="nav-link" href="#oct4" data-toggle="pill">
                    {t('Day 3')}
                    <span>{t('4th October')}</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="schedule-contents">
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