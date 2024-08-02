import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

type ResponseData = {
  message: string;
};

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}
const genAI = new GoogleGenerativeAI(API_KEY);
let model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "text/plain",
    maxOutputTokens: 1000,
    temperature: 0.8,
  },
});

export async function POST(request: Request) {
  const prompt = await request.text();
  //   const prompt = "Write a short story about a cat";
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ status: 400, message: "Invalid prompt" });
  }
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return NextResponse.json({ status: 200, message: text });
}
