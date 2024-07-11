import axios from 'axios';
import * as z from 'zod';
import { generateImageSchema, GenerateImageInput } from '~/types/agent';

const BASE_URL = 'http://35.1.114.178:8000';

// Function to generate an image
export const generateImage = async (projectName: string, prompt: string, userName: string): Promise<string> => {
    const url = `${BASE_URL}/sdm/api/v2/generate/images`;
    const requestData: GenerateImageInput = {
        project_name: projectName,
        prompt: prompt,
        user_uname: userName
    };

    try {
        generateImageSchema.parse(requestData);
        const response = await axios.post<string>(url, requestData);
        return response.data;
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
};