import * as z from 'zod';
import { generateImageSchema, GenerateImageInput, createImageVariationSchema, CreateImageInput } from '~/types/agent';

const BASE_URL = 'http://35.1.114.178:8000';

// Generate image
export const generateImage = async (projectName: string, prompt: string, userId: number): Promise<string> => {
    const url = `${BASE_URL}/sdm/api/v2/generate/images`;
    const requestData: GenerateImageInput = {
        project_title: projectName,
        prompt: prompt,
        user_id: 1,
    };

    console.log('Request URL:', url); // check url


    try {
        generateImageSchema.parse(requestData);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        console.log(JSON.stringify(requestData));

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
