import { setLang } from "../i18n";
import FooterMain from "./footerMain";
import FooterSub from "./footerSub";
import Navi from "./navi";
import Subscribe from "./subscribe";

export default function NotFound({lang}: Props) {
	const { t } = setLang(lang);
	return (
		<>
			<Navi lang={lang} />
			<section class="page-title bg-title overlay-dark">
				<div class="container">
					<div class="row">
						<div class="col-12 text-center">
							<div class="title">
								<h3>Error</h3>
							</div>
							<ol class="breadcrumb justify-content-center p-0 m-0">
								<li class="breadcrumb-item"><a href="index.html">Home</a></li>
								<li class="breadcrumb-item active">Error</li>
							</ol>
						</div>
					</div>
				</div>
			</section>
			<section class="section error">
				<div class="container">
					<div class="row">
						<div class="col-md-6 m-auto">
							<div class="block text-center">
								<img src="/static/images/404.png" class="img-fluid" alt="404" />
								<h3>Oops!... <span>Page Not Found.</span></h3>
								<a href="/" class="btn btn-main-md">Go to home</a>
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