"""
SynapseEDU — platform proxy.

The Emergent preview ingress hard-routes all `/api/*` traffic to this FastAPI process on
port 8001. The REAL application backend is Node.js + Express + MySQL (see /app/backend-node),
running locally on port 9000. This file contains NO business logic — it is a transparent
reverse proxy that forwards every request to the Node backend. All auth, MySQL, Gemini,
mastery, quiz and revision logic live in the Node service.
"""
import os
import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response

NODE_BACKEND = os.environ.get("NODE_BACKEND_URL", "http://127.0.0.1:9000")

app = FastAPI(title="SynapseEDU Proxy")

client = httpx.AsyncClient(base_url=NODE_BACKEND, timeout=120.0)

_HOP_BY_HOP = {
    "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
    "te", "trailers", "transfer-encoding", "upgrade", "host", "content-length",
}


@app.get("/api/_proxy/health")
async def proxy_health():
    try:
        r = await client.get("/api/health")
        return {"proxy": "ok", "node": r.json()}
    except Exception as e:  # noqa
        return {"proxy": "ok", "node": "unreachable", "error": str(e)}


@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def reverse_proxy(full_path: str, request: Request):
    url = "/" + full_path
    if request.url.query:
        url += "?" + request.url.query

    headers = {k: v for k, v in request.headers.items() if k.lower() not in _HOP_BY_HOP}
    body = await request.body()

    req = client.build_request(request.method, url, headers=headers, content=body)
    resp = await client.send(req)

    resp_headers = {k: v for k, v in resp.headers.items() if k.lower() not in _HOP_BY_HOP}
    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=resp_headers,
        media_type=resp.headers.get("content-type"),
    )
