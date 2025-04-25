import { Schema } from "~/types/schema";
import { setLang } from "~/utils/i18n";

const useSchema = (lang: string): Schema[] => {
	const { t } = setLang(lang);
	return [
		{
			name: 'title',
			type: 'text',
			label: t('Article title'),
			placeholder: t('Your article title'),
		},
		{
			name: 'slug',
			type: 'text',
			label: t('Slug'),
			placeholder: t('Your article slug'),
			required: true,
			unique: true,
		},
		{
			name: 'publishedAt',
			type: 'datetime-local',
			label: t('Published at'),
		},
    {
      name: 'lang',
      type: 'select',
      label: t('Locale'),
      options: [
        {
          label: t('Japanese'),
          value: 'ja',
        },
        {
          label: t('English'),
          value: 'en',
        },
      ],
      required: true,
    },
		{
			name: 'thumbnail',
			type: 'file',
			label: t('Thumbnail'),
			message: t('Drag & Drop your thumbnail file here'),
			help: t('Select your thumbnail file, if you want to replace image. (Max 1MB, only square image)'),
			accept: 'image/*',
      url: '/assets/images/icon/article_preview.png',
			preview: true,
			required: false,
		},
		{
			name: 'body',
			type: 'textarea_drop',
			label: t('Article body'),
			placeholder: t('Your article body'),
			row: 20,
			required: true,
		},
		{
			name: 'published_at',
			type: 'datetime',
			label: t('Published at'),
		},
		{
			type: 'submit',
			name: 'submit',
			label: t('Submit'),
		}
	];
};

export { useSchema };