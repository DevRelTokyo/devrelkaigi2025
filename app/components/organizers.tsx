import organizers from '~/data/organizers.json';
import { useParams, Link } from '@remix-run/react';
import { setLang } from '~/utils/i18n';

export default function Speakers() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  return (
    <section className="section speakers bg-speaker">
      <div id="organizer" name="organizer"></div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title white">
              <h3>{t('Organizers')}</h3>
              <p>
                {t("We're organizing DevRelKaigi 2025")}
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          {organizers
            .filter(o => o.lang === locale)
            .filter(o => o.image_file || o.image_url)
            .map((organizer, index) => (
              <div className="col-2 text-center"
                style={{ paddingBottom: '2em' }}
                key={index}
              >
                <Link
                  to={`/${locale}/organizers/${organizer.slug}`}
                >
                  <img
                    src={organizer.image_file ? organizer.image_file.url : organizer.image_url}
                    alt={organizer.name}
                    style={{ width: '100%', height: 'auto', padding: '1em' }}
                  />
                  <strong>{organizer.name}</strong>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
