import { Schema } from "~/types/schema";
import { setLang } from "~/utils/i18n";

const useSchema = (lang: string): Schema[] => {
	const { t } = setLang(lang);
	return [
		{
			name: 'name',
			type: 'text',
			label: t('Name'),
			placeholder: t('Role name'),
			required: true,
		},
		{
			type: 'submit',
			name: 'submit',
			label: t('Submit'),
		}
	];
};

export { useSchema };