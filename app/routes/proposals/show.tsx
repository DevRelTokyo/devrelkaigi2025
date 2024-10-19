import FooterMain from "../../components/footerMain";
import FooterSub from "../../components/footerSub";
import Navi from "../../islands/navi";
import ProposalShow from "../../islands/proposals/show";

export default function Show({lang, objectId}: Props) {
	return (
		<>
      <Navi lang={lang} />
			<ProposalShow
				lang={lang}
				objectId={objectId}
			/>
      <FooterMain lang={lang} />
      <FooterSub lang={lang} />
		</>
	);
}