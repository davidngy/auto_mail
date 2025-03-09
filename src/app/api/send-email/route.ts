import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("🚀 API `/api/send-email` wurde aufgerufen!");

    const { customer_email, offer_id } = await req.json();
    console.log("📩 Empfänger:", customer_email);
    console.log("📜 Angebots-ID:", offer_id);

    if (!customer_email || !offer_id) {
      console.error("⚠️ Fehler: Fehlende Daten!");
      return NextResponse.json({ error: "E-Mail oder Angebots-ID fehlt!" }, { status: 400 });
    }

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // Wichtig: `false`, da STARTTLS genutzt wird
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Falls IONOS Zertifikatsprobleme verursacht
      },
    });

    let confirmLink = `http://localhost:3000/api/confirm-offer?id=${offer_id}`;

    let info = await transporter.sendMail({
      from: `"PopLab" <${process.env.EMAIL_USER}>`,
      to: customer_email,
      subject: "Bitte bestätigen Sie Ihr Angebot",
      html: `<p>Klicken Sie hier, um Ihr Angebot zu bestätigen: <a href="${confirmLink}">Angebot bestätigen</a></p>`,
    });

    console.log("✅ E-Mail erfolgreich gesendet:", info.messageId);
    return NextResponse.json({ success: true, message: "E-Mail gesendet" });
  } catch (err) {
    console.error("❌ Fehler beim E-Mail-Versand:", err);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
