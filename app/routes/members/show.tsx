import FooterMain from "../../components/footerMain";
import FooterSub from "../../components/footerSub";
import Navi from "../../islands/navi";
import MemberShow from "../../components/members/show";
import { Parse } from '../../parse';
interface Props {
	lang: string;
	member: Parse.Object;
}

export default function Show({lang, member}: Props) {
	return (
		<>
      <Navi lang={lang} />
			<MemberShow
				lang={lang}
				member={member}
			/>
      <FooterMain lang={lang} />
      <FooterSub lang={lang} />
		</>
	);
}