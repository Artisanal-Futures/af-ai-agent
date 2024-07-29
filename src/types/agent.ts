import * as z from "zod";

export const generateImageSchema = z.object({
  project_title: z.string(),
  prompt: z.string(),
  // user_uname: z.string(),
  user_id: z.string(),
});

export const regenerateImageSchema = z.object({
  project_title: z.string(),
  prompt: z.string(),
  user_id: z.string(),
  guidance_scale: z.number(),
  negative_prompt: z.string(),
});

export const createSurveySchema = z.object({
  level_of_satisfaction: z.string(),
  direct_use_in_fabrication: z.boolean().default(false),
  user_uname: z.string(),
});

export const createImageVariationSchema = z.object({
  guidance_prompt: z.string(),
  user_id: z.string(),
  project_title: z.string(),
  input_image: z.string(),
});

export const listPromptsSchema = z.object({
  level_of_satisfaction: z.string(),
  direct_use_in_fabrication: z.boolean().default(false),
  image: z.string(),
});

export const pastGenerationSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  project_title: z.string(),
  prompt: z.string(),
  image_url: z.string(),
  generation_time: z.number(),
  generation_date: z.string(),
  user: z.any().nullable(),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;
export type CreateImageInput = z.infer<typeof createImageVariationSchema>;
export const pastGenerationsSchema = z.array(pastGenerationSchema);
export type PastGenerations = z.infer<typeof pastGenerationsSchema>;
