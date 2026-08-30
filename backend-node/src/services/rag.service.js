// Retrieval-Augmented Generation layer (pluggable).
// MVP: chunk material and retrieve top-k chunks by keyword/term overlap (BM25-lite).
// This clean abstraction can be upgraded to embeddings + a vector DB (FAISS/pgvector) later
// without changing callers: swap `retrieve()` internals only.

function chunk(text, size = 500) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += size) chunks.push(words.slice(i, i + size).join(' '));
  return chunks;
}

function score(chunkText, query) {
  const q = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const c = chunkText.toLowerCase();
  return q.reduce((a, w) => a + (c.includes(w) ? 1 : 0), 0);
}

// chunks: string[]  -> returns top-k concatenated context
function retrieve(chunks, query, k = 3) {
  return chunks
    .map((text, i) => ({ i, text, s: score(text, query) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .filter(x => x.s > 0)
    .map(x => x.text)
    .join('\n---\n');
}

module.exports = { chunk, retrieve };
