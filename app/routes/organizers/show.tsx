import { useParams } from "@remix-run/react";
import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import { setLang } from "~/utils/i18n";
import markdownIt from "markdown-it";
import { RemixHead } from "remix-head";
import Breadcrumb from "~/components/breadcrumb";
import organizers from "~/data/organizers.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faFacebook, faLinkedin, faYoutube, faGoogle, faInstagram, faWhatsapp, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function ArticleEdit() {
  const md = markdownIt();
  const { locale, slug } = useParams();
  const { t } = setLang(locale!);
  const organizer = organizers.find(o => o.slug === slug && o.lang === locale);

  const icon = (social: string) => {
    if (social.includes('github.com')) return faGithub;
    if (social.includes('facebook.com')) return faFacebook;
    if (social.includes('linkedin.com')) return faLinkedin;
    if (social.includes('youtube.com')) return faYoutube;
    if (social.includes('google.com')) return faGoogle;
    if (social.includes('instagram.com')) return faInstagram;
    if (social.includes('whatsapp.com')) return faWhatsapp;
    if (social.includes('x.com') || social.includes('twitter.com')) return faXTwitter;
    return faGlobe;
  }

  return (
    <>
      <Navi />
      <div className="container"
           style={{
             paddingTop: '150px',
             paddingBottom: '40px',
           }}
      >
        <div className="row">
          <div className="col-8 offset-2">
            {organizer && (
              <>
                <RemixHead>
                  <title>{`${organizer.name} - DevRelKaigi 2025`}</title>
                </RemixHead>
                <Breadcrumb items={[
                  { label: t('Home'), href: `/${locale}` },
                  { label: organizer.name }
                ]}
                />
                <h1>{organizer.name}</h1>
                <h3>
                  { organizer.organization && (
                    <>
                      { organizer.title }{ t(' at ') }{ organizer.organization }
                    </>
                  )}
              </h3>
              <div className="row">
                <div className="col-8">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: md.render(organizer.profile || '')
                    }}
                  />
                  <h4 style={{
                    paddingTop: '1em',
                  }}>{t('Social accounts')}</h4>
                  <p>
                    <ul style={{
                      listStyleType: 'none',
                      paddingLeft: 0,
                      display: 'flex',
                    }}>
                      { organizer.socials.map((social, index) => (
                        <li
                          key={index}
                          style={{
                            marginRight: '1em',
                            display: 'inline-block',
                          }}
                        >
                          <a href={social} target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={icon(social)} width={25} height={25} />
                          </a>
                        </li>
                        ))}
                    </ul>
                  </p>
                </div>
                <div className="col-4">
                  {(organizer.image_file || organizer.image_url) && (
                    <img
                      src={organizer.image_url || organizer.image_file!.url}
                      alt={organizer.name}
                      style={{ width: '100%', height: 'auto', padding: '1em' }}
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
