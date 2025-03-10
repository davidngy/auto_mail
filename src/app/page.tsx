"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [offerId, setOfferId] = useState(""); // Angebot-ID für E-Mail-Versand speichern
  const [message, setMessage] = useState("");

  async function handleCreateOffer(e: React.FormEvent) {
    e.preventDefault();

    setMessage("⏳ Angebot wird erstellt...");

    const res = await fetch("/api/create-offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_email: email }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("✅ Angebot wurde erstellt! ID: " + data.offer.id);
      setOfferId(data.offer.id); // Angebot-ID speichern

      // Sobald die ID gespeichert wurde, sende die E-Mail
      await handleSendEmail(email, data.offer.id);
      setEmail("");
    } else {
      setMessage("❌ Fehler: " + data.error);
    }
  }

  async function handleSendEmail(email: string, offerId: string) {
    if (!offerId) {
      setMessage("⚠️ Keine Angebots-ID vorhanden! Bitte erst ein Angebot erstellen.");
      return;
    }

    setMessage("⏳ E-Mail wird gesendet...");

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_email: email, offer_id: offerId }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("✅ E-Mail erfolgreich gesendet!");
    } else {
      setMessage("❌ Fehler: " + data.error);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center text-blue-500">📩 Angebot erstellen & E-Mail senden</h1>
      <form onSubmit={handleCreateOffer} className="mt-4">
        <input
          type="email"
          placeholder="Kunden-E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full mt-3 bg-blue-600 text-white p-2 rounded-md"
        >
          Angebot erstellen & E-Mail senden
        </button>
      </form>

      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
}
