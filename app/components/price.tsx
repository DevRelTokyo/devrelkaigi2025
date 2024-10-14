import { setLang } from "../i18n";

export default function PriceTable({ lang }: Props) {
	const { t } = setLang(lang);
	const col = lang === 'ja' ? 4 : 4;
	return (
		<section className="section pricing">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="section-title">
							<h3
								dangerouslySetInnerHTML={{
									__html: t('Get <span class="alternate">ticket</span>')}}
							></h3>
							<p>
								{t('The tickets will be available from 1st June 2025')}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}