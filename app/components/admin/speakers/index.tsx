import { Link, useParams } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import Breadcrumb from "~/components/breadcrumb";
import Message, { MessageProps } from "~/components/message";
import { ParseContext } from "~/contexts/parse";
import { Profile } from "~/types/profile";
import { setLang } from "~/utils/i18n";

type SpeakerData = {
  [key: string]: {
    [key: string]: Parse.Object;
  };
};

export default function AdminSpeakersIndex() {
  const params = useParams();
  const { Parse } = useContext(ParseContext)!;
  const { locale } = params;
  const [user, setUser] = useState<Parse.User | undefined>(undefined);
  const [speakers, setSpeakers] = useState<SpeakerData>({});
  const [message, setMessage] = useState<MessageProps | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([]);
  const { t } = setLang(locale!);

  useEffect(() => {
    setUser(Parse.User.current());
  }, [Parse.User]);

  useEffect(() => {
    if (user) {
      getSpeakers();
    }
  }, [user]);

  const getSpeakers = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Speaker2025ロールを取得
      const roleQuery = new Parse.Query(Parse.Role);
      const year = import.meta.env.VITE_YEAR || "2025";
      roleQuery.equalTo("name", `Speaker${year}`);

      const role = await roleQuery.first();
      if (!role) {
        showMessage({
          messages: [t(`Speaker${year} role not found`)],
          type: "warning",
        });
        setLoading(false);
        return;
      }

      // ロールのユーザーIDを取得
      const userIds = (await Parse.Cloud.run("getUserIds", {
        id: role.id,
      })) as string[];

      if (userIds.length === 0) {
        setSpeakers({});
        setLoading(false);
        return;
      }

      // ProfileクラスからSpeaker2025ロールのユーザーのプロファイルを取得
      const profileQuery = new Parse.Query("Profile");
      const userPointers = userIds.map((id) => ({
        __type: "Pointer",
        className: "_User",
        objectId: id,
      }));
      profileQuery.containedIn("user", userPointers);
      profileQuery.ascending("createdAt");
      profileQuery.limit(1000);

      const profiles = (await profileQuery.find()) as Parse.Object[];
      const speakersData: SpeakerData = {};
      for (const profile of profiles) {
        const userId = profile.get("user")?.id;
        if (speakersData[userId]) {
          speakersData[userId][profile.get("lang")] = profile;
        } else {
          speakersData[userId] = {
            [profile.get("lang")]: profile,
          };
        }
      }
      setSpeakers(speakersData);
    } catch (error) {
      console.error("Error fetching speakers:", error);
      showMessage({
        messages: [t("Failed to fetch speakers")],
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: MessageProps) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(undefined);
    }, 3000);
  };

  const getProfile = (
    profiles: { [key: string]: Parse.Object },
    key: string
  ) => {
    const profile1 = profiles[locale!];
    if (profile1 && key === 'id') return profile1?.id;
    if (profile1 && profile1.get(key)) {
      return profile1.get(key);
    }
    const profile2 = profiles[locale === "ja" ? "en" : "ja"];
    if (profile2 && key === 'id') return profile2?.id;
    if (profile2 && profile2.get(key)) {
      return profile2.get(key);
    }
    return "";
  };

  const copyProfile = async (profile: Parse.Object) => {
    const newProfile = new Parse.Object("Profile");
    const params = profile.toJSON();
    const user = profile.get("user");
    for (const key in params) {
      if (["objectId", "user", "createdAt", "updatedAt", "ACL"].includes(key))
        continue;
      console.log(`key: ${key}, value: ${JSON.stringify(params[key])}`);
      newProfile.set(key, params[key]);
    }
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    acl.setWriteAccess(user, true);
    acl.setRoleWriteAccess(`Organizer${window.ENV.YEAR}`, true);
    newProfile.setACL(acl);
    newProfile.set("user", user);
    newProfile.set("lang", params.lang === "ja" ? "en" : "ja");
    await newProfile.save();
    showMessage({
      messages: [t("Profile copied successfully")],
      type: "success",
    });
    speakers[profile.get("user").id] = {
      ...speakers[profile.get("user").id],
      [newProfile.get("lang")]: newProfile,
    };
    setSpeakers({ ...speakers });
  };

  if (!user) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <div
      className="container"
      style={{ paddingTop: "150px", paddingBottom: "40px" }}
    >
      <Message message={message} />
      <div className="row">
        <div className="col-8 offset-2">
          <Breadcrumb
            items={[
              { label: t("Admin"), href: `/${locale}/admin` },
              { label: t("Speakers"), href: `/${locale}/admin/speakers` },
            ]}
          />
        </div>
        <div className="col-8 offset-2">
          <div className="row">
            <div className="col-8">
              <h2>{t("Speakers")}</h2>
            </div>
          </div>
        </div>
        <div className="col-8 offset-2">
          {loading ? (
            <div>{t("Loading...")}</div>
          ) : (
            <>
              <div className="row">
                <div className="col-12 text-end">
                  <button className="btn btn-primary" onClick={() => {
                    window.location.href = `/${locale}/admin/emails/new?speakers=${selectedSpeakers.join(',')}`;
                  }}
                    disabled={selectedSpeakers.length === 0}
                  >
                    {t('Compose Email')}
                  </button>
                </div>
              </div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th></th>
                    <th>{t("Name")}</th>
                    <th>{t("Organization")}</th>
                    <th>{t("Title")}</th>
                    <th>{t("Email")}</th>
                    <th>{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(speakers).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center">
                        {t("No speakers found")}
                      </td>
                    </tr>
                  ) : (
                    Object.values(speakers).map((profiles, index) => (
                      <tr key={index}>
                        <td>
                          <input type="checkbox" name="speakers" value={getProfile(profiles, "id")} onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSpeakers([...selectedSpeakers, getProfile(profiles, "id")]);
                            } else {
                              setSelectedSpeakers(selectedSpeakers.filter((id) => id !== getProfile(profiles, "id")));
                            }
                          }} />
                        </td>
                        <td>
                          <Link
                            to={`/${locale}/speakers/${getProfile(
                              profiles,
                              "slug"
                            )}`}
                          >
                            {getProfile(profiles, "name")}
                          </Link>
                        </td>
                        <td>{getProfile(profiles, "organization")}</td>
                        <td>{getProfile(profiles, "title")}</td>
                        <td>
                          {getProfile(profiles, "email") !== "" && (
                            <a href={`mailto:${getProfile(profiles, "email")}`}>
                              ✉️
                            </a>
                          )}
                        </td>
                        <td>
                          <div className="row">
                            <div className="col-6">
                              {profiles["ja"] ? (
                                <Link
                                  className="btn"
                                  to={`/${locale}/admin/profiles/${profiles["ja"].id}/edit`}
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  🇯🇵
                                </Link>
                              ) : (
                                <button
                                  className="btn"
                                  onClick={() => copyProfile(profiles["en"])}
                                >
                                  <span style={{ opacity: 0.5 }}>🇯🇵</span>
                                </button>
                              )}
                            </div>
                            <div className="col-6">
                              {profiles["en"] ? (
                                <Link
                                  className="btn"
                                  to={`/${locale}/admin/profiles/${profiles["en"].id}/edit`}
                                  style={{
                                    textDecoration: "none",
                                  }}
                                >
                                  🇺🇸
                                </Link>
                              ) : (
                                <button
                                  className="btn"
                                  onClick={() => copyProfile(profiles["ja"])}
                                >
                                  <span style={{ opacity: 0.5 }}>🇬🇧</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
