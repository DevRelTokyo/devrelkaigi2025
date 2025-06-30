import { Schema } from "~/types/schema";
import { setLang } from "~/utils/i18n";

const useSchema = (lang: string): Schema[] => {
  const { t } = setLang(lang);
  return [
    {
      name: "slug",
      type: "text",
      label: t("Slug"),
      help: t(
        "Your ID. This value will be used as a part of the URL. (4-20 characters, lowercase, hyphen allowed)"
      ),
      required: true,
      unique: true,
      pattern: "^[a-z0-9-]{4,20}$",
      groupBy: ["lang"],
      ignores: [
        "admin",
        "editor",
        "administrator",
        "root",
        "superuser",
        "owner",
        "manager",
        "staff",
        "user",
        "guest",
        "anonymous",
        "devrel",
        "developer-relations",
        "developerrelations",
        "community",
        "community-manager",
        "aaaa",
        "bbbb",
        "cccc",
        "dddd",
        "eeee",
        "ffff",
        "gggg",
        "hhhh",
        "iiii",
        "sexy",
        "gender",
        "fuck",
        "devrelkaigi",
        "javascript",
        "java",
        "ruby",
        "python",
        "youtube",
        "google",
        "github",
        "linkedin",
        "twitter",
        "x",
        "xxx",
        "xx",
        "password",
        "secret",
        "openai",
        "microsoft",
        "zoom",
      ],
    },
    {
      name: "name",
      type: "text",
      label: t("Name"),
      placeholder: t("Your name"),
      required: true,
    },
    {
      name: "organization",
      type: "text",
      label: t("Organization"),
      placeholder: t("Your organization"),
      required: false,
    },
    {
      name: "title",
      type: "text",
      label: t("Title"),
      placeholder: t("Technology Evangelist, Developer Advocate, etc."),
      required: false,
    },
    {
      name: "email",
      type: "email",
      label: t("Email"),
      placeholder: t("Your email address"),
      required: true,
    },
    {
      name: "profile",
      type: "textarea",
      label: t("Profile"),
      placeholder: t(
        "Please give a clear and concise explanation of your profile."
      ),
      row: 5,
      required: true,
    },
    {
      name: "image_url",
      type: "image",
      label: t("Profile image URL"),
      placeholder: t("Your profile image URL"),
      help: t(
        "This field is read only. If you want to replace image, please use the file field below."
      ),
      readOnly: true,
      required: false,
    },
    {
      name: "image_file",
      type: "file",
      label: t("Profile image file"),
      message: t("Drag & Drop your profile image file here"),
      help: t(
        "Select your profile image file, if you want to replace image. (Max 1MB, only square image)"
      ),
      accept: "image/*",
      preview: true,
      required: false,
    },
    {
      type: "array",
      name: "socials",
      label: t("Social media"),
      help: t("Add your social media URLs"),
      schema: {
        type: "url",
        name: "socials",
        label: t("URL"),
        placeholder: t("X/Twitter, GitHub, etc."),
        required: true,
      },
    },
    {
      type: "submit",
      name: "submit",
      label: t("Submit"),
    },
  ];
};

export { useSchema };
