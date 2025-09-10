import { useParams } from "@remix-run/react";
import { setLang } from "../utils/i18n";
import keynoteData from "../data/keynotes.json";
import speakersData from "../data/speakers.json";
import { Link } from "@remix-run/react";

type Speaker = {
  lang: string;
  name: string;
  slug: string;
  socials: string[];
  image_url?: string;
  organization?: string;
  title?: string;
  profile?: string;
  user: {
    objectId: string;
    className: string;
    __type: string;
  };
  image_file?: {
    __type: string;
    url: string;
  };
};

export default function Speakers() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  const speakers: {
    [key: string]: { [key: string]: Speaker };
  } = {};
  const keynotes: {
    [key: string]: { [key: string]: Speaker };
  } = {};
  for (const speaker of speakersData) {
    if (!speaker.image_file && !speaker.image_url) continue;
    if (!speakers[speaker.user.objectId]) speakers[speaker.user.objectId] = {};
    speakers[speaker.user.objectId][speaker.lang] = speaker;
  }

  for (const keynote of keynoteData) {
    if (!keynote.image_file && !keynote.image_url) continue;
    if (!keynotes[keynote.user.objectId]) keynotes[keynote.user.objectId] = {};
    keynotes[keynote.user.objectId][keynote.lang] = keynote as Speaker;
  }


  const getProfile = (profiles: { [key: string]: Speaker }, key: string) => {
    if (profiles && Object.keys(profiles).length === 1) {
      return profiles[Object.keys(profiles)[0]][key];
    }
    const profile = profiles[locale!] || profiles["en"];
    if (!profile) {
      console.warn(`Profile not found for locale: ${locale} ${JSON.stringify(profiles)}`);
      return "";
    }
    return profile[key] || "";
  };

  const getImage = (profiles: { [key: string]: Speaker }) => {
    if (Object.keys(profiles).length === 1) {
      return profiles[Object.keys(profiles)[0]].image_file?.url || profiles[Object.keys(profiles)[0]].image_url || "";
    }
    const profile = profiles[locale!] || profiles["en"];
    if (!profile) {
      console.warn(`Image not found for locale: ${locale}`);
      return "";
    }
    return profile.image_file?.url || profile.image_url || "";
  };

  return (
    <section className="section speakers bg-speaker">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title white">
              <h3
                dangerouslySetInnerHTML={{
                  __html: t('Who <span class="alternate">Speaking?</span>'),
                }}
              ></h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-center">
            <h1
              style={{color: "#fff", fontSize: "2.5em", marginBottom: "1em"}}
            >{t('Keynote Speakers')}</h1>
          </div>
          {Object.values(keynotes).map((keynote, index) => (
            <div className="col-4 text-center" key={index}>
            <Link to={`/${locale}/speakers/${getProfile(keynote, "slug")}`}>
                <img
                  src={getImage(keynote)}
                  alt={getProfile(keynote, "name")}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    padding: "1em",
                  }}
                />
                <strong>{getProfile(keynote, "name")}</strong>
              </Link>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-12 text-center">
            <h1
              style={{color: "#fff", fontSize: "2.5em", marginBottom: "1em", marginTop: "2em"}}
            >{t('Break out Speakers')}</h1>
          </div>
          {Object.values(speakers).map((profiles, index) => (
            <div
              className="col-3 text-center"
              style={{ paddingBottom: "2em" }}
              key={index}
            >
              <Link to={`/${locale}/speakers/${getProfile(profiles, "slug")}`}>
                <img
                  src={getImage(profiles)}
                  alt={getProfile(profiles, "name")}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    padding: "1em",
                  }}
                />
                <strong>{getProfile(profiles, "name")}</strong>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
