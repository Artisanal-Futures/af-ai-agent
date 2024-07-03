import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createImageVariationSchema,
  createSurveySchema,
  generateImageSchema,
} from "~/types/agent";

const TEST_USER_DATA = [
  { user_name: "John Doe" },
  { user_name: "Jane Doe" },
  { user_name: "John Smith" },
];

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
export const agentRouter = createTRPCRouter({
  listUsers: publicProcedure.query(() => {
    return TEST_USER_DATA;
  }),

  generateImage: protectedProcedure
    .input(generateImageSchema)
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return TEST_BASE_64;
    }),

  createSurvey: protectedProcedure
    .input(createSurveySchema)
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        result: "response recorded successfully",
      };
    }),

  createImageVariation: protectedProcedure
    .input(createImageVariationSchema)
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return TEST_BASE_64;
    }),

  listPrompts: protectedProcedure.query(({ ctx }) => {
    return TEST_PROMPT_DATA;
  }),
});

// https://docs.google.com/spreadsheets/d/1GWFeXZihD3OExWMBJNDgfDJPYv_R9OF3gXF5hUyIebw/edit?gid=0#gid=0
// https://docs.google.com/document/d/1dKTLhkHIs12KIb5ehgWec11qkAI0DMj-hIxbeirK26k/edit
