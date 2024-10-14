import { setLang } from "../i18n";

export default function Sponsors({ lang }: Props) {
	const {t} = setLang(lang);
	return (
		<section class="sponsors section bg-sponsors">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="section-title">
							<h3
								dangerouslySetInnerHTML={{
									__html: t('Our <span class="alternate">Sponsors</span>')
								}}
								style="color:white"
							></h3>
							<p
								style="color:white"
							>
								{t('DevRelKaigi 2025 is supported by wonderful sponsors.')}
							</p>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="sponsor-btn text-center">
							<a href={`${lang}/contact`} class="btn btn-main-md">{t('Request sponsor brochure')}</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
