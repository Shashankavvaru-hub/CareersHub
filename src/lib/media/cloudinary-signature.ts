'use server';

import crypto from 'crypto';
import { requireCompanyRole } from '../auth/authorization';

export type UploadVariant = 'logo' | 'hero';

const VARIANT_FOLDER: Record<UploadVariant, string> = {
  logo: 'wc/logos',
  hero: 'wc/heroes',
};

/**
 * Generates a short-lived Cloudinary signed upload signature.
 *
 * Only the signature (a hash) is sent to the client — never the API secret.
 * The client uses this to POST the file directly to Cloudinary.
 *
 * Requires the caller to be an authenticated member of the company
 * with at least the 'editor' role.
 */
export async function generateUploadSignature(
  companyId: string,
  variant: UploadVariant
): Promise<{
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}> {
  // 1. Auth + authorization — never trust a client-provided companyId for access.
  await requireCompanyRole(companyId, ['owner', 'admin', 'editor']);

  // 2. Validate server-side environment.
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.');
  }

  const folder = VARIANT_FOLDER[variant];
  const timestamp = Math.round(Date.now() / 1000);

  // 3. Build the string to sign — params sorted alphabetically.
  //    No upload_preset needed for signed uploads.
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

  // 4. Sign with SHA-1 (Cloudinary's required algorithm).
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex');

  return { signature, timestamp, apiKey, cloudName, folder };
}
