"use server";

import { db } from '../../db';
import * as schema from '../../db/schema';
import { requireCompanyRole } from '../auth/authorization';

export async function saveMediaAssetRecord(
  companyId: string,
  assetData: {
    providerAssetId: string;
    publicId: string;
    resourceType?: string;
    mimeType?: string;
    secureUrl: string;
    width?: number;
    height?: number;
    bytes?: number;
  }
) {
  // Authorize user for this company
  await requireCompanyRole(companyId, ['owner', 'admin', 'editor']);

  await db.insert(schema.mediaAssets).values({
    companyId,
    provider: 'cloudinary',
    providerAssetId: assetData.providerAssetId,
    publicId: assetData.publicId,
    resourceType: assetData.resourceType,
    mimeType: assetData.mimeType,
    secureUrl: assetData.secureUrl,
    width: assetData.width,
    height: assetData.height,
    bytes: assetData.bytes,
  }).onConflictDoUpdate({
    target: [schema.mediaAssets.provider, schema.mediaAssets.providerAssetId],
    set: {
      secureUrl: assetData.secureUrl,
      width: assetData.width,
      height: assetData.height,
      bytes: assetData.bytes,
      mimeType: assetData.mimeType,
      resourceType: assetData.resourceType,
    },
  });
}
