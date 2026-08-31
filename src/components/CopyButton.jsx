import React, { useState } from 'react';
import { copyToClipboard } from '../utils/lottery';

export default function CopyButton({ items, className = 'copy-btn', label = 'COPY', copiedLabel = '✓ COPIED' }) {
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
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
