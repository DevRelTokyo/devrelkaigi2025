import { Schema } from "~/types/schema";
import { setLang } from "~/utils/i18n";

const useSchema = (lang: string): Schema[] => {
  const { t } = setLang(lang);
  return [
    {
      name: 'slug',
      type: 'text',
      label: t('Slug'),
      placeholder: t('Your ID. This value will be used as a part of the URL. (4-20 characters, lowercase, hyphen allowed)'),
      required: true,
      unique: true,
      pattern: '^[a-z0-9-]{4,20}$',
    },
    {
      name: 'locale',
      type: 'select',
      label: t('Language'),
      options: [
        {
          label: t('ja'),
          value: 'ja',
        },
        {
          label: t('en'),
          value: 'en',
        },
      ],
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      label: t('Subject'),
      placeholder: t('Email subject'),
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: t('Body'),
      placeholder: t('Email body content'),
      row: 10,
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