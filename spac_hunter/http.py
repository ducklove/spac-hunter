"""Shared HTTP helpers built on requests.

``make_session`` returns a ``requests.Session`` with the project user agent and
a urllib3 ``Retry`` policy (total=2, backoff 0.5, status 429/503) mounted on
both schemes. ``http_json``/``http_text`` are simple GET helpers that replace
the previous ``urllib.request`` based implementations.

Note: ``kind_post`` (in ``sources.kind``) intentionally keeps its own manual
retry loop because it also has to handle 403 responses, which the urllib3
``Retry`` policy does not cover.
"""

import json
import threading

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from .constants import USER_AGENT

_thread_local = threading.local()


def make_session(referer: str | None = None) -> requests.Session:
    """Create a requests session with the shared UA header and retry policy."""
    session = requests.Session()
    headers = {"User-Agent": USER_AGENT}
    if referer:
        headers["Referer"] = referer
    session.headers.update(headers)
    retry = Retry(
        total=2,
        backoff_factor=0.5,
        status_forcelist=(429, 503),
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


def shared_session() -> requests.Session:
    """Return a per-thread shared session (safe under ThreadPoolExecutor)."""
    session = getattr(_thread_local, "session", None)
    if session is None:
        session = make_session()
        _thread_local.session = session
    return session


def http_json(url: str, timeout: int = 12):
    response = shared_session().get(url, timeout=timeout)
    response.raise_for_status()
    return json.loads(response.content.decode("utf-8"))


def http_text(url: str, timeout: int = 12, encoding: str = "utf-8") -> str:
    response = shared_session().get(url, timeout=timeout)
    response.raise_for_status()
    return response.content.decode(encoding, errors="ignore")
