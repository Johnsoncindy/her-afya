import {Request, Response} from "express";
import {VertexAI} from "@google-cloud/vertexai";

// Initialize Vertex AI client
const projectId = "her-afya";
const vertexAI = new VertexAI({
  project: projectId,
  location: "us-central1",
});

export const chatWithGeminiHandler = async (req: Request, res: Response) => {
  try {
    const {userMessage} = req.body;
    if (!userMessage) {
      res.status(400).send("User message is required.");
      return;
    }

    const generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-1.5-flash-001",
    });

    // Send user message as prompt to Gemini model
    const response = await generativeModel.generateContent(userMessage);

    if (response && response.response) {
      res.status(200).json({
        botReply: response.response,
      });
    } else {
      res
        .status(500)
        .send("Failed to generate a valid response from the Gemini model.");
    }
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    res.status(500).send("Failed to generate chatbot response.");
  }
};
