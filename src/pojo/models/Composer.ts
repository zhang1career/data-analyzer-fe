import axios from 'axios';

/**
 * Composer route
 *   a: attribute relation
 *   ad: attribute direction
 *   p: predicate relation
 *   pd: predicate direction
 *   v: prompt
 *   c: cancelable
 */
export interface ComposerRoute {
  a: string;
  ad: boolean;
  p: string;
  pd: boolean;
  v: string;
  c: boolean;
}

export const ListComposerRouteMap = async (): Promise<ComposerRoute[]> => {
  try {
    const response = await axios.get('http://54.86.102.80:18099/api/knowledge/composers/routes', {
      params: {}
    });
    console.debug('List composer route:', response.data.data);
    return response.data.data as ComposerRoute[];
  } catch (error) {
    console.error('Error listing composer route:', error);
    return [];
  }
}