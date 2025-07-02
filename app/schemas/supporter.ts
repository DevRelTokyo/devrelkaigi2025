import { Schema } from "~/types/schema";
import { setLang } from "~/utils/i18n";

const useSchema = (lang: string): Schema[] => {
  const { t } = setLang(lang);
  return [
    {
      name: "community",
      type: "text",
      label: t("Community"),
      placeholder: t("Your community name"),
      required: true,
    },
    {
      name: "url",
      type: "url",
      label: t("Community URL"),
      placeholder: t("https://example.connpass.com"),
      required: true,
    },
    {
      name: "name",
      type: "text",
      label: t("Name"),
      placeholder: t("Person in charge"),
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: t("Email"),
      placeholder: t("Your email address"),
      required: true,
    },
    {
      name: "logo",
      type: "file",
      label: t("Logo image file"),
      message: t("Drag & Drop your community logo image file here"),
      help: t(
        "Select your community logo image file, if you want to replace image. (Max 1MB, only square image)"
      ),
      accept: "image/*",
      preview: true,
      required: false,
    },
    {
      type: "submit",
      name: "submit",
      label: t("Submit"),
    },
  ];
};
export { useSchema };
