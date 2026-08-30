// Gemini AI service — topic extraction, tutor answers, quiz generation, revision explanation.
// Uses @google/generative-ai. Gracefully disabled when no key / AI_MODE=demo, so the app
// always falls back to deterministic demo content.
const env = require('../config/env');

let model = null;
let enabled = false;

try {
  if (env.AI_MODE === 'live' && env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL || 'gemini-1.5-flash' });
    enabled = true;
  }
} catch (e) {
  console.warn('[gemini] disabled:', e.message);
}

async function generate(prompt) {
  if (!enabled) throw new Error('Gemini disabled');
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Extract structured topics from raw material text. Returns array or throws (caller falls back).
async function extractTopics(text) {
  const prompt = `You are a study assistant. From the following study material, extract 6-8 topics.
Return ONLY JSON: [{"name":"...","subtopics":["...","..."],"estimated_study_time":10}]
MATERIAL:\n${text.slice(0, 12000)}`;
  const raw = await generate(prompt);
  const json = raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1);
  return JSON.parse(json);
}

// RAG-grounded tutor answer. context = retrieved chunks from the student's material.
async function tutorAnswer(topicName, question, context) {
  const prompt = `You are SynapseEDU's tutor. Answer the student's question using ONLY the provided context from THEIR uploaded material. If the context is insufficient, say so briefly. Be concise and clear.
TOPIC: ${topicName}
CONTEXT:\n${context}
QUESTION: ${question}`;
  return generate(prompt);
}

async function generateQuestions(topicName, difficulty, count = 5) {
  const prompt = `Generate ${count} ${difficulty} multiple-choice questions about "${topicName}".
Return ONLY JSON: [{"question_text":"...","options":["a","b","c","d"],"correct_answer":0,"difficulty":"${difficulty}","subtopic":"..."}]`;
  const raw = await generate(prompt);
  const json = raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1);
  return JSON.parse(json);
}

async function explainRevision(topicName, mastery, focus) {
  const prompt = `In one short sentence, explain to a student why they should revise "${topicName}" (mastery ${mastery}%), focusing on: ${focus.join(', ')}. Start with "Recommended because".`;
  return (await generate(prompt)).trim();
}

module.exports = { enabled, extractTopics, tutorAnswer, generateQuestions, explainRevision };
