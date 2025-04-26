import { Schema } from "~/types/schema";
import { setLang } from "~/utils/i18n";

const useSchema = (lang: string): Schema[] => {
  const { t } = setLang(lang);
  return [
    {
      name: 'company',
      type: 'text',
      label: t('Company'),
      placeholder: t('Your company name'),
    },
    {
      name: 'name',
      type: 'text',
      label: t('Name'),
      placeholder: t('Your name'),
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      label: t('Category'),
      options: [
        { value: 'sponsor', label: t('Sponsor') },
        { value: 'attendance', label: t('Attendance') },
        { value: 'kidsroom', label: t('Kids room') },
        { value: 'proposal', label: t('Proposal') },
        { value: 'other', label: t('Other') },
      ],
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: t('Email'),
      placeholder: t('Your email address'),
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: t('Body'),
      placeholder: t('Please write your message here.'),
      row: 5,
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