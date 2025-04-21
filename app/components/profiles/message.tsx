import { useContext, useEffect, useState } from "react";
import { ParseContext } from "~/contexts/parse";
import { UserContext } from "~/contexts/user";

interface MessageProps {
  locale: string;
}

export default function Message({ locale }: MessageProps) {
	const { Parse } = useContext(ParseContext)!;
	const { user } = useContext(UserContext)!;
	const [profile, setProfile] = useState<Parse.Object | undefined>(undefined);
	const getProfile = async () => {
		if (!user) return;
		const query = new Parse.Query('Profile');
		query.equalTo('user', user);
		query.equalTo('lang', locale);
		const profile = await query.first();
		setProfile(profile);
	};

  useEffect(() => {
    getProfile();
  }, [user]);
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      {!profile && (
        <div className="row">
          <div className="col-8 offset-2">
            <div className="alert alert-primary" role="alert">
              {locale === 'ja' ?
                <div>
                  あなたのプロフィールがまだ作成されていません。<br />
                  <a href="/ja/profiles">こちらからプロフィールを作成してください</a>
                </div>
                :
                <div>
                  Your profile has not been created yet.<br />
                  <a href="/en/profiles">Please create your profile from here</a>
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}