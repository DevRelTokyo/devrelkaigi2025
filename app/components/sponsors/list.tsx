import { useParams } from "@remix-run/react";
import { setLang } from "~/utils/i18n";
import sponsors from "~/data/sponsors.json";

interface SponsorListProps {
  level: string;
  columnCount: number;
};

export default function SponsorList({ level, columnCount }: SponsorListProps) {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  return (
    <>
      { sponsors.find(s => s.level === level.toLocaleLowerCase()) && (
        <div className="row">
          <div className="col-12">
            <h4 className="text-center" style={{ color: 'white' }}>
              {t(`${level} Sponsors`)}
            </h4>
          </div>
          <div className="col-12">
            <div className="row">
              {sponsors.filter(s => s.level === level.toLocaleLowerCase()).map((sponsor, index) => (
                <div className={`col-${columnCount} text-center`} key={index}
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                >
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={sponsor.logo.url} alt={sponsor.name}
                      style={{ width: '100%', height: 'auto', padding: '1em' }}
                    />
                    <strong>
                      {sponsor.name}
                    </strong>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
