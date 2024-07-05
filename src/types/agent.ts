import * as z from "zod";

export const generateImageSchema = z.object({
  project_name: z.string(),
  prompt: z.string(),
  user_uname: z.string(),
});

export const createSurveySchema = z.object({
  level_of_satisfaction: z.string(),
  direct_use_in_fabrication: z.boolean().default(false),
  user_uname: z.string(),
});

export const createImageVariationSchema = z.object({
  input_image: z.string(),
});

export const listPromptsSchema = z.object({
  level_of_satisfaction: z.string(),
  direct_use_in_fabrication: z.boolean().default(false),
  image: z.string(),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;
