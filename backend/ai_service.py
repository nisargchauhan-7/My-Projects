"""Gemini AI service for the SynapseEDU preview (Emergent Universal LLM key).
Grounded AI Tutor, quiz generation, and topic extraction. All calls degrade
gracefully so the frontend always has a demo fallback."""
import os
import json
import logging

logger = logging.getLogger(__name__)

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
DEFAULT_MODEL = 'gemini-3-flash-preview'
ALLOWED_MODELS = {'gemini-3-flash-preview', 'gemini-3.1-pro-preview', 'gemini-3.5-flash'}

# Compact grounded context per topic (stands in for RAG over the uploaded PDF in the preview).
CN_CONTEXT = {
    'OSI Model': "The OSI model is a 7-layer framework (Physical, Data Link, Network, Transport, Session, Presentation, Application). Each layer serves the one above and uses encapsulation, adding its own header as data descends. PDUs: bit, frame, packet, segment.",
    'TCP/IP': "TCP is connection-oriented and reliable, opened with the three-way handshake (SYN, SYN-ACK, ACK). It provides ordered delivery using sequence and acknowledgement numbers over best-effort IP. A socket = IP + port.",
    'Flow Control': "Flow control prevents a fast sender from overwhelming a slow receiver, using the receiver-advertised window (rwnd) and a sliding window. It is receiver-driven and end-to-end. If the receiver buffer fills, rwnd shrinks toward zero.",
    'Routing': "Routing builds forwarding tables. Link-state (OSPF) floods link info and runs Dijkstra; distance-vector (RIP) shares hop-count estimates with neighbours and can suffer count-to-infinity.",
    'Congestion Control': "Congestion control limits data injected into the network using the congestion window (cwnd), reacting to packet loss as a congestion signal. It is network-driven (vs receiver-driven flow control). The sender may send min(cwnd, rwnd). On timeout cwnd resets to 1 MSS.",
    'AIMD Algorithm': "AIMD = Additive Increase, Multiplicative Decrease. Additive increase raises cwnd by ~1 MSS per RTT when there is no loss; multiplicative decrease halves cwnd on loss. This asymmetry creates the TCP sawtooth and drives competing flows to a fair share.",
    'Slow Start': "Slow start begins with cwnd ~1 MSS and doubles every RTT (exponential growth) until it reaches ssthresh or a loss occurs, then TCP switches to congestion avoidance. A timeout resets cwnd to 1 MSS.",
    'TCP Congestion Avoidance': "Congestion avoidance grows cwnd linearly (additive increase) and reacts to loss with multiplicative decrease (i.e. AIMD). Three duplicate ACKs trigger fast retransmit / fast recovery without waiting for a timeout.",
}

SUBJECT_MATERIAL = "Computer_Networks_Unit4_Transport_Layer.pdf"


def enabled() -> bool:
    return bool(EMERGENT_LLM_KEY)


def _pick_model(model: str) -> str:
    return model if model in ALLOWED_MODELS else DEFAULT_MODEL


async def _chat(system: str, prompt: str, model: str) -> str:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    chat = LlmChat(api_key=EMERGENT_LLM_KEY, session_id="synapseedu", system_message=system).with_model("gemini", _pick_model(model))
    resp = await chat.send_message(UserMessage(text=prompt))
    return resp if isinstance(resp, str) else str(resp)


def _extract_json(text: str):
    a, b = text.find('['), text.rfind(']')
    if a == -1 or b == -1:
        raise ValueError("no json array")
    return json.loads(text[a:b + 1])


async def tutor(topic_name: str, question: str, model: str = DEFAULT_MODEL):
    context = CN_CONTEXT.get(topic_name, "")
    system = ("You are SynapseEDU's tutor. Answer the student's question using ONLY the provided context "
              "from THEIR uploaded Computer Networks study material. Be concise, clear and accurate. "
              "If the context is insufficient, say so briefly. Do not invent facts outside networking.")
    prompt = f"TOPIC: {topic_name}\nCONTEXT (from the student's material):\n{context}\n\nQUESTION: {question}"
    answer = await _chat(system, prompt, model)
    return {"answer": answer.strip(), "sources": [f"{topic_name} — {SUBJECT_MATERIAL}"], "grounded": True, "model": _pick_model(model)}


async def quiz(topic_name: str, difficulty: str = "medium", count: int = 5, model: str = DEFAULT_MODEL):
    system = "You generate high-quality multiple-choice questions for a Computer Networks course. Return ONLY a JSON array."
    prompt = (f'Generate {count} {difficulty} multiple-choice questions about "{topic_name}". '
              'Each item MUST be: {"question_text":"...","options":["a","b","c","d"],"correct_answer":0,'
              f'"difficulty":"{difficulty}","subtopic":"..."}}. Return ONLY the JSON array.')
    data = _extract_json(await _chat(system, prompt, model))
    out = []
    for i, q in enumerate(data[:count]):
        opts = q.get("options", [])[:4]
        if len(opts) < 2:
            continue
        ca = int(q.get("correct_answer", 0))
        out.append({"id": f"g{i}", "text": q.get("question_text", ""), "options": opts,
                    "correct": ca if 0 <= ca < len(opts) else 0,
                    "d": q.get("difficulty", difficulty), "st": q.get("subtopic", topic_name)})
    return out


async def extract(text: str, model: str = DEFAULT_MODEL):
    system = "You extract a study-topic structure from course material. Return ONLY a JSON array."
    prompt = ('From the following study material, extract 6-8 topics. Each item MUST be: '
              '{"name":"...","subtopics":["...","..."],"estimated_study_time":10}. Return ONLY the JSON array.\n\nMATERIAL:\n'
              + (text or "")[:12000])
    return _extract_json(await _chat(system, prompt, model))
