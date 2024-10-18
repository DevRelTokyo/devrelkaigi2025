import { setLang } from "../i18n";

export default function FooterMain({ lang }: Props) {
	return (
		<footer className="footer-main">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="block text-center">
							<div className="footer-logo">
								<img
									src="/assets/images/logo-dark.png"
									alt="logo"
									className="img-fluid"
									width={250}
								/>
							</div>
							<ul className="social-links-footer list-inline">
								<li className="list-inline-item">
									<a href="https://www.linkedin.com/groups/14542243/">
										<i class="fa-brands fa-linkedin"></i>
									</a>
								</li>
								<li className="list-inline-item">
									<a href="https://x.com/devrelkaigi">
										<i class="fa-brands fa-x-twitter"></i>
									</a>
								</li>
								<li className="list-inline-item">
									<a href="https://www.instagram.com/devrelkaigi/"><i className="fab fa-instagram"></i></a>
								</li>
								<li className="list-inline-item">
									<a href="https://www.facebook.com/profile.php?id=61567096953218">
										<i class="fa-brands fa-facebook"></i>
									</a>
								</li>
								<li className="list-inline-item">
									<a href="https://www.youtube.com/@DevRelKaigi"><i className="fab fa-youtube"></i></a>
								</li>
							</ul>
						</div>

					</div>
				</div>
			</div>
		</footer>
	);
}