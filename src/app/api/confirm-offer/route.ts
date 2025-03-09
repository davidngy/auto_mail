import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req: Request) {
  try {
    console.log("🚀 API `/api/confirm-offer` wurde aufgerufen!");

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("🆔 Angebots-ID:", id);

    if (!id) {
      console.error("⚠️ Fehler: Angebots-ID fehlt!");
      return NextResponse.json({ error: "Angebots-ID fehlt!" }, { status: 400 });
    }

    console.log("🔄 Angebots-Status wird in Supabase aktualisiert...");

    const { data, error } = await supabase
      .from("offers")
      .update({ status: "confirmed" })
      .eq("id", parseInt(id)) // ✅ ID wird in eine Zahl umgewandelt
      .select();

    if (error) {
      console.error("🔥 Supabase Fehler:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Angebot erfolgreich bestätigt:", data);

    const transporter = nodemailer.createTransport({
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

    await transporter.sendMail({
      from: `"PopLab" <${process.env.EMAIL_USER}>`,
      to: "digital@poplab.online",
      subject: "Angebot bestätigt!",
      text: `Der Kunde mit der ID ${id} hat das Angebot bestätigt.`,
    });

    console.log("📩 Bestätigungs-E-Mail wurde gesendet!");
  
  const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://poplab.online"; // Hier später deine echte Domain einsetzen

  return NextResponse.redirect(`${baseUrl}/danke`);
  } catch (err) {
    console.error("❌ Unerwarteter Fehler in `/api/confirm-offer`:", err);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
