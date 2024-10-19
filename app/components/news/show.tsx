import { setLang } from "../../i18n";
import FooterMain from "../footerMain";
import FooterSub from "../footerSub";
import Navi from "../../islands/navi";
import Subscribe from "../subscribe";

type NewsShowProps = {
	lang: string;
	article: {
		title: string,
		body: string;
		createdAt: string;
		updatedAt: string;
		author: string;
		category: string;
	};
};

export default function Show({lang, article}: NewsShowProps) {
	const { t } = setLang(lang);
	return (
		<>
			<Navi lang={lang}	/>
			<section class="page-title bg-title overlay-dark">
				<div class="container">
					<div class="row">
						<div class="col-12 text-center">
							<div class="title">
								<h3>News Details</h3>
							</div>
							<ol class="breadcrumb justify-content-center p-0 m-0">
								<li class="breadcrumb-item"><a href="index.html">Home</a></li>
								<li class="breadcrumb-item active">News Details</li>
							</ol>
						</div>
					</div>
				</div>
			</section>
			<section class="news section">
				<div class="container">
					<div class="row mt-30">
						<div class="col-lg-8 col-md-10 mx-auto">
							<div class="block">
								<article class="blog-post single">
									<div class="post-thumb">
										<img src="/assets/images/news/single-post.jpg" alt="post-image" class="img-fluid" />
									</div>
									<div class="post-content">
										<div class="date">
											<h4>20<span>May</span></h4>
										</div>
										<div class="post-title">
											<h3>Elementum purus id ultrices.</h3>
										</div>
										<div class="post-meta">
											<ul class="list-inline">
												<li class="list-inline-item">
													<i class="fa fa-user-o"></i>
													<a href="#">Admin</a>
												</li>
											</ul>
										</div>
										<div class="post-details">
											<p>
												Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusm tempor incididunt ut labore dolore magna aliqua enim ad minim veniam quis nostrud.laboris nisi ut aliquip ex ea commodo conse
												quat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
											</p>
											<p>
												Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
											</p>
											<p>
												Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam.
												quaerat voluptatem.
											</p>
											<div class="quotes">
												<blockquote>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusm tempor incididunt ut labore dolore magna aliqua enim ad minim veniam quis nostrud.laboris nisi ut aliquip ex ea commodo consequat. </blockquote>
											</div>
											<p>
												Amet consectetur adipisicing elit, sed do eiusm tempor incididunt ut labore dolore magna aliqua enim ad minim veniam quis nostrud.laboris nisi ut aliquip ex ea commodo conse
											</p>
											<div class="share-block">
												<div class="share">
													<p>
														Share: 
													</p>
													<ul class="social-links-share list-inline">
															<li class="list-inline-item">
																<a href="#"><i class="fa fa-facebook"></i></a>
															</li>
															<li class="list-inline-item">
																<a href="#"><i class="fa fa-twitter"></i></a>
															</li>
															<li class="list-inline-item">
																<a href="#"><i class="fa fa-instagram"></i></a>
															</li>
															<li class="list-inline-item">
																<a href="#"><i class="fa fa-rss"></i></a>
															</li>
															<li class="list-inline-item">
																<a href="#"><i class="fa fa-vimeo"></i></a>
															</li>
														</ul>
												</div>
											</div>
										</div>
									</div>
								</article>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Subscribe lang={lang} />
			<FooterMain lang={lang} />
			<FooterSub lang={lang} />
		</>
	);
}