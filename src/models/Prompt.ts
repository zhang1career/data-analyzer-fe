import axios from 'axios';

export interface PromptQo {
  topic?: string,
  aspect?: string,
  thinking: string,
  further?: PromptQo[]
}

export type Prompt = { [key: string]: any }


export const CreatePrompt = async (thinkingQo: PromptQo) => {
  try {
    const response = await axios.post('http://54.86.102.80:18099/api/knowledge/thinkings', thinkingQo);
    console.log('Create prompt');
    return response.data.data as Prompt;
  } catch (error) {
    console.error('Error creating prompt:', error);
  }
};