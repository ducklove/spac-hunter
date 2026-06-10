"""Delisted-SPAC archive: detect universe departures and persist archive.json.

``build_archive_updates`` compares the previous ``data.js`` snapshot with the
codes that survived this run's universe pass. Codes that disappeared are
archived with their last-known state; codes that re-appear (re-listing) are
dropped from the archive again. ``write_archive``/``load_archive`` round-trip
``archive.json``. Live mode only — sample mode never calls into this module.
"""

import json
import logging
from pathlib import Path

from .constants import ARCHIVE_JSON_PATH

logger = logging.getLogger(__name__)

DELIST_REASON_MERGER = "합병 신상장 추정"
DELIST_REASON_UNKNOWN = "사유 미확인"


def _archive_entry(spac, existing_last_updated, archived_at):
    """Freeze the last-known data.js state of a departed SPAC."""
    merger_status = spac.get("mergerStatus")
    return {
        "code": spac.get("code"),
        "name": spac.get("name"),
        "sponsor": spac.get("sponsor"),
        "listingDate": spac.get("listingDate"),
        "mergerStatus": merger_status,
        "mergerPriceRecords": spac.get("mergerPriceRecords") or [],
        "finalPrice": spac.get("currentPrice"),
        "finalRatio": spac.get("ratio"),
        "badges": spac.get("badges") or [],
        "lastSeen": existing_last_updated,
        "archivedAt": archived_at,
        "delistReasonGuess": (
            DELIST_REASON_MERGER if merger_status == "합병 확정" else DELIST_REASON_UNKNOWN
        ),
    }


def _sort_archive(entries):
    """Newest archivedAt first; same-timestamp entries are stably ordered by code."""
    entries.sort(key=lambda entry: str(entry.get("code") or ""))
    entries.sort(key=lambda entry: str(entry.get("archivedAt") or ""), reverse=True)
    return entries


def build_archive_updates(existing_spacs, existing_last_updated, new_codes, previous_archive, generated_at):
    """Merge universe departures into the previous archive.

    * codes in ``existing_spacs`` but not in ``new_codes`` are newly archived
    * codes already in ``previous_archive`` keep their original entry (no re-archiving)
    * archived codes re-appearing in ``new_codes`` are removed (re-listing)

    Returns ``(archive, newly_archived)`` with the archive sorted archivedAt-desc.
    """
    new_codes = set(new_codes or [])
    archived_at = generated_at.isoformat()

    kept = []
    kept_codes = set()
    for entry in previous_archive or []:
        code = entry.get("code")
        if not code or code in new_codes or code in kept_codes:
            continue
        kept.append(entry)
        kept_codes.add(code)

    newly_archived = []
    for code, spac in (existing_spacs or {}).items():
        if not code or code in new_codes or code in kept_codes:
            continue
        newly_archived.append(_archive_entry(spac, existing_last_updated, archived_at))
    _sort_archive(newly_archived)

    return _sort_archive(kept + newly_archived), newly_archived


def load_archive(path=None):
    """Read the spacs list out of archive.json ([] when missing or unparseable)."""
    path = Path(path) if path else ARCHIVE_JSON_PATH
    if not path.exists():
        return []
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []
    spacs = payload.get("spacs") if isinstance(payload, dict) else None
    return [entry for entry in spacs or [] if isinstance(entry, dict) and entry.get("code")]


def write_archive(archive_spacs, generated_at, path=None):
    path = Path(path) if path else ARCHIVE_JSON_PATH
    archive_spacs = list(archive_spacs or [])
    path.write_text(
        json.dumps(
            {
                "updatedAt": generated_at.isoformat(),
                "count": len(archive_spacs),
                "spacs": archive_spacs,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    return path
