import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { json, ServerRuntimeMetaArgs } from "@remix-run/server-runtime";
import FooterMain from '~/components/footerMain';
import FooterSub from '~/components/footerSub';
import { useParams } from '@remix-run/react';
import Breadcrumb from '~/components/breadcrumb';
import markdownIt from 'markdown-it';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faFacebook,
  faLinkedin,
  faYoutube,
  faGoogle,
  faInstagram,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

import Navi from '~/components/navi';
import { ENV } from '~/types/env';
import { Profile, ProfileResult } from '~/types/profile';
import { setLang } from '~/utils/i18n';
import speakers from "~/data/speakers.json";

import workshopJson from "../../data/workshops.json";
import profileJson from "../../data/profiles.json";
import { Workshop } from "../../types/data";

import { RemixHead } from 'remix-head';
import { s } from 'node_modules/vite/dist/node/types.d-aGj9QkWt';

interface MetaProps {
  title: string;
  description: string;
  member: Profile;
}

const icon = (social: string) => {
  if (social.includes("github.com")) return faGithub;
  if (social.includes("facebook.com")) return faFacebook;
  if (social.includes("linkedin.com")) return faLinkedin;
  if (social.includes("youtube.com")) return faYoutube;
  if (social.includes("google.com")) return faGoogle;
  if (social.includes("instagram.com")) return faInstagram;
  if (social.includes("whatsapp.com")) return faWhatsapp;
  if (social.includes("x.com") || social.includes("twitter.com"))
    return faXTwitter;
  return faGlobe;
};


export default function WorkshopShow() {
  const { locale, slug } = useParams();
  const { t } = setLang(locale!);
  const md = markdownIt();

  const session: Workshop | undefined = workshopJson.find(workshop => workshop.id === slug);
  if (!session) {
    return (
      <>404 Not Found</>
    );
  }
  const speaker = profileJson.find(speaker => speaker.user === session.user);
  if (!speaker) {
    return (
      <>404 Not Found</>
    );
  }
  return (<>
    <Navi />
      <div
        className="container"
        style={{
          paddingTop: "150px",
          paddingBottom: "40px",
        }}
      >
      <div className="row">
        <div className="col-8 offset-2"
          style={{ paddingTop: "2em", paddingBottom: "2em" }}
        >
          <Breadcrumb
            items={[
              { label: t("Home"), href: `/${locale}` },
              { label: speaker.name },
            ]}
          />
          {session && (
            <>
              <h3>{t("Workshop")}</h3>
              <h4
                style={{paddingTop: "0.5em"}}
              >{session.session_title}</h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: md.render(session.description || ""),
                }}
              />
              {session.audiences !== "" && (<>
                <h5
                  style={{paddingTop: "0.5em"}}
                >{t("Target Audience")}</h5>
                <p
                  dangerouslySetInnerHTML={{
                    __html: md.render(session.audiences || ""),
                  }}
                />
              </>)}
              {session.points !== "" && (<>
                <h5
                  style={{paddingTop: "0.5em"}}
                >{t('Points')}</h5>
                <p
                dangerouslySetInnerHTML={{
                  __html: md.render(session.points || ""),
                }}
                />
              </>)}
              {session.timeline !== "" && (<>
                <h5
                  style={{paddingTop: "0.5em"}}
                >{t('Time line')}</h5>
                <p
                  dangerouslySetInnerHTML={{
                    __html: md.render(session.timeline || ""),
                  }}
                />
              </>)}
            </>
          )}
        </div>
        <div className="col-8 offset-2">
          {speaker && (
            <>
              <RemixHead>
                <title>{`${speaker.name} - DevRelKaigi 2025`}</title>
                <meta property="og:title" content={`${speaker.name} - DevRelKaigi 2025`} />
                <meta property="og:description" content={`${speaker.name} - DevRelKaigi 2025`} />
                <meta property="og:url" content={`https://devrelkaigi.org/${locale}/speakers/${speaker.slug}`} />
                <meta property="og:image" content={`https://ogp.devrel.tokyo/?url=${encodeURIComponent(`https://devrelkaigi.org/${locale}/ogp/${speaker.slug}`)}&width=1200&height=630`} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="DevRelKaigi 2025" />
              </RemixHead>
              <h3>{t("Teacher")}: {speaker.name}</h3>
              <h4>
                {speaker.organization && (
                  <>
                    {speaker.title}
                    {t(" at ")}
                    {speaker.organization}
                  </>
                )}
              </h4>
              <div className="row">
                <div className="col-8">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: md.render(speaker.profile || ""),
                    }}
                  />
                  <h4
                    style={{
                      paddingTop: "1em",
                    }}
                  >
                    {t("Social accounts")}
                  </h4>
                  <p>
                    <ul
                      style={{
                        listStyleType: "none",
                        paddingLeft: 0,
                        display: "flex",
                      }}
                    >
                      {(JSON.parse(speaker.socials || "[]") || []).map((social, index) => (
                        <li
                          key={index}
                          style={{
                            marginRight: "1em",
                            display: "inline-block",
                          }}
                        >
                          <a
                            href={social}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon
                              icon={icon(social)}
                              width={25}
                              height={25}
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </p>
                </div>
                <div className="col-4">
                  {(speaker.image_file || speaker.image_url) && (
                    <img
                      src={speaker.image_url || JSON.parse(speaker.image_file!).url}
                      alt={speaker.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        padding: "1em",
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    <FooterMain />
    <FooterSub />
  </>);
}
