const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load environment variables

// Initialize the client with the API key from the environment variables
const client = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY, // Use the API key from .env
});

const generateEmail = async (eventType, data) => {
  try {
    const prompt = `
You are an AI placement assistant that writes professional, motivational, and context-aware email messages for college placement activities.  
Your goal is to communicate updates in a positive, hopeful, and encouraging tone — while being concise and professional.

### Email Requirements:
- Always write in clear, natural English.
- Add motivational touch without exaggeration.
- Adapt tone based on the stage (formal for offer letters, friendly for selection updates).
- Include subject and HTML-formatted body.
- Mention college and student names where provided.
- Make the student feel valued, confident, and inspired.

### Event Type: ${eventType}
### Context Data: ${JSON.stringify(data, null, 2)}

Generate the best possible email with subject and HTML body for this scenario.
    `;

    const response = await client.generateText({
      model: "gemini-2.5-flash", // Use the correct model name
      prompt,
    });

    return response.candidates[0].output; // Assuming the response contains the generated email text
  } catch (error) {
    console.error("[geminiService] Error generating email:", error);
    throw new Error("Failed to generate email content");
  }
};

module.exports = { generateEmail };