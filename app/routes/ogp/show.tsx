import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import speakersData from "~/data/speakers.json";
import sessionsData from "~/data/sessions.json";

interface Speaker {
  name: string;
  slug: string;
  organization?: string;
  title?: string;
  image_url?: string;
  image_file?: {
    url: string;
  };
  lang: string;
  user?: {
    objectId: string;
  };
}

interface Session {
  title: string;
  lang: string;
  user?: {
    objectId: string;
  };
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug, locale } = params;

  if (!slug) {
    throw new Response("Speaker slug is required", { status: 400 });
  }

  // Find speaker by slug with locale preference
  const speakersWithSlug = (speakersData as Speaker[]).filter(s => s.slug === slug);
  let speaker = speakersWithSlug.find(s => s.lang === locale);

  // If no speaker found for the locale, try the other locale
  if (!speaker) {
    speaker = speakersWithSlug[0];
  }

  if (!speaker) {
    throw new Response("Speaker not found", { status: 404 });
  }

  // Find session by matching user.objectId with locale preference
  let speakerSession = null;
  if (speaker.user?.objectId) {
    const sessionsWithUser = (sessionsData as Session[]).filter(
      session => session.user?.objectId === speaker.user?.objectId
    );

    // Try to find session in current locale first
    speakerSession = sessionsWithUser.find(session => session.lang === locale);

    // If no session found for the locale, try the other locale
    if (!speakerSession) {
      speakerSession = sessionsWithUser[0];
    }
  }

  return json({ speaker, session: speakerSession });
}

export default function SpeakerOGP() {
  const { speaker, session } = useLoaderData<typeof loader>();

  // Get speaker image URL
  const imageUrl = speaker.image_file?.url || speaker.image_url || "";

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>{speaker.name} - DevRel Kaigi 2025</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: url("/assets/images/template.jpg") no-repeat;
            width: 1200px;
            height: 630px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }
          
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            z-index: 2;
            padding: 195px 40px 65px 40px;
          }
          
          .speaker-image {
            position: absolute;
            top: 320px;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 327px; 
            height: 327px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #fff;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            background: #f0f0f0;
            z-index: 3;
          }
          
          .speaker-image.placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 16px;
            background: #e0e0e0;
          }
          
          .speaker-name {
            position: absolute;
            top: 475px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 40px;
            font-weight: bold;
            color: #ffffff;
            width: 1000px;
            text-align: center;
            z-index: 3;
          }
          
          .speaker-company {
            font-size: 32px;
            font-weight: bold;
            color: #ffffff;
            text-align: center;
            z-index: 3;
          }
          
          .session-title {
            position: absolute;
            top: 530px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            font-weight: 600;
            color: #3b82f6;
            text-align: center;
            z-index: 3;
            width: 1000px;
            text-align: center;
            line-height: 1.3;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }
          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 1;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={speaker.name}
              className="speaker-image"
            />
          ) : (
            <div className="speaker-image placeholder">
              No Image
            </div>
          )}
          <div className="speaker-name">
            {speaker.name}, {' '}
            {(speaker.organization || speaker.title) && (
              <span className="speaker-company">
                {[speaker.title, speaker.organization].filter(Boolean).join(" @ ")}
              </span>
            )}
          </div>

          {session && (
            <div className="session-title">
              {session.title}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}