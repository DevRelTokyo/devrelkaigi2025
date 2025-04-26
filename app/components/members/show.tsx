import { setLang } from "~/utils/i18n";
import markdownit from 'markdown-it';
import { useParams } from "@remix-run/react";
import { Profile } from "~/types/profile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faLinkedin, faSquareFacebook, faSquareGithub, faSquareInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

type MemberShowProps = {
  member: Profile;
};

export default function Show({ member }: MemberShowProps) {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);

  const image = () => {
    if (member.image_file) return member.image_file.url;
    if (member.image_url) return member.image_url;
    return '/assets/images/icon/user.png';
  };

  const md = markdownit();
  const toMarkdown = (html: string) => {
    return md.render(html);
  };

  const icon = (url: string): IconProp => {
    if (url.includes('twitter')) return faXTwitter;
    if (url.startsWith('https://x.com')) return faXTwitter;
    if (url.includes('facebook')) return faSquareFacebook;
    if (url.includes('linkedin')) return faLinkedin;
    if (url.includes('github')) return faSquareGithub;
    if (url.includes('instagram')) return faSquareInstagram;
    return faGlobe;
  };

  return (
    <>
      <section className="page-title bg-title">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <ol className="breadcrumb justify-content-center pb-2 m-0">
                <li className="breadcrumb-item"><a href={`/${locale}`}>{t('Home')}</a></li>
                <li className="breadcrumb-item" style={{ paddingLeft: 0, paddingRight: 0 }}>&gt;</li>
                <li className="breadcrumb-item active" style={{ paddingLeft: 0 }}>{member.name}</li>
              </ol>
              <div className="title">
                <h3>
                  {member.name}
                  {member.organization ? `@${member.organization}` : ''}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section single-speaker">
        <div className="container">
          <div className="block">
            <div className="row">
              <div className="col-lg-5 col-md-6 align-self-md-center">
                <div className="image-block">
                  <img src={image()} className="img-fluid" alt="speaker"
                    width={500} height={500}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-lg-7 col-md-6 align-self-center">
                <div className="content-block">
                  <div className="name">
                    <h3>{member.name}</h3>
                  </div>
                  <div className="profession">
                    <p>{member.title}</p>
                  </div>
                  <div className="details"
                    dangerouslySetInnerHTML={{
                      __html: toMarkdown(`${member.profile}`)
                    }}
                  >
                  </div>
                  <div className="social-profiles">
                    <h5>{t('Social Profiles')}</h5>
                    <ul className="list-inline social-list">
                      {(member.socials || []).map((url: string, i: number) => (
                        <li key={i} className="list-inline-item">
                          <a href={url}>
                            <FontAwesomeIcon icon={icon(url)} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}