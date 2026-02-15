"use client";

import { useState, useCallback } from "react";
import { Share2, Copy, Check } from "lucide-react";

export type SharePayload = {
  title: string;
  text: string;
  url: string;
};

type ShareClassSectionProps = {
  sharePayload: SharePayload;
};

export function ShareClassSection({ sharePayload }: ShareClassSectionProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(sharePayload.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [sharePayload.url]);

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title: sharePayload.title,
        text: sharePayload.text,
        url: sharePayload.url,
      });
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // User cancelled or share failed
    }
  }, [sharePayload]);

  const encodedUrl = encodeURIComponent(sharePayload.url);
  const encodedText = encodeURIComponent(
    `${sharePayload.text} ${sharePayload.url}`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(sharePayload.text)}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;

  return (
    <div className="mt-6 rounded-xl border border-stone-200/60 bg-white/80 p-4 backdrop-blur-sm">
      <h2 className="text-sm font-semibold text-[var(--foreground)]">
        Share this class
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#c45c26" }}
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
            {shared ? "Shared!" : "Share"}
          </button>
        )}
        <button
          type="button"
          onClick={handleCopy}
          disabled={copied}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-stone-50 disabled:opacity-70"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Link copied!" : "Copy link"}
        </button>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-stone-50"
          aria-label="Share on X (Twitter)"
        >
          X
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-stone-50"
          aria-label="Share on Facebook"
        >
          Facebook
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-stone-50"
          aria-label="Share on WhatsApp"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
