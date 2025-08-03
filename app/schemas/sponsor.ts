import { Schema } from "~/types/schema";
import { setLang } from "~/utils/i18n";

const useSchema = (lang: string): Schema[] => {
  const { t } = setLang(lang);
  return [
    {
      name: 'name',
      type: 'text',
      label: t('Name'),
      placeholder: t('Sponsor name'),
      required: true,
    },
    {
      name: 'level',
      type: 'select',
      label: t('Level'),
      options: [
        {
          label: 'Platinum',
          value: 'platinum',
        },
        {
          label: 'Gold',
          value: 'gold',
        },
        {
          label: 'Silver',
          value: 'silver',
        },
        {
          label: 'Bronze',
          value: 'bronze',
        },
        {
          label: 'Media',
          value: 'media',
        },
        {
          label: 'Community',
          value: 'community',
        },
      ],
      required: true,
    },
    {
      name: 'logo',
      type: 'file',
      label: t('Logo'),
      message: t('Drag & Drop your logo file here'),
      help: t('Select your logo file (Max 1MB, PNG/JPG recommended)'),
      accept: 'image/*',
      preview: true,
      required: false,
    },
    {
      name: 'url',
      type: 'text',
      label: t('URL'),
      placeholder: t('https://example.com'),
      required: false,
    },
    {
      type: 'submit',
      name: 'submit',
      label: t('Save sponsor'),
    }
  ];
};

export { useSchema };