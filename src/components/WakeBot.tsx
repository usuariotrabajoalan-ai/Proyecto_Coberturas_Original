"use client";

import { useEffect } from "react";

export default function WakeBot({ botUrl }: { botUrl?: string }) {
  useEffect(() => {
    if (botUrl) {
      // Send a silent background GET request to wake the bot up on Render
      fetch(`${botUrl}/api/whatsapp/status`)
        .then(() => console.log("Bot pinged successfully."))
        .catch(() => console.log("Ping sent to bot."));
    }
  }, [botUrl]);

  return null; // This component is invisible
}
