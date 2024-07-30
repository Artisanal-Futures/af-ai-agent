import { TRPCError } from "@trpc/server";
import axios from "axios";
import { DEMO_LIST_GENERATIONS, DEMO_LIST_VARIATIONS } from "~/data/demo";
import { env } from "~/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createImageVariationSchema,
  createSurveySchema,
  generateImageSchema,
  listGenerationsSchema,
  pastGenerationSchema,
  regenerateImageSchema,
  styleTransferSchema,
} from "~/types/agent";

const BASE_URL = env.BACKEND_URL;
// const BASE_URL = 'http://35.3.242.60:8000';

const TEST_USER_DATA = [
  { user_name: "John Doe" },
  { user_name: "Jane Doe" },
  { user_name: "John Smith" },
];

type GenerateImageResponse = {
  id: string;
  user_id: number;
  project_title: string;
  prompt: string;
  image_url: string;
  generation_time: number;
  generation_date: string;
  user: unknown;
};

type VariationResponse = {
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

type RegenerationResponse = {
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

type Generation = {
  id: string;
  user_id: number;
  prompt: string;
  project_title: string;
  image_url: string;
  generation_time: number;
  generation_date: string;
};

type Variation = {
  id: number;
  user_id: string;
  project_title: string;
  guidance_prompt: string;
  input_image_url: string;
  output_image_url: string;
  generation_time: number;
  generation_date: string;
};

type StyleTransfer = {
  id: string;
  user_id: number;
  project_title: string;
  content_image: string;
  style_image: string;
  output_image_url: string;
  generation_time: number;
  generation_date: string;
};

const TEST_BASE_64 =
  "data:image/png;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";

const TEST_PROMPT_DATA = [
  {
    level_of_satisfaction: "yes",
    direct_use_in_fabrication: false,
    image: TEST_BASE_64,
  },
  {
    level_of_satisfaction: "no",
    direct_use_in_fabrication: true,
    image: TEST_BASE_64,
  },
  {
    level_of_satisfaction: "yes",
    direct_use_in_fabrication: false,
    image: TEST_BASE_64,
  },
];

const DEBUG_MODE = false;

export const agentRouter = createTRPCRouter({
  listUsers: publicProcedure.query(() => {
    return TEST_USER_DATA;
  }),

  //make protected later
  generateImage: publicProcedure
    .input(generateImageSchema)
    .mutation(async ({ input }) => {
      const baseUrl = `${env.BACKEND_URL}sdm/api/v2/generate/images`;

      if (DEBUG_MODE) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error: Status: DEBUG`,
        });
      }

      try {
        const response = await axios.post(baseUrl, input, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 900000, // 15 minutes in milliseconds
        });

        const imageData = response.data as GenerateImageResponse;
        return imageData;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error: Status: ${error.response?.status}`,
          });
        }
        throw error;
      }
    }),

  regenerateImage: publicProcedure
    .input(regenerateImageSchema)
    .mutation(async ({ input }) => {
      const baseUrl = `${env.BACKEND_URL}sdm/api/v2/edit/generated/images`;

      if (DEBUG_MODE) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error: Status: DEBUG`,
        });
      }

      try {
        const response = await axios.post(baseUrl, input, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 900000, // 15 minutes in milliseconds
        });

        const imageData = response.data as RegenerationResponse;
        return imageData;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error: Status: ${error.response?.status ?? "Unknown"}`,
          });
        }
        throw error;
      }
    }),

  createImageVariation: publicProcedure
    .input(createImageVariationSchema)
    .mutation(async ({ input }) => {
      const baseUrl = `http://0.0.0.0:8000/sdm/api/v2/create/variations`;

      if (DEBUG_MODE) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error: Status: DEBUG`,
        });
      }

      try {
        const response = await axios.post(baseUrl, input, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 900000, // 15 minutes in milliseconds
        });

        const varData = response.data as VariationResponse;
        return varData;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error: Status: ${error.response?.status ?? "Unknown"}`,
          });
        }
        throw error;
      }
    }),

  neuralStyleTransfer: publicProcedure
    .input(styleTransferSchema)
    .mutation(async ({ input }) => {
      const url = `${env.NST_URL}sdm/api/v2/nst/`;

      if (DEBUG_MODE) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error: Status: DEBUG`,
        });
      }

      try {
        const response = await axios.post(url, input, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 1000 * 60 * 16, // 16 minutes in milliseconds
        });

        const imageData = response.data as StyleTransfer;
        return imageData;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error: Status: ${error.response?.status ?? "Unknown"}`,
          });
        }
        throw error;
      }
    }),

  createSurvey: publicProcedure
    .input(createSurveySchema)
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        result: "response recorded successfully",
      };
    }),

  listPrompts: publicProcedure.query(({ ctx }) => {
    return TEST_PROMPT_DATA;
  }),

  listGenerations: publicProcedure
    .input(listGenerationsSchema)
    .query(async ({ input }) => {
      const url = `${env.BACKEND_URL}sdm/api/v2/list/image/generations/${input.user_id}`;

      if (DEBUG_MODE) {
        return DEMO_LIST_GENERATIONS as Generation[];
      }

      const response = await fetch(url);
      //user1 for now, switch later?
      if (!response.ok) {
        throw new Error(`Error: Status: ${response.status}`);
      }
      const data: unknown = await response.json();
      return data as Generation[];
    }),

  listVariations: publicProcedure
    .input(listGenerationsSchema)
    .query(async ({ input }) => {
      const url = `${env.BACKEND_URL}sdm/api/v2/list/image/variations/${input.user_id}`;

      if (DEBUG_MODE) {
        return DEMO_LIST_VARIATIONS as Variation[];
      }

      const response = await fetch(url);
      //user1 for now, switch later?
      if (!response.ok) {
        throw new Error(`Error: Status: ${response.status}`);
      }
      const data: unknown = await response.json();
      return data as Variation[];
    }),
  listStyleImages: publicProcedure
    .input(listGenerationsSchema)
    .query(async ({ input }) => {
      const url = `${env.NST_URL}sdm/api/v2/list/nst/styles/${input.user_id}`;

      if (DEBUG_MODE) {
        return [] as Variation[];
      }

      const response = await fetch(url);
      //user1 for now, switch later?
      if (!response.ok) {
        throw new Error(`Error: Status: ${response.status}`);
      }
      const data: unknown = await response.json();
      return data as Variation[];
    }),

  demoAuth: publicProcedure.query(async ({ ctx }) => {
    return `Welcome to Artisanal Futures Image Generator, ${ctx.session?.user.name ?? "authed user!"}`;
  }),
});

// https://docs.google.com/spreadsheets/d/1GWFeXZihD3OExWMBJNDgfDJPYv_R9OF3gXF5hUyIebw/edit?gid=0#gid=0
// https://docs.google.com/document/d/1dKTLhkHIs12KIb5ehgWec11qkAI0DMj-hIxbeirK26k/edit
