import FooterMain from "../../components/footerMain";
import FooterSub from "../../components/footerSub";
import Navi from "../../components/navi";
import ProposalForm from "../../islands/proposalForm";
import { useSchema } from "../../schemas/proposal";

export default function New({lang, objectId}: Props) {
	const schema = useSchema(lang);
	return (
		<>
      <Navi lang={lang} />
			<ProposalForm
				lang={lang}
				objectId={objectId}
			/>
      <FooterMain lang={lang} />
      <FooterSub lang={lang} />
		</>
	);
}