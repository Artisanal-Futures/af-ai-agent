import * as z from 'zod';
import { generateImageSchema, GenerateImageInput, createImageVariationSchema, CreateImageInput } from '~/types/agent';

// const BASE_URL = 'http://35.1.114.178:8000';
const BASE_URL = 'http://35.3.242.60:8000';

// Generate image
export const generateImage = async (projectName: string, prompt: string, userId: number): Promise<string> => {
    // const url = `${BASE_URL}/sdm/api/v2/generate/images`;

    const baseUrl = `${BASE_URL}/sdm/api/v2/generate/images`;
    const queryParams = `?project_title=${encodeURIComponent(projectName)}&prompt=${encodeURIComponent(prompt)}&user_id=${userId}`;
    const url = `${baseUrl}${queryParams}`;

    const requestData: GenerateImageInput = {
        project_title: projectName,
        prompt: prompt,
        user_id: 1,
    };


    try {
        generateImageSchema.parse(requestData);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        console.log('Request URL:', url);
        console.log('Request Data:', JSON.stringify(requestData));

        if (!response.ok) {
            throw new Error(`Error: Status: ${response.status}`);
        }

        const imageData: string = await response.text();
        return imageData;

    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
};

// Create Variation
export const createVariation = async (projectName: string, prompt: string, useriD: number, inputImage: string): Promise<string> => {
    const url = `${BASE_URL}/sdm/api/v2/create/variations`;
    const requestData: CreateImageInput = {
        guidance_prompt: prompt,
        user_id: useriD,
        project_title: projectName,
        input_image: inputImage,
    };

    try {
        createImageVariationSchema.parse(requestData);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`Error: Status: ${response.status}`);
        }

        const imageData: string = await response.text();
        return imageData;

    } catch (error) {
        console.error('Error creating variation:', error);
        throw error;
    }
};
