import { useParams } from "@remix-run/react";
import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import { setLang } from "~/utils/i18n";
import markdownIt from "markdown-it";
import { RemixHead } from "remix-head";
import Breadcrumb from "~/components/breadcrumb";
import speakers from "~/data/speakers.json";
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

export default function ArticleEdit() {
  const md = markdownIt();
  const { locale, slug } = useParams();
  const { t } = setLang(locale!);
  const speaker = speakers.find((o) => o.slug === slug && o.lang === locale);

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

  return (
    <>
      <Navi />
      <div
        className="container"
        style={{
          paddingTop: "150px",
          paddingBottom: "40px",
        }}
      >
        <div className="row">
          <div className="col-8 offset-2">
            {speaker && (
              <>
                <RemixHead>
                  <title>{`${speaker.name} - DevRelKaigi 2025`}</title>
                  <meta property="og:title" content={`${speaker.name} - DevRelKaigi 2025`} />
                  <meta property="og:description" content={`${speaker.name} - DevRelKaigi 2025`} />
                  <meta property="og:url" content={`https://devrelkaigi.org/${locale}/speakers/${speaker.slug}`} />
                  <meta property="og:image" content={`/${locale}/speakers/${speaker.slug}/ogp.jpg`} />
                  <meta property="og:type" content="article" />
                  <meta property="og:site_name" content="DevRelKaigi 2025" />
                </RemixHead>
                <Breadcrumb
                  items={[
                    { label: t("Home"), href: `/${locale}` },
                    { label: speaker.name },
                  ]}
                />
                <h1>{speaker.name}</h1>
                <h3>
                  {speaker.organization && (
                    <>
                      {speaker.title}
                      {t(" at ")}
                      {speaker.organization}
                    </>
                  )}
                </h3>
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
                        {speaker.socials.map((social, index) => (
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
                        src={speaker.image_url || speaker.image_file!.url}
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
    </>
  );
}
