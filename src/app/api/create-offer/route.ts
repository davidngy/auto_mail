import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("🚀 API wurde aufgerufen!");

    const { customer_email } = await req.json();
    console.log("📩 Eingehende Daten:", customer_email);

    if (!customer_email) {
      console.error("⚠️ Fehler: Keine E-Mail-Adresse erhalten!");
      return NextResponse.json({ error: "E-Mail fehlt!" }, { status: 400 });
    }

    console.log("🔄 Daten werden in Supabase eingefügt...");

    const { data, error } = await supabase
      .from("offers")
      .insert([{ customer_email, status: "pending" }])
      .select();

    if (error) {
      console.error("🔥 Supabase Fehler:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Angebot erfolgreich gespeichert:", data);
    return NextResponse.json({ success: true, offer: data[0] });
  } catch (err) {
    console.error("❌ Unerwarteter Fehler in API:", err);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
