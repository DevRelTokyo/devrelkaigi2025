import { Link, useParams } from "@remix-run/react";
import { c, s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { setLang } from "~/utils/i18n";
import profileJson from '../data/profiles.json';
import { Profile } from "../types/data";

type ScheduleItem = {
  track: string;
  speaker_id: string;
  title: string;
  speaker: string;
  profile_id: string;
  session_title: string;
  session_description: string;
  organization: string;
  profile?: Profile;
}

type ScheduleProps = {
  en: { [key: string]: ScheduleItem[] };
  ja: { [key: string]: ScheduleItem[] };
}

export default function ScheduleDay({schedule}: {schedule: ScheduleProps}) {
  const { locale } = useParams();
  const { t } = setLang(locale!);
  const getProfile = (speakerId: string) => {
    if (!speakerId) return undefined;
    const profiles = profileJson.filter((profile) => profile.user === speakerId);
    if (speakerId === 'e4pzCffXit') {
      console.log(profiles);
    }
    if (profiles.length === 2) {
      const profile = profiles.find((p) => p.lang === locale);
      if (profile) return profile;
    }
    return profiles[0];
  }

  Object.entries(schedule).map(([locale, schedules]) => {
    Object.entries(schedules).forEach(([time, scheduleItem]) => {
      scheduleItem.forEach((scheduleItem) => {
        scheduleItem.profile = getProfile(scheduleItem.speaker_id);
        if (scheduleItem.speaker_id === 'e4pzCffXit') {
          console.log(scheduleItem.profile);
        }
      });
    });
  });

  const getImage = (profile?: Profile) => {
    if (!profile) return '';
    if (profile.objectId === 'e4pzCffXit') {
      console.log(profile);
    }
    if (!profile.image_file) return profile.image_url;
    try {
      const object = JSON.parse(profile.image_file as any);
      if (object && object.url) return object.url;
    } catch (e) {
    }
    return '';
  }

  return (<>
    <div className="row">
      {Object.entries(schedule).map(([locale, schedules]) => (
        <>
          <div key={locale} className="col-md-12">
            <h5>{t(locale)} {t('Track')}</h5>
          </div>
          <div key={locale} className="col-md-12">
            {Object.entries(schedules).map(([time, ary]) => (
              <div className="row schedule-time" key={time} style={{ marginBottom: '1em' }}>
                <div className="col-md-2">{ time }</div>
                { ary[0].track === 'C' ?
                  <>
                    <div className="col-md-10">
                      { t(ary[0].title)}
                    </div>
                  </> :
                  <>
                    { ary.map(item => (
                      <>
                        <div className="col-md-5">
                          <div className="row">
                            <div key={item.track} className="schedule-item">
                              { item.profile && item.profile.slug ?
                                <strong>
                                  <Link to={`/${locale}/speakers/${item.profile!.slug}`}>
                                    {item.session_title}
                                  </Link>
                                </strong>
                                : <>
                                <span>{item.speaker}</span>
                              </> }
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              { getImage(item.profile) !== '' &&
                                <img
                                  src={getImage(item.profile)} alt={item.speaker} style={{
                                  width: '100%', aspectRatio: 1 / 1, objectFit: 'cover', padding: '1em',
                                }} />
                              }
                            </div>
                            <div className="col-md-8"
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              {item.speaker}{ item.organization ? `, ${item.organization}` : '' }
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </>
                }
              </div>
            ))}
          </div>
        </>
      ))}
    </div>
  </>);
}``