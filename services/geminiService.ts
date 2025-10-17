import { GoogleGenAI } from "@google/genai";
import type { ResumeData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResumeSection = async (formData: ResumeData): Promise<string> => {
  const systemInstruction = `You are a world-class professional resume writer. Based on the user’s details, write a concise and compelling professional resume section in Markdown format.

**Instructions:**
1.  **Role:** Act as an expert resume writer.
2.  **Format:** The output must be in Markdown.
3.  **Structure:** Follow the requested structure precisely:
    - Start with a level 1 heading (#) for the user's name.
    - Follow with a level 2 heading (##) for the target job title.
    - Include the following sections with level 3 headings (###): "Professional Summary", "Key Achievements", "Skills", "Experience", and "Education".
4.  **Content for "Professional Summary":** Write a powerful 3-4 sentence summary tailored for the target job role.
5.  **Content for "Key Achievements":** Create a bulleted list of 3-5 points. Start each with an action verb and quantify results where possible.
6.  **Content for "Skills":** Create a simple bulleted list of relevant skills.
7.  **Content for "Experience" and "Education":** Write a short, descriptive paragraph for each.`;

  const userPrompt = `
Please generate my resume section using the following details:

- **Name:** ${formData.name}
- **Target Job Title:** ${formData.targetJobTitle}
- **Current Job Title:** ${formData.currentJobTitle}
- **Work Experience Summary:** ${formData.experience}
- **Education:** ${formData.education}
- **Skills:** ${formData.skills}
- **Key Achievements:** ${formData.achievements}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
        topP: 0.9,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("Failed to get a response from the AI model.");
  }
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const prompt = `You are an expert translator. Translate the following resume text, which is in Markdown format, into ${targetLanguage}. It is crucial that you preserve the exact Markdown formatting (headings like #, ##, ###, and bullet points like -). Do not add any extra text, commentary, or explanations. Only provide the translated text.

Here is the text to translate:

${text}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });
    return response.text;
  } catch (error) {
    console.error(`Error translating text to ${targetLanguage}:`, error);
    throw new Error(`Failed to translate the text to ${targetLanguage}.`);
  }
};