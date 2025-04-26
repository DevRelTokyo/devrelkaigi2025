import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FooterSub() {
  return (
    <footer className="subfooter">
      <div className="container">
        <div className="row">
          <div className="col-md-8 align-self-center">
            <div className="copyright-text">
              <p><a href="index.html">Eventre</a> &copy; 2021, Designed &amp; Developed by <a href="https://themefisher.com/">Themefisher</a>. The logo is designed by <a href="https://x.com/taiponrock" target="_blank" rel="noreferrer">Taiji Hagino</a>
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <a href="/" className="to-top">
              <FontAwesomeIcon icon={faAngleUp} style={{ fontSize: 50 }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}