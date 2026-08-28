import type { APIRoute } from "astro";
import { Resend } from "resend";

const getEnv = (key: string, fallback = ""): string =>
  process.env[key] ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.[key]) ||
  fallback;

const resendApiKey = getEnv("RESEND_API_KEY");
const recipientEmail = getEnv(
  "CONTACT_RECIPIENT_EMAIL",
  "mesfinmastwal@gmail.com",
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, projectType, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "Name, email, and message are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ message: "Please enter a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const resend = new Resend(resendApiKey);

    const emailResponse = await resend.emails.send({
      from: "Kaset Inquiries <onboarding@resend.dev>",
      to: [recipientEmail],
      replyTo: email,
      subject: `New Project Inquiry from ${name} [${projectType || "General"}]`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; line-height: 1.6; }
              .container { max-width: 600px; margin: 20px auto; padding: 24px; border: 1px solid #eee; border-radius: 8px; }
              .header { border-bottom: 2px solid #7a0b2e; padding-bottom: 12px; margin-bottom: 20px; }
              .title { font-size: 20px; font-weight: 700; color: #7a0b2e; margin: 0; }
              .field-row { margin-bottom: 12px; }
              .label { font-weight: 600; color: #666; font-size: 13px; text-transform: uppercase; }
              .value { font-size: 15px; color: #111; margin-top: 2px; }
              .message-box { background: #f9f9f9; padding: 16px; border-radius: 6px; border-left: 3px solid #7a0b2e; margin-top: 16px; }
              .footer { margin-top: 24px; font-size: 12px; color: #888; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 class="title">KASET PRODUCTION — NEW INQUIRY</h1>
              </div>
              <div class="field-row">
                <div class="label">Sender Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field-row">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field-row">
                <div class="label">Project Type</div>
                <div class="value">${projectType || "Not Specified"}</div>
              </div>
              <div class="field-row">
                <div class="label">Project Details & Message</div>
                <div class="message-box">${message.replace(/\n/g, "<br/>")}</div>
              </div>
              <div class="footer">
                Received via Kaset Production Contact Form &bull; Reply directly to this email to respond to ${name}.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailResponse.error) {
      console.error("[Resend Error]:", emailResponse.error);
      return new Response(
        JSON.stringify({
          message: "Failed to send email. Please try again later.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been sent successfully.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("[Contact API Error]:", err);
    return new Response(
      JSON.stringify({ message: "An unexpected error occurred." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
