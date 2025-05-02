'use client';

/**
 * Sanity Studio configuration mounted on the `/studio` route
 */

import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { structureTool } from 'sanity/structure';
import { media, mediaAssetSource } from 'sanity-plugin-media';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    media({
      // Enable credit line for assets
      creditLine: {
        enabled: true,
        excludeSources: ['unsplash'],
      },
      // Set maximum upload size to 10MB
      maximumUploadSize: 10000000,
    }),
  ],
  form: {
    file: {
      assetSources: previousAssetSources => {
        return previousAssetSources.filter(assetSource => assetSource !== mediaAssetSource)
      }
    },
    image: {
      assetSources: previousAssetSources => previousAssetSources,
      // Enable multi-select in image fields
      multiple: true
    }
  }
});
