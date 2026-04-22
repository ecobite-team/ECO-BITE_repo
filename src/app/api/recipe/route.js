import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided!" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // THE FIX: Pointing to the active 2.5 API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    const prompt = `I am a university student who just rescued these surplus food items from local restaurants: ${ingredients.join(", ")}. 
    Please act as a creative chef and write a short, fun, and cohesive meal idea or recipe combining some or all of these items. 
    Keep it under 150 words.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ recipe: text }, { status: 200 });

  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Send the actual error message back so we don't get blind 404s!
    return NextResponse.json({ error: error.message || "Failed to generate recipe." }, { status: 500 });
  }
}