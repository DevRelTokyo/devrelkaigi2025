import FooterMain from "../../components/footerMain";
import FooterSub from "../../components/footerSub";
import Navi from "../../islands/navi";
import ProposalIndex from "../../islands/proposals";
import { useSchema } from "../../schemas/proposal";

export default function Index({lang, objectId}: Props) {
	const schema = useSchema(lang);
	return (
		<>
      <Navi lang={lang} />
			<ProposalIndex
				lang={lang}
			/>
      <FooterMain lang={lang} />
      <FooterSub lang={lang} />
		</>
	);
}