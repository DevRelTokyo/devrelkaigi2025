import { setLang } from "../i18n";

export default function Subscribe({ lang }: Props) {
	const { t } = setLang(lang);
	return (
		<section className="cta-subscribe bg-subscribe">
			<div className="container">
				<div className="row">
					<div className="col-md-6 mr-auto">
						<div className="content">
							<h3
								dangerouslySetInnerHTML={{
									__html: t('Subscribe to Our <span class="alternate">Newsletter</span>')}}
							>
							</h3>
							<p>{t('We send you the latest information about DevRelKaigi(we never send spam)')}</p>
						</div>
					</div>
					<div className="col-md-6 ml-auto align-self-center">
						<form action="#" className="row">
							<div className="col-lg-8 col-md-12">
								<input
									type="email"
									className="form-control main white mb-lg-0"
									placeholder={t('Email')}
								/>
							</div>
							<div className="col-lg-4 col-md-12">
								<div className="subscribe-button">
									<button className="btn btn-main-md">{t('Subscribe')}</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}