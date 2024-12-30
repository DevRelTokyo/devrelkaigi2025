import { useParams , useLoaderData } from "@remix-run/react";
import { setLang } from "../utils/i18n";
import { loader } from "~/routes";

export default function News() {
	const articles2 = useLoaderData<typeof loader>();
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
	console.log(articles2);
	const articles:string[] = [];
	return (
		<section className="news section">
			<div className="container">
				<div className="row">	
					<div className="col-12">
						<div className="section-title">
							<h3
								dangerouslySetInnerHTML={{
									__html: t('DevRelKaigi 2025 <span class="alternate">News</span>')
								}}
							></h3>
						</div>
					</div>
				</div>
				<div className="row">
					{articles!.map((article, index) => (
						<div key={index} className="col-lg-4 col-md-6 col-sm-8 col-10 m-auto">
							<div className="blog-post">
								<div className="post-thumb">
									<a href="news-single.html">
										<img src="/assets/images/news/post-thumb-one.jpg" alt="post-image" className="img-fluid" />
									</a>
								</div>
								<div className="post-content">
									<div className="date">
										<h4>20<span>May</span></h4>
									</div>
									<div className="post-title">
										<h2><a href="news-single.html">Elementum purus id ultrices.</a></h2>
									</div>
									<div className="post-meta">
										<ul className="list-inline">
											<li className="list-inline-item">
												<i className="fa fa-user-o"></i>
												<a href="/">Admin</a>
											</li>
											<li className="list-inline-item">
												<i className="fa fa-heart-o"></i>
												<a href="/">350</a>
											</li>
											<li className="list-inline-item">
												<i className="fa fa-comments-o"></i>
												<a href="/">30</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
