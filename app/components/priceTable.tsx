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
								{t('Our tickets are separa')}
							</p>
						</div>
					</div>
				</div>
				<div className="row">
					{ lang === 'ja' &&
						<>
							<div className={`col-md-${col}`}>
								<div className="pricing-item">
									<div className="pricing-heading">
										<div className="title">
											<h6>{t('Workshop')}</h6>
										</div>
										<div className="price">
											<h2
												dangerouslySetInnerHTML={{
													__html: t('<span>$</span>39.00')
												}}
											></h2>
										</div>
									</div>
									<div className="pricing-body">
										
										<ul className="feature-list m-0 p-0">
											<li><p><span className="fa fa-check-circle available"></span>{t('Workshop on 2nd Oct')}</p></li>
											<li><p><span className="fa fa-check-circle available"></span>{t('Drinks and Refreshments')}</p></li>
											<li><p><span className="fa fa-check-circle available"></span>{' '}</p></li>
											<li><p><span className="fa fa-check-circle available"></span>{' '}</p></li>
										</ul>
									</div>
									<div className="pricing-footer text-center">
										<a href="#" className="btn btn-transparent-md">Buy a ticket</a>
									</div>
								</div>
							</div>
						</>
					}
					<div className={`col-md-${col}`}>
						
						<div className="pricing-item">
							<div className="pricing-heading">
								
								<div className="title">
									<h6>{t('A day ticket')}</h6>
								</div>
								
								<div className="price">
									<h2
										dangerouslySetInnerHTML={{
											__html: t('<span>$</span>39.00')
										}}
									></h2>
								</div>
							</div>
							<div className="pricing-body">
								
								<ul className="feature-list m-0 p-0">
									<li><p><span className="fa fa-check-circle available"></span>{t('Every sessions on a day')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{t('Attend on 3rd or 4th Oct')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{t('Lunch')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{t('Drinks and Refreshments')}</p></li>
								</ul>
							</div>
							<div className="pricing-footer text-center">
								<a href="#" className="btn btn-transparent-md">Buy a ticket</a>
							</div>
						</div>
					</div>
					<div className={`col-md-${col}`}>
						
						<div className="pricing-item">
							<div className="pricing-heading">
								
								<div className="title">
									<h6>{t('2 days ticket')}</h6>
								</div>
								
								<div className="price">
									<h2
										dangerouslySetInnerHTML={{
											__html: t('<span>$</span>39.00')
										}}
									></h2>
								</div>
							</div>
							<div className="pricing-body">
								<ul className="feature-list m-0 p-0">
									<li><p><span className="fa fa-check-circle available"></span>{t('Every sessions on two days')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{t('Attend on 3rd and 4th Oct')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{t('Lunch')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{t('Drinks and Refreshments')}</p></li>
								</ul>
							</div>
							<div className="pricing-footer text-center">
								<a href="#" class="btn btn-transparent-md">Buy a ticket</a>
							</div>
						</div>
					</div>
					<div className={`col-md-${col}`}>
						
						<div className="pricing-item">
							<div className="pricing-heading">
								
								<div className="title">
									<h6>{t('A day + 🎉 ticket')}</h6>
								</div>
								
								<div className="price">
									<h2
										dangerouslySetInnerHTML={{
											__html: t('<span>$</span>39.00')
										}}
									></h2>
								</div>
							</div>
							<div className="pricing-body">
								
								<ul className="feature-list m-0 p-0">
									<li><p><span className="fa fa-check-circle available"></span>{t('Including a day ticket')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{t('After party on 4th Oct')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{' '}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{' '}</p></li>
								</ul>
							</div>
							<div className="pricing-footer text-center">
								<a href="#" className="btn btn-transparent-md">Buy a ticket</a>
							</div>
						</div>
					</div>
					<div className={`col-md-${col}`}>
						
						<div className="pricing-item">
							<div className="pricing-heading">
								<div className="title">
									<h6>{t('2 days + 🎉 ticket')}</h6>
								</div>
								
								<div className="price">
									<h2
										dangerouslySetInnerHTML={{
											__html: t('<span>$</span>39.00')
										}}
									></h2>
								</div>
							</div>
							<div className="pricing-body">
								
								<ul className="feature-list m-0 p-0">
									<li><p><span className="fa fa-check-circle available"></span>{t('Including two days ticket')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{t('After party on 4th Oct')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{' '}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{' '}</p></li>
								</ul>
							</div>
							<div className="pricing-footer text-center">
								<a href="#" className="btn btn-transparent-md">Buy a ticket</a>
							</div>
						</div>
					</div>
					<div className={`col-md-${col}`}>
						<div className="pricing-item featured">
							<div className="pricing-heading">
								<div className="title">
									<h6>{t('Full combo ticket')}</h6>
								</div>
								
								<div className="price">
									<h2
										dangerouslySetInnerHTML={{
											__html: t('<span>$</span>39.00')
										}}
									></h2>
								</div>
							</div>
							<div className="pricing-body">
								
								<ul className="feature-list m-0 p-0">
									<li><p><span className="fa fa-check-circle available"></span>{t('Including two days ticket')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{t('Workshop on 2nd Oct')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{t('After party on 4th Oct')}</p></li>
									<li><p><span className="fa fa-check-circle available"></span>{' '}</p></li>
								</ul>
							</div>
							<div className="pricing-footer text-center">
								<a href="#" className="btn btn-main-md">Buy a ticket</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}