import { Schema } from "~/types/schema";
import { setLang } from "~/utils/i18n";

const useSchema = (lang: string): Schema[] => {
  const { t } = setLang(lang);
  return [
    {
      name: 'subject',
      type: 'text',
      label: t('Email subject'),
      placeholder: t('Enter email subject'),
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: t('Email body'),
      placeholder: t('Enter email body'),
      row: 12,
      required: true,
    },
    {
      type: 'submit',
      name: 'submit',
      label: t('Send Email'),
    }
  ];
};

export interface EmailFormData {
  subject: string;
  body: string;
}

export const emailFormDefaults: Partial<EmailFormData> = {
  subject: "",
  body: "",
};

export { useSchema };