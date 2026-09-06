'use client';

import React, { useRef, useState } from 'react';
import { generateUploadSignature, UploadVariant } from '../../lib/media/cloudinary-signature';

const VARIANT_META = {
  logo: {
    label: 'Logo',
    accept: 'image/png,image/jpeg,image/svg+xml',
    maxBytes: 2 * 1024 * 1024, // 2 MB
    maxLabel: '2 MB',
    hint: 'PNG, JPG or SVG',
  },
  hero: {
    label: 'Hero Image',
    accept: 'image/png,image/jpeg,image/webp',
    maxBytes: 5 * 1024 * 1024, // 5 MB
    maxLabel: '5 MB',
    hint: 'PNG, JPG or WebP',
  },
} as const;

interface MediaUploaderProps {
  companyId: string;
  variant: UploadVariant;
  currentUrl?: string;
  onUpload: (url: string) => void;
}

export function MediaUploader({ companyId, variant, currentUrl, onUpload }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const meta = VARIANT_META[variant];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Client-side size check (UX only — Cloudinary enforces server-side too).
    if (file.size > meta.maxBytes) {
      setError(`File is too large. Maximum size is ${meta.maxLabel}.`);
      e.target.value = '';
      return;
    }

    // Client-side type check (UX only).
    const allowedTypes = meta.accept.split(',');
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed: ${meta.hint}.`);
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get a short-lived signed signature from the server.
      const { signature, timestamp, apiKey, cloudName, folder } = await generateUploadSignature(companyId, variant);

      // 2. Build the form data for direct Cloudinary upload.
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);
      // No upload_preset — not required for signed uploads.

      // 3. POST directly to Cloudinary — credentials never leave the server.
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody?.error?.message || 'Upload failed. Please try again.');
      }

      const data = await res.json();
      const url: string = data.secure_url;

      setPreview(url);
      onUpload(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      {preview && (
        <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={`${meta.label} preview`}
            className={`w-full object-cover ${variant === 'logo' ? 'max-h-24 object-contain p-3' : 'max-h-36'}`}
          />
          <button
            type="button"
            onClick={() => { setPreview(null); onUpload(''); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-slate-300 hover:text-white flex items-center justify-center text-xs leading-none"
            aria-label={`Remove ${meta.label}`}
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={meta.accept}
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
          id={`upload-${variant}-${companyId}`}
          aria-label={`Upload ${meta.label}`}
        />
        <label
          htmlFor={`upload-${variant}-${companyId}`}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all border ${
            isUploading
              ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500 hover:text-white'
          }`}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
              {preview ? `Replace ${meta.label}` : `Upload ${meta.label}`}
            </>
          )}
        </label>
        <span className="text-xs text-slate-500">{meta.hint} · max {meta.maxLabel}</span>
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="text-xs text-red-400 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          {error}
        </p>
      )}
    </div>
  );
}
