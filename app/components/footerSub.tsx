import { setLang } from "../i18n";

export default function FooterSub({ lang }: Props) {
	return (
		<footer className="subfooter">
			<div className="container">
				<div className="row">
					<div className="col-md-8 align-self-center">
						<div className="copyright-text">
							<p><a href="index.html">Eventre</a> &copy; 2021, Designed &amp; Developed by <a href="https://themefisher.com/">Themefisher</a>. The logo is designed by <a href="https://x.com/taiponrock" target="_blank">Taiji Hagino</a>
							</p>
						</div>
					</div>
					<div className="col-md-4">
						<a href="#" className="to-top"><i className="fa fa-angle-up"></i></a>
					</div>
				</div>
			</div>
		</footer>
	);
}