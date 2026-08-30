// Gemini AI service — topic extraction, tutor answers, quiz generation, revision explanation.
// SECURITY: the API key is read ONLY from process.env.GEMINI_API_KEY (never sent to the client).
// When DEMO_MODE=true or no key is set, `enabled` is false and callers fall back to
// deterministic demo content, so the Learning Hub always works.
const env = require('./../config/env');

let model = null;
let enabled = false;

try {
  if (!env.DEMO_MODE && env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
    enabled = true;
  }
} catch (e) {
  console.warn('[gemini] disabled:', e.message);
}

async function generate(prompt) {
  if (!enabled) throw new Error('Gemini disabled (DEMO_MODE or no key)');
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// 1 & 2 & 3: study-material analysis + topic/subtopic extraction
async function extractTopics(text) {
  const prompt = `You are a study assistant. From the following study material, extract 6-8 topics.
Return ONLY JSON: [{"name":"...","subtopics":["...","..."],"estimated_study_time":10}]
MATERIAL:\n${(text || '').slice(0, 12000)}`;
  const raw = await generate(prompt);
  return JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1));
}

// 5: AI Tutor — RAG-grounded in the student's material
async function tutorAnswer(topicName, question, context) {
  const prompt = `You are SynapseEDU's tutor. Answer the student's question using ONLY the provided context from THEIR uploaded material. If the context is insufficient, say so briefly. Be concise and clear.
TOPIC: ${topicName}
CONTEXT:\n${context}
QUESTION: ${question}`;
  return generate(prompt);
}

// 6 & 7: quiz generation with difficulty classification
async function generateQuestions(topicName, difficulty, count = 5) {
  const prompt = `Generate ${count} ${difficulty} multiple-choice questions about "${topicName}".
Return ONLY JSON: [{"question_text":"...","options":["a","b","c","d"],"correct_answer":0,"difficulty":"${difficulty}","subtopic":"..."}]`;
  const raw = await generate(prompt);
  return JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1));
}

// 9: personalised revision explanation (deterministic ranking is done in logic/revision.js)
async function explainRevision(topicName, mastery, focus) {
  const prompt = `In one short sentence, explain to a student why they should revise "${topicName}" (mastery ${mastery}%), focusing on: ${focus.join(', ')}. Start with "Recommended because".`;
  return (await generate(prompt)).trim();
}

module.exports = { get enabled() { return enabled; }, extractTopics, tutorAnswer, generateQuestions, explainRevision };
