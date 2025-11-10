const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function cleanJsonResponse(text) {
  // Remove markdown code block syntax if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return text.trim();
}

async function analyzeResume(resumeText, jobDescription = '') {
  // console.log("[ATS Analysis] Starting resume analysis...");
  // console.log("[ATS Analysis] Resume length:", resumeText.length, "characters");
  
  try {
    const prompt = `
You are an ATS (Applicant Tracking System) analyzer. Evaluate the following resume text and provide a score out of 100.
Return ONLY the JSON response without any markdown formatting or code blocks.

### Resume Text:
${resumeText}

${jobDescription ? `### Job Description:\n${jobDescription}` : ''}

### Evaluation Criteria:
1. Professional Formatting (20 points)
2. Key Skills and Keywords (20 points)
3. Experience and Achievements (20 points)
4. Education and Qualifications (20 points)
5. Overall Impact and Relevance (20 points)

### Required Output Format:
{
  "total_score": number,
  "section_scores": {
    "formatting": number,
    "skills": number,
    "experience": number,
    "education": number,
    "impact": number
  },
  "feedback": string[],
  "keywords_found": string[],
  "improvement_suggestions": string[]
}

Important: Return ONLY the JSON object without any markdown formatting or code blocks.`;

    // console.log("[ATS Analysis] Initializing Gemini AI model...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // console.log("[ATS Analysis] Generating content...");
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    // console.log("[ATS Analysis] Raw response:", response);
    const cleanedResponse = await cleanJsonResponse(response);
    // console.log("[ATS Analysis] Cleaned response:", cleanedResponse);
    
    const analysis = JSON.parse(cleanedResponse);
    
    // console.log("[ATS Analysis] Analysis complete. Total score:", analysis.total_score);
    // console.log("[ATS Analysis] Keywords found:", analysis.keywords_found.length);
    // console.log("[ATS Analysis] Improvement suggestions:", analysis.improvement_suggestions.length);

    return {
      success: true,
      data: analysis
    };

  } catch (error) {
    // console.error("[ATS Analysis] Error analyzing resume:", error);
    error("[ATS Analysis] Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      error: "Failed to analyze resume",
      details: error.message
    };
  }
}

module.exports = { analyzeResume };