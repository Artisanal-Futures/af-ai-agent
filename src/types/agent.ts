import * as z from "zod";

export const generateImageSchema = z.object({
  project_title: z.string(),
  prompt: z.string(),
  // user_uname: z.string(),
  user_id: z.string(),
});

export const styleTransferSchema = z.object({
  project_title: z.string(),
  content_image: z.string(),
  style_image: z.string(),
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
  image: z.string(),
});

export const listPromptsSchema = z.object({
  level_of_satisfaction: z.string(),
  direct_use_in_fabrication: z.boolean().default(false),
  image: z.string(),
});

export const listGenerationsSchema = z.object({
  user_id: z.string(),
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

export type GenerateImageResponse = {
  id: string;
  user_id: number;
  project_title: string;
  prompt: string;
  image_url: string;
  generation_time: number;
  generation_date: string;
  user: unknown;
};

export type VariationResponse = {
  id: string;
  user_id: number;
  project_title: string;
  prompt: string;
  negative_prompt: string;
  output_image_url: string;
  guidance_scale: number;
  generation_time: number;
  generation_date: string;
};

export type RegenerationResponse = {
  id: string;
  user_id: number;
  project_title: string;
  prompt: string;
  negative_prompt: string;
  output_image_url: string;
  guidance_scale: number;
  generation_time: number;
  generation_date: string;
};

export type Generation = {
  id: string;
  user_id: number;
  prompt: string;
  project_title: string;
  image_url: string;
  generation_time: number;
  generation_date: string;
};

export type Variation = {
  id: number;
  user_id: string;
  project_title: string;
  guidance_prompt: string;
  input_image_url: string;
  output_image_url: string;
  generation_time: number;
  generation_date: string;
};

export type StyleTransfer = {
  id: string;
  user_id: number;
  project_title: string;
  content_image: string;
  style_image: string;
  output_image_url: string;
  generation_time: number;
  generation_date: string;
};
