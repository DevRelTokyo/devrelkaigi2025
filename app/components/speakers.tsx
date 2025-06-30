import { useParams, useState } from "@remix-run/react";
import { setLang } from "../utils/i18n";
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
  for (const speaker of speakersData) {
    if (!speaker.image_file && !speaker.image_url) continue;
    if (!speakers[speaker.user.objectId]) speakers[speaker.user.objectId] = {};
    speakers[speaker.user.objectId][speaker.lang] = speaker;
  }

  const getProfile = (profiles: { [key: string]: Speaker }, key: string) => {
    const profile = profiles[locale!] || profiles["en"];
    if (!profile) {
      console.warn(`Profile not found for locale: ${locale}`);
      return "";
    }
    return profile[key] || "";
  };

  const getImage = (profiles: { [key: string]: Speaker }) => {
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
          {Object.values(speakers).map((profiles, index) => (
            <div
              className="col-2 text-center"
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
