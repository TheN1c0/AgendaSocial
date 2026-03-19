export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    // Aquí podrías agregar baseURL, intercepctores, tokens, etc.
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  // put, post, delete, etc.
};
