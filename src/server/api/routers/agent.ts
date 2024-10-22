import { TRPCError } from "@trpc/server";
import axios from "axios";
import * as z from "zod";
import { DEMO_LIST_GENERATIONS, DEMO_LIST_VARIATIONS } from "~/data/demo";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  createImageVariationSchema,
  type GenerateImageResponse,
  generateImageSchema,
  type Generation,
  listGenerationsSchema,
  regenerateImageSchema,
  type RegenerationResponse,
  type StyleTransfer,
  styleTransferSchema,
  type Variation,
  type VariationResponse,
  recordLikeSchema,
  likeResponseSchema,
} from "~/types/agent";

export const agentRouter = createTRPCRouter({
  //make protected later
  generateImage: publicProcedure
    .input(generateImageSchema.extend({ demo: z.boolean().optional() }))
    .mutation(async ({ input }) => {
      const baseUrl = `${env.BACKEND_URL}sdm/api/v2/generate/images`;

      const { demo, ...generateImageInput } = input;

      if (demo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error: Status: DEBUG`,
        });
      }

      try {
        const response = await axios.post(baseUrl, generateImageInput, {
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
    .input(regenerateImageSchema.extend({ demo: z.boolean().optional() }))
    .mutation(async ({ input }) => {
      const baseUrl = `${env.BACKEND_URL}sdm/api/v2/edit/generated/images`;

      const { demo, ...regenerateImageInput } = input;

      if (demo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error: Status: DEBUG`,
        });
      }

      try {
        const response = await axios.post(baseUrl, regenerateImageInput, {
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
    .input(createImageVariationSchema.extend({ demo: z.boolean().optional() }))
    .mutation(async ({ input }) => {
      const baseUrl = `${env.BACKEND_URL}sdm/api/v2/create/variations`;

      const { demo, ...createImageVariationInput } = input;

      if (demo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error: Status: DEBUG`,
        });
      }

      try {
        const response = await axios.post(baseUrl, createImageVariationInput, {
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
    .input(styleTransferSchema.extend({ demo: z.boolean().optional() }))
    .mutation(async ({ input }) => {
      const { demo, ...styleTransferInput } = input;

      const url = `${env.NST_URL}sdm/api/v2/nst/`;

      if (demo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error: Status: DEBUG`,
        });
      }

      try {
        const response = await axios.post(url, styleTransferInput, {
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

  recordLikes: publicProcedure
    .input(recordLikeSchema.extend({ demo: z.boolean().optional() })) // Extending to include optional demo mode
    .mutation(async ({ input }) => {
      const baseUrl = `${env.BACKEND_URL}sdm/api/v2/create/like`;
      const { demo, ...recordLikeInput } = input; // Destructure input for demo

      // If demo mode is active, simulate an error for testing
      if (demo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error: Status: DEBUG`,
        });
      }

      try {
        // Send the POST request to record the like/dislike
        const response = await axios.post(baseUrl, recordLikeInput, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 900000, // 15 minute timeout
        });

        // Process the response from the backend
        const likeResponse = likeResponseSchema.parse(response.data);
        return likeResponse;
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

  listGenerations: publicProcedure
    .input(listGenerationsSchema.extend({ demo: z.boolean().optional() }))
    .query(async ({ input }) => {
      const url = `${env.BACKEND_URL}sdm/api/v2/list/image/generations/${input.user_id}`;

      if (input?.demo) {
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
    .input(listGenerationsSchema.extend({ demo: z.boolean().optional() }))
    .query(async ({ input }) => {
      const url = `${env.BACKEND_URL}sdm/api/v2/list/image/variations/${input.user_id}`;

      if (input?.demo) {
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
    .input(listGenerationsSchema.extend({ demo: z.boolean().optional() }))
    .query(async ({ input }) => {
      const url = `${env.NST_URL}sdm/api/v2/list/nst/styles/${input.user_id}`;

      if (input?.demo) {
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
});

// https://docs.google.com/spreadsheets/d/1GWFeXZihD3OExWMBJNDgfDJPYv_R9OF3gXF5hUyIebw/edit?gid=0#gid=0
// https://docs.google.com/document/d/1dKTLhkHIs12KIb5ehgWec11qkAI0DMj-hIxbeirK26k/edit
