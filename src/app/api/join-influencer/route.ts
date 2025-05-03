import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      instagram, 
      tiktok, 
      youtube, 
      followers,
      niche,
      about
    } = body;
    
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM || 'noreply@brandlinkagency.com',
      to: process.env.INFLUENCER_EMAIL || process.env.RESEND_TO || 'talent@brandlinkagency.com',
      subject: 'New Influencer Application',
      html: `
        <h2>New Influencer Application</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Social Media:</strong></p>
        <ul>
          ${instagram ? `<li><strong>Instagram:</strong> @${instagram}</li>` : ''}
          ${tiktok ? `<li><strong>TikTok:</strong> @${tiktok}</li>` : ''}
          ${youtube ? `<li><strong>YouTube:</strong> ${youtube}</li>` : ''}
        </ul>
        <p><strong>Followers:</strong> ${parseInt(followers || '0').toLocaleString()}</p>
        <p><strong>Content Niche:</strong> ${niche}</p>
        <p><strong>About:</strong></p>
        <p>${about || 'No information provided'}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Influencer application error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}