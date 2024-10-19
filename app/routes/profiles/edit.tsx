import FooterMain from "../../components/footerMain";
import FooterSub from "../../components/footerSub";
import Navi from "../../islands/navi";
import ProfileForm from "../../islands/profiles/form";

export default function Edit({lang}: Props) {
	return (
		<>
      <Navi lang={lang} />
			<ProfileForm lang={lang} />
      <FooterMain lang={lang} />
      <FooterSub lang={lang} />
		</>
	);
}