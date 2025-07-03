import { type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { createCanvas, loadImage } from 'canvas';

interface SpeakerData {
  name: string;
  company: string;
  image: string;
}

// 仮のスピーカーデータ（実際はデータベースから取得）
const speakersData: Record<string, SpeakerData> = {
  'jo': {
    name: 'Jo Smith',
    company: '一般社団法人DevRel',
    image: 'https://avatars.githubusercontent.com/u/12345678?v=4'
  },
  'john-doe': {
    name: 'John Doe',
    company: 'Tech Corp',
    image: 'https://example.com/john.jpg'
  },
  'jane-smith': {
    name: 'Jane Smith',
    company: 'Innovation Labs',
    image: 'https://example.com/jane.jpg'
  }
};

// PNG画像を生成する関数
async function generateOGPImage(speakerData: SpeakerData): Promise<Buffer> {
  const { name, company, image } = speakerData;
  
  // Canvas作成
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  
  // グラデーション背景
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(0.5, '#1e293b');
  gradient.addColorStop(1, '#334155');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);
  
  // 装飾的な円
  ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
  ctx.beginPath();
  ctx.arc(1000, 100, 150, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
  ctx.beginPath();
  ctx.arc(100, 500, 100, 0, 2 * Math.PI);
  ctx.fill();
  
  // プロフィール画像を描画（ある場合）
  if (image) {
    try {
      const profileImg = await loadImage(image);
      
      // 円形クリップ
      ctx.save();
      ctx.beginPath();
      ctx.arc(200, 215, 100, 0, 2 * Math.PI);
      ctx.clip();
      
      // 画像を描画
      ctx.drawImage(profileImg, 100, 115, 200, 200);
      ctx.restore();
      
      // 円形境界線
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(200, 215, 100, 0, 2 * Math.PI);
      ctx.stroke();
    } catch (error) {
      console.warn('Failed to load profile image:', error);
      // フォールバック: プレースホルダー円
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(200, 215, 100, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  } else {
    // プレースホルダー円
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(200, 215, 100, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  
  // テキスト描画
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  // 名前
  const fontSize = name.length > 20 ? 42 : 52;
  ctx.font = `bold ${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
  ctx.fillText(name, 350, 180);
  
  // 会社名
  if (company) {
    ctx.font = '32px Arial, sans-serif';
    ctx.fillStyle = '#e5e7eb';
    const companyText = company.length > 30 ? company.slice(0, 27) + '...' : company;
    ctx.fillText(companyText, 350, 240);
  }
  
  // Speaker Profileラベル
  ctx.font = '24px Arial, sans-serif';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText('Speaker Profile', 350, 300);
  
  // DevRel Kaigi 2024
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.fillText('DevRel Kaigi 2024', 50, 520);
  
  ctx.font = '18px Arial, sans-serif';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText('Developer Relations Conference', 50, 560);
  
  // 右下ブランディング
  ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
  ctx.fillRect(950, 480, 200, 100);
  
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(950, 480, 200, 100);
  
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillStyle = '#3b82f6';
  ctx.textAlign = 'center';
  ctx.fillText('DevRel', 1050, 510);
  
  ctx.font = '16px Arial, sans-serif';
  ctx.fillText('Community', 1050, 540);
  
  // PNGバッファを返す
  return canvas.toBuffer('image/png');
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { slug } = params;
  const url = new URL(request.url);
  
  if (!slug) {
    throw new Response('Speaker slug is required', { status: 400 });
  }

  // スピーカー情報を取得
  const speakerData = speakersData[slug] || {
    name: url.searchParams.get("name") || "Unknown Speaker",
    company: url.searchParams.get("company") || "",
    image: url.searchParams.get("image") || ""
  };

  try {
    // PNG画像を生成
    const pngBuffer = await generateOGPImage(speakerData);
    
    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Vary': 'Accept-Encoding',
      },
    });
  } catch (error) {
    console.error('Error generating OGP image:', error);
    
    // 最小限のフォールバック: テキストレスポンス
    return new Response('Failed to generate image', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}