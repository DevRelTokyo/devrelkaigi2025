import { Schema } from "~/types/schema";
import { setLang } from "~/utils/i18n";

const useSchema = (lang: string): Schema[] => {
	const { t } = setLang(lang);
	const schema: Schema[] = [
		{
			name: 'title',
			type: 'text',
			label: t('Session Title'),
			placeholder: t('Your awesome session title'),
			required: true,
		},
		{
			name: 'summary',
			type: 'textarea',
			label: t('Summary'),
			placeholder: t('Please give a clear and concise explanation of the session.'),
			row: 3,
			required: true,
		},
		{
			name: 'description',
			type: 'textarea',
			label: t('Description'),
			placeholder: t('Description of the session. Markdown formart is enabled.'),
			markdown: true,
			row: 6,
			required: true,
		},
		{
			name: 'type',
			type: 'select',
			label: t('Session type'),
			options: [
				{ value: 'talk', label: t('Talk (20min)') },
				{ value: 'workshop', label: t('Workshop (1 hour)') },
			],
			required: true,
		},
		{
			name: 'level',
			type: 'select',
			label: t('Audience level'),
			options: [
				{ value: 'beginner', label: t('Beginner') },
				{ value: 'Intermediate', label: t('Intermediate') },
				{ value: 'Advanced', label: t('Advanced') },
				{ value: 'All', label: t('All') },
			],
			required: true,
		},
		{
			name: 'category',
			type: 'select',
			label: t('Session category'),
			options: [
				{ value: 'community', label: t('Community') },
				{ value: 'marketing', label: t('Marketing') },
				{ value: 'experience', label: t('My DevRel Experience') },
				{ value: 'business', label: t('Business') },
				{ value: 'team', label: t('Team management') },
				{ value: 'devrel', label: t('Developer Relations') },
				{ value: 'education', label: t('Developer Education') },
			],
			help: t('Please select the category that best fits your session.'),
			required: true,
		},
		{
			name: 'reason',
			type: 'textarea',
			label: t('Reason'),
			placeholder: t('Reason'),
			required: true,
			row: 3,
			help: t('Why are you suitable person for this session?'),
		},
		{
			name: 'first_event',
			type: 'text',
			label: t('Have you spoken at any conference in this proposal?'),
			help: t('If you have already spoken at an event with this content, please include the name of the event.'),
		},
		{
			name: 'co_speaker',
			type: 'checkbox',
			label: t('I have a co-speaker'),
			options: [
				{ value: true, label: t('No. I have a co-speaker.') },
			],
		},
		{
			name: 'coc',
			type: 'checkbox',
			label: t('I agree not to violate the code of conduct.'),
			required: true,
			options: [
				{ value: true, label: t('I agree') },
			],
		},
		{
			name: 'record',
			type: 'checkbox',
			label: t('I agree that the session will be recorded and made public at a later date.'),
			required: true,
			options: [
				{ value: true, label: t('I agree') },
			],
		},
		{
			name: 'no_support',
			type: 'checkbox',
			label: t('I agree that there are no travel support and accommodation assistance provided.'),
			required: true,
			options: [
				{ value: true, label: t('I agree') },
			],
		},
		{
			name: 'submit',
			type: 'submit',
			label: t('Submit'),
		}
	];
	return schema;
};

export { useSchema };
