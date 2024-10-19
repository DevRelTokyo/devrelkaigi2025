import FooterMain from "../../components/footerMain";
import FooterSub from "../../components/footerSub";
import Navi from "../../islands/navi";
import ProfileIndex from "../../islands/profiles";

export default function Index({lang}: Props) {
	return (
		<>
      <Navi lang={lang} />
			<ProfileIndex
				lang={lang}
			/>
      <FooterMain lang={lang} />
      <FooterSub lang={lang} />
		</>
	);
}