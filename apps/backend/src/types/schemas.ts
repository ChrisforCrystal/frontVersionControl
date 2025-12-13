import { z } from 'zod';

export const ManifestChunkSchema = z.object({
    file: z.string(),
    src: z.string().optional(),
    isEntry: z.boolean().optional(),
    css: z.array(z.string()).optional(),
    assets: z.array(z.string()).optional(),
    imports: z.array(z.string()).optional(),
});

export const ManifestSchema = z.record(z.string(), ManifestChunkSchema);

export const VersionConfigSchema = z.object({
    activeVersion: z.string(),
    manifestPath: z.string(), // e.g., "artifacts/{version}/manifest.json"
});

export type ManifestChunk = z.infer<typeof ManifestChunkSchema>;
export type Manifest = z.infer<typeof ManifestSchema>;
export type VersionConfig = z.infer<typeof VersionConfigSchema>;
