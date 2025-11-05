


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
    return "Hello! I am Kirei. Ask me anything about Japan.";
  }
  // return MOCK_RESPONSE;

  // --- REAL IMPLEMENTATION (EXAMPLE) ---
  // Replace the mock implementation above with this block.
  // Make sure your FastAPI backend is running and allows CORS from this frontend's origin.
  try {
    const response = await fetch('http://localhost:5500/chat', { // Your backend URL
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