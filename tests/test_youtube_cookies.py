import os
import sys
import stat

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from youtube_cookies import (
    cleanup_temp_cookie_file,
    looks_like_youtube_cookie_file,
    normalize_cookie_text,
    write_temp_cookie_file,
)


def test_normalize_cookie_text_uses_unix_newlines_and_trailing_newline():
    raw = ".youtube.com\tTRUE\t/\tTRUE\t2147483647\tSID\tabc\r\n"
    assert normalize_cookie_text(raw) == ".youtube.com\tTRUE\t/\tTRUE\t2147483647\tSID\tabc\n"


def test_detects_valid_youtube_netscape_cookie_file():
    raw = "# Netscape HTTP Cookie File\n.youtube.com\tTRUE\t/\tTRUE\t2147483647\tSID\tabc\n"
    assert looks_like_youtube_cookie_file(raw) is True


def test_rejects_empty_or_wrong_domain_cookie_text():
    assert looks_like_youtube_cookie_file("") is False
    assert looks_like_youtube_cookie_file(".example.com\tTRUE\t/\tTRUE\t2147483647\tSID\tabc\n") is False


def test_write_temp_cookie_file_creates_private_file_and_cleanup(tmp_path):
    raw = ".youtube.com\tTRUE\t/\tTRUE\t2147483647\tSID\tabc\n"

    path = write_temp_cookie_file("job-123", raw, temp_dir=str(tmp_path))

    assert os.path.exists(path)
    assert os.path.basename(path).startswith("openshorts-youtube-cookies-job-123")
    assert open(path, encoding="utf-8").read() == raw

    mode = stat.S_IMODE(os.stat(path).st_mode)
    assert mode == 0o600

    cleanup_temp_cookie_file(path)
    assert not os.path.exists(path)


def test_write_temp_cookie_file_rejects_invalid_text(tmp_path):
    with pytest.raises(ValueError, match="Invalid YouTube cookies"):
        write_temp_cookie_file("job-123", "not cookies", temp_dir=str(tmp_path))


def test_cleanup_ignores_unknown_prefix(tmp_path):
    path = os.path.join(str(tmp_path), "some-other-file.txt")
    with open(path, "w") as f:
        f.write("x")

    cleanup_temp_cookie_file(path)
    assert os.path.exists(path)
    os.remove(path)


def test_cleanup_ignores_none():
    cleanup_temp_cookie_file(None)
