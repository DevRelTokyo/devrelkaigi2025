import { useParams } from "@remix-run/react";
import { setLang } from "../utils/i18n";

export default function Schedule() {
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
	return (
		<section className="section schedule">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="section-title">
						<h3
								dangerouslySetInnerHTML={{
									__html: t('Conference <span className="alternate">Schedule</span>')}}
							></h3>
							<p>{t('What is your interested in?')}</p>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="schedule-tab">
							<ul className="nav nav-pills text-center">
								<li className="nav-item">
									<a className="nav-link" href="#oct2" data-toggle="pill">
										{t('Day 1')}
										<span>{t('2nd October')}</span>
									</a>
								</li>
								<li className="nav-item">
									<a className="nav-link active" href="#oct3" data-toggle="pill">
										{t('Day 2')}
										<span>{t('3rd October')}</span>
									</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="#oct4" data-toggle="pill">
										{t('Day 3')}
										<span>{t('4th October')}</span>
									</a>
								</li>
							</ul>
						</div>
						<div className="schedule-contents">
							<div className="schedule-item" id="nov20">
								<div className="row">
									<div className="col offset-md-2">
										<h4>{t('2nd October')} {t('Workshop day')}</h4>
										<p>
											{t('The workshop will be provided by in only Japanese')}
										</p>
									</div>
								</div>
							</div>
							<div className="schedule-item" id="nov21" style={{paddingTop: '1em'}}>
								<div className="row">
									<div className="col offset-md-2">
										<h4>{t('3rd October')} {t('Business & Marketing day')}</h4>
										<p>
											{t('English and Japanese tracks')}
										</p>
									</div>
								</div>
							</div>
							<div className="schedule-item" id="nov22" style={{paddingTop: '1em'}}>
								<div className="row">
									<div className="col offset-md-2">
										<h4>{t('4th October')} {t('Developer & Community day')}</h4>
										<p>
											{t('English and Japanese tracks')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}