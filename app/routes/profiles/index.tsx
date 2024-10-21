import FooterMain from "~/components/footerMain";
import FooterSub from "~/components/footerSub";
import Navi from "~/components/navi";
import ProfileIndex from "~/components/profiles";

export default function Index() {
	return (
		<>
      <Navi />
			<ProfileIndex />
      <FooterMain />
      <FooterSub />
		</>
	);
}