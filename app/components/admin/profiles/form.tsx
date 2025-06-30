import Form from "~/components/form";
import { useSchema } from "~/schemas/profile";
import { setLang } from "~/utils/i18n";
import { useParams } from "@remix-run/react";
import { useState, useEffect, useContext } from "react";
import { ParseContext } from "~/contexts/parse";
import { UserContext } from "~/contexts/user";
import { Icon } from "@iconify/react/dist/iconify.js";
import Message, { MessageProps } from "~/components/message";
import Breadcrumb from "~/components/breadcrumb";

export default function AdminProfileForm() {
  const { Parse } = useContext(ParseContext)!;
  const { user, login, roles } = useContext(UserContext)!;
  const params = useParams();
  const { locale, id } = params;
  const { t } = setLang(locale!);
  const schema = useSchema(locale!);
  const [profile, setProfile] = useState<Parse.Object | undefined>(undefined);
  const [message, setMessage] = useState<MessageProps | undefined>(undefined);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    getProfile();
  }, [user, id]);

  const getProfile = async () => {
    if (!user) return;
    const query = new Parse.Query("Profile");
    if (id) {
      try {
        const profile = await query.get(id);
        setProfile(profile);
      } catch (error) {
        console.error("Profile not found:", error);
        setMessage({
          type: "danger",
          messages: [t("Profile not found")],
        });
      }
    }
  };

  const submit = async (profile: Parse.Object) => {
    setStatus("loading");
    console.log(profile);
    try {
      await profile!.save();
      setStatus("");
      setMessage({
        type: "success",
        messages: [t("Profile has been updated successfully!")],
      });
    } catch (error) {
      setStatus("");
      setMessage({
        type: "danger",
        messages: ["Error", (error as Error).message],
      });
    }
  };

  const hasAdminRole = roles.find(
    (r) => r.get("name") === `Organizer${window.ENV.YEAR}`
  );

  return (
    <>
      {user && hasAdminRole ? (
        <div
          className="container"
          style={{
            paddingTop: "150px",
            paddingBottom: "40px",
          }}
        >
          <div className="row">
            <div className="col-8 offset-2">
              <Breadcrumb
                items={[
                  { label: t("Admin"), href: `/${locale}/admin` },
                  { label: t("Speakers"), href: `/${locale}/admin/speakers` },
                ]}
              />
            </div>
          </div>
          {profile ? (
            <>
              <div className="row">
                <div className="col-8 offset-2">
                  <h2>{t("Admin - Edit Profile")}</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-8 offset-2">
                  <Message message={message} />
                  <Form
                    name="Profile"
                    schema={schema}
                    data={profile}
                    status={status}
                    onSubmit={submit}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="row">
              <div className="col-8 offset-2">
                <h4>{t("Loading profile...")}</h4>
                {message && <Message message={message} />}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="container"
          style={{
            paddingTop: "150px",
            paddingBottom: "150px",
          }}
        >
          <div className="row">
            <div className="col-8 offset-2">
              <h4>{t("Admin access required")}</h4>
              <p>{t("You need admin privileges to access this page.")}</p>
            </div>
            <div
              className="col-8 offset-2 text-center"
              style={{ paddingTop: "2em", paddingBottom: "2em" }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => login("github")}
              >
                {t("Sign in with ")}
                <Icon icon="mdi:github" style={{ fontSize: "2em" }} />
              </button>{" "}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => login("google")}
              >
                {t("Sign in with ")}
                <Icon icon="mdi:google" style={{ fontSize: "2em" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
