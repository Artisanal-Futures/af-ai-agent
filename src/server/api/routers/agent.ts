import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createImageVariationSchema,
  createSurveySchema,
  generateImageSchema,
  regenerateImageSchema,
  pastGenerationSchema,
} from "~/types/agent";

const BASE_URL = "http://35.1.114.178:8000";
// const BASE_URL = 'http://35.3.242.60:8000';


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

  //make protected later
  generateImage: publicProcedure
    .input(generateImageSchema)
    .mutation(async ({ ctx, input }) => {
      const { project_title, prompt, user_id } = input;

      // const url = `${BASE_URL}/sdm/api/v2/generate/images`;

      const baseUrl = `${BASE_URL}/sdm/api/v2/generate/images`;
      const queryParams = `?project_title=${encodeURIComponent(project_title)}&prompt=${encodeURIComponent(prompt)}&user_id=${user_id}`;
      const url = `${baseUrl}${queryParams}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Error: Status: ${response.status}`);
      }
      //correct return type??
      const imageData: string = await response.text();
      return imageData;
    }),

  regenerateImage: publicProcedure
    .input(regenerateImageSchema)
    .mutation(async ({ ctx, input }) => {
      const { project_title, prompt, user_id, guidance_scale, negative_prompt } = input;

      // const url = `${BASE_URL}/sdm/api/v2/generate/images`;

      const baseUrl = `${BASE_URL}/sdm/api/v2/edit/generated/images`;
      const queryParams = `?project_title=${encodeURIComponent(project_title)}&prompt=${encodeURIComponent(prompt)}&user_id=${user_id}&negative_prompt=${negative_prompt}&guidance_scale=${guidance_scale}`;
      const url = `${baseUrl}${queryParams}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Error: Status: ${response.status}`);
      }
      //correct return type??
      const imageData: string = await response.text();
      return imageData;
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

  createImageVariation: publicProcedure
    .input(createImageVariationSchema)
    .mutation(async ({ ctx, input }) => {
      const { guidance_prompt, project_title, user_id } = input;

      // const url = `${BASE_URL}/sdm/api/v2/create/variations`;

      const baseUrl = `${BASE_URL}/sdm/api/v2/create/variations`;
      const queryParams = `?project_title=${encodeURIComponent(guidance_prompt)}&prompt=${encodeURIComponent(project_title)}&user_id=${user_id}`;
      const url = `${baseUrl}${queryParams}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Error: Status: ${response.status}`);
      }
      //correct return type??
      const varData: string = await response.text();
      return varData;
    }),

  listPrompts: publicProcedure.query(({ ctx }) => {
    return TEST_PROMPT_DATA;
  }),

  // listGenerations: publicProcedure.query(async ({ ctx }) => {
  //   const response = await fetch(`${BASE_URL}/sdm/api/v2/list/image/generations/1`);
  //   if (!response.ok) {
  //     throw new Error(`Error: Status: ${response.status}`);
  //   }
  //   const data: unknown = await response.json();
  //   return pastGenerationSchema.parse(data);
  // }),

  listGenerations: publicProcedure.query(async ({ ctx }) => {
    const response = await fetch(`${BASE_URL}/sdm/api/v2/list/image/generations/1`);
    //user1 for now, switch later?
    if (!response.ok) {
      throw new Error(`Error: Status: ${response.status}`);
    }
    const data: unknown = await response.json();
    return data;
  }),
  neuralStyleTransfer: publicProcedure
    .input(generateImageSchema)
    .mutation(async ({ ctx, input }) => {
      // const { project_title, prompt, user_id } = input;

      const url = `${BASE_URL}/sdm/api/v2/nst`;

      // const baseUrl = `${BASE_URL}/sdm/api/v2/nst`;
      // const queryParams = `?project_title=${encodeURIComponent(project_title)}&prompt=${encodeURIComponent(prompt)}&user_id=${user_id}`;
      // const url = `${baseUrl}${queryParams}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Error: Status: ${response.status}`);
      }
      const imageData: string = await response.text();
      return imageData;
    }),


  demoAuth: publicProcedure.query(async ({ ctx }) => {
    return `Welcome to Artisanal Futures Image Generator, ${ctx.session?.user.name ?? "authed user!"}`;
  }),
});

// https://docs.google.com/spreadsheets/d/1GWFeXZihD3OExWMBJNDgfDJPYv_R9OF3gXF5hUyIebw/edit?gid=0#gid=0
// https://docs.google.com/document/d/1dKTLhkHIs12KIb5ehgWec11qkAI0DMj-hIxbeirK26k/edit
