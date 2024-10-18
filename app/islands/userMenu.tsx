import { useState } from "hono/jsx";
import { setLang } from "../i18n";
import { Parse } from "../parse";
export default function ProposalForm({lang}: Props) {
	const [user, setUser ] = useState<Parse.User | undefined>(Parse.User.current());

	const { t } = setLang(lang);
	return (
		<a href="/auth/github" className="ticket">
			<img src="/assets/images/icon/user.png" alt="User" />
			<span>{t('Register')}</span>
		</a>
	)
}