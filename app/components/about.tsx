import { setLang } from "../i18n";

export default function About({ lang }: Props) {
	const { t } = setLang(lang);
	return (
		<section className="section about">
			<div className="container">
				<div className="row">
					<div className="col-lg-4 col-md-6 align-self-center">
						<div className="image-block bg-about">
							<img className="img-fluid" src="/static/images/speakers/featured-speaker.jpg" alt="" />
						</div>
					</div>
					<div className="col-lg-8 col-md-6 align-self-center">
						<div className="content-block">
							<h2
								dangerouslySetInnerHTML={{
									__html: t('About The <span class="alternate">DevRelKaigi</span>')}}
							></h2>
							<div className="description-one">
								<p
								>
									{t('About.MainMessage1')}
									<br />
									{t('About.MainMessage2')}
								</p>
							</div>
							<div className="description-two">
								<p>
									{t('About.SubMessage')}
								</p>
							</div>
							<ul className="list-inline">
								<li className="list-inline-item">
									<a href="#" className="btn btn-main-md">{t('Send proposal')}</a>
								</li>
								<li className="list-inline-item">
									<a href="#" className="btn btn-transparent-md">{t('Read more')}</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}