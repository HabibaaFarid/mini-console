"use client";
import React, { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function doCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1500);
    }
  }

  return (
    <button
      type="button"
      onClick={doCopy}
      aria-label="Copy link"
      className="btn small"
    >
      {status === "copied" ? "Copied!" : "Copy"}
    </button>
  );
}
