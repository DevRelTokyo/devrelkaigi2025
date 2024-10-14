import { setLang } from "../i18n";

export default function Speakers({ lang }: Props) {
  const { t } = setLang(lang);
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
								<a href={`/${lang}/news/what-is-first-cfp`}>{t('What is the 1ST CFP mean?')}</a>
							</p>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-3 col-md-4 col-sm-6">
						
					</div>
				</div>
			</div>
		</section>
	);
}