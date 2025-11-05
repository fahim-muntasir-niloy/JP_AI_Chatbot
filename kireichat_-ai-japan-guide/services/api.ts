


/**
 * Fetches a response from the AI backend.
 * @param prompt The user's input message.
 * @returns A promise that resolves to the AI's markdown response.
 */
export const fetchAIResponse = async (prompt: string): Promise<string> => {
  console.log("Sending prompt to backend:", prompt);

  // --- MOCK IMPLEMENTATION ---
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a canned response for demonstration
  if (prompt.toLowerCase().includes("hello")) {
    return "Hello! Ask me about your business subsidies in Japan.";
  }
  // return MOCK_RESPONSE;

  // --- REAL IMPLEMENTATION ---
  // Use relative path when served from same domain, or absolute URL for development
  // In production (when served from backend), use relative path
  // In development, use absolute URL
  // Check if we're in development by checking if we're on localhost
  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const apiUrl = isDev 
    ? 'http://localhost:80/chat' 
    : '/chat';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response; // Assuming your backend returns { "response": "..." }

  } catch (error) {
    console.error("Error calling backend API:", error);
    throw error;
  }
};