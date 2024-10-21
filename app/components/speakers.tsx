import { useParams } from "@remix-run/react";
import { setLang } from "../utils/i18n";

export default function Speakers() { 
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
	return (
		<section className="section speakers bg-speaker">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="section-title white">
							<h3
								dangerouslySetInnerHTML={{
									__html: t('Who <span class="alternate">Speaking?</span>')}}
							></h3>
							<p>
								{t('Our awesome speaker is YOU! We\'re openning 1st CFP until 31st March 2025!')}
							</p>
							<p>
								<a href={`/${locale}/news/what-is-first-cfp`}>{t('What is the 1ST CFP mean?')}</a>
							</p>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col text-center" style={{paddingBottom: '2em'}}>
						<a href={`/${locale}/proposals/new`} className="btn btn-main-md">{t('Send proposal')}</a>
					</div>
				</div>
			</div>
		</section>
	);
}