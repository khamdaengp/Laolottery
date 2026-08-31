import React, { useState } from 'react';
import { copyToClipboard } from '../utils/lottery';

export default function CopyButton({ items, className = 'copy-btn', label = 'Copy', copiedLabel = 'Copied' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!items || (Array.isArray(items) && items.length === 0)) return;

    const textToCopy = Array.isArray(items) ? items.join(',') : String(items);
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  };

  const isDisabled = !items || (Array.isArray(items) && items.length === 0);

  return (
    <button
      type="button"
      className={`${className} ${copied ? 'ok' : ''}`}
      onClick={handleCopy}
      disabled={isDisabled}
      title="Copy numbers to clipboard"
    >
      {copied ? (
        <>
          <svg className="copy-icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <svg className="copy-icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
