import FooterMain from "../../components/footerMain";
import FooterSub from "../../components/footerSub";
import Navi from "../../islands/navi";
import Form from "../../islands/proposals/form";
import { useSchema } from "../../schemas/proposal";

export default function Edit({lang, objectId}: Props) {
	const schema = useSchema(lang);
	return (
		<>
      <Navi lang={lang} />
			<Form
				lang={lang}
				objectId={objectId}
			/>
      <FooterMain lang={lang} />
      <FooterSub lang={lang} />
		</>
	);
}