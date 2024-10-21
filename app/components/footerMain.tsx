import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin, faSquareFacebook, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function FooterMain() {
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
									<div>
										<a href="https://www.linkedin.com/groups/14542243/">
											<FontAwesomeIcon icon={faLinkedin} />
										</a>
									</div>
								</li>
								<li className="list-inline-item">
									<a href="https://x.com/devrelkaigi">
										<FontAwesomeIcon icon={faXTwitter} />
									</a>
								</li>
								<li className="list-inline-item">
									<a href="https://www.instagram.com/devrelkaigi/" target="_blank" rel="noreferrer">
										<FontAwesomeIcon icon={faInstagram} />
									</a>
								</li>
								<li className="list-inline-item">
									<a href="https://www.facebook.com/profile.php?id=61567096953218">
										<FontAwesomeIcon icon={faSquareFacebook} />
									</a>
								</li>
								<li className="list-inline-item">
									<a href="https://www.youtube.com/@DevRelKaigi">
										<FontAwesomeIcon icon={faYoutube} />
									</a>
								</li>
							</ul>
						</div>

					</div>
				</div>
			</div>
		</footer>
	);
}