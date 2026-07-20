import os
import re
import stat
import tempfile


_COOKIE_FILE_PREFIX = "openshorts-youtube-cookies-"


def normalize_cookie_text(text: str) -> str:
    normalized = str(text or "").replace("\r\n", "\n").replace("\r", "\n").strip()
    return f"{normalized}\n" if normalized else ""


def looks_like_youtube_cookie_file(text: str) -> bool:
    normalized = normalize_cookie_text(text)
    if not normalized:
        return False

    rows = [
        line.strip()
        for line in normalized.splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]

    has_netscape_row = any(len(row.split("\t")) >= 7 for row in rows)
    has_youtube_domain = any(
        "youtube.com" in row.lower() or "google.com" in row.lower()
        for row in rows
    )

    return has_netscape_row and has_youtube_domain


def _safe_job_id(job_id: str) -> str:
    safe = re.sub(r"[^a-zA-Z0-9_.-]+", "-", str(job_id or "job")).strip("-")
    return safe or "job"


def write_temp_cookie_file(job_id: str, cookie_text: str, temp_dir: str | None = None) -> str:
    normalized = normalize_cookie_text(cookie_text)

    if not looks_like_youtube_cookie_file(normalized):
        raise ValueError("Invalid YouTube cookies. Expected Netscape cookies.txt format with youtube.com or google.com entries.")

    directory = temp_dir or tempfile.gettempdir()
    path = os.path.join(directory, f"{_COOKIE_FILE_PREFIX}{_safe_job_id(job_id)}.txt")

    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(normalized)

    os.chmod(path, stat.S_IRUSR | stat.S_IWUSR)
    return path


def cleanup_temp_cookie_file(path: str | None) -> None:
    if not path:
        return

    basename = os.path.basename(path)
    if not basename.startswith(_COOKIE_FILE_PREFIX):
        return

    try:
        if os.path.exists(path):
            os.remove(path)
    except OSError as exc:
        print(f"Warning: failed to remove temporary YouTube cookies file: {exc}")
