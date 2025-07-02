import Form from "~/components/form";
import { useSchema } from "~/schemas/supporter";
import { setLang } from "~/utils/i18n";
import { useParams } from "@remix-run/react";
import { useState, useEffect, useContext } from "react";
import { ParseContext } from "~/contexts/parse";
import { UserContext } from "~/contexts/user";
import Message, { MessageProps } from "./message";
import { Icon } from "@iconify/react";

export default function SupporterForm() {
  const { Parse } = useContext(ParseContext)!;
  const { login, user } = useContext(UserContext)!;
  const params = useParams();
  const { locale } = params;
  const { t } = setLang(locale!);
  const schema = useSchema(locale!);

  const [supporter, setSupporter] = useState<Parse.Object | undefined>(undefined);

  const [message, setMessage] = useState<MessageProps | undefined>(undefined);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const supporter = new Parse.Object("Supporter");
    setSupporter(supporter);
  }, []);

  const getAcl = () => {
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setWriteAccess(user!, true);
    acl.setReadAccess(user!, true);
    acl.setRoleReadAccess("Admin", true);
    acl.setRoleWriteAccess("Admin", true);
    acl.setRoleReadAccess(`Organizer${window.ENV.YEAR}`, true);
    return acl;
  };

  const submit = async (supporter: Parse.Object) => {
    setStatus("loading");
    supporter.set('year', parseInt(`${window.ENV.YEAR}`));
    supporter.set('user', user!);
    supporter.set('lang', locale!);
    supporter.setACL(getAcl());
    await supporter.save();
    setStatus("");
    setMessage({
      type: "success",
      messages: [t("Thank you! We will contact you soon.")],
    });
    setTimeout(() => {
      setMessage(undefined);
    }, 3000);
    const s = new Parse.Object('Supporter');
    setSupporter(s);
  };

  return (
    <>
      {supporter && (
        <div
          className="container"
          style={{
            paddingTop: "150px",
            paddingBottom: "40px",
          }}
        >
          {user ?
            <>
              <Message message={message} />
              <div className="row">
                <div className="col-8 offset-2">
                  <h2>{t("Apply community supporter")}</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-8 offset-2">
                  {message && (
                    <div
                      className={`alert alert-${message.type}`}
                      role="alert"
                      style={{
                        position: "fixed",
                        top: "50px",
                        right: "50px",
                        width: "600px",
                        zIndex: 9999,
                        borderRadius: "0px",
                      }}
                    >
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {message.messages.map((msg: string, i: number) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Form
                    name="Supporter"
                    schema={schema}
                    data={supporter}
                    status={status}
                    onSubmit={submit}
                  />
                </div>
              </div>
            </>
            : (
              <div className="row">
                <div className="col-8 offset-2">
                  <h2>{t("Please sign up or sign in to apply community supporter")}</h2>
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
                    Sign in with{" "}
                    <Icon icon="mdi:github" style={{ fontSize: "2em" }} />
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => login("google")}
                  >
                    Sign in with{" "}
                    <Icon icon="mdi:google" style={{ fontSize: "2em" }} />
                  </button>
                </div>
              </div>
            )}
        </div>
      )}
    </>
  );
}
