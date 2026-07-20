# YouTube Cookies Setup

YouTube may block downloads from servers or Docker deployments. Virlo can use your own YouTube browser cookies so Clip Generator can download videos like your browser.

## Recommended Setup

1. Open a private/incognito browser window.
2. Log in to YouTube.
3. In the same private window, open `https://www.youtube.com/robots.txt`.
4. Export cookies using a cookies.txt browser extension.
5. In Virlo Clip Generator, click `Setup YouTube Access`.
6. Import the exported `cookies.txt`.
7. Close the private/incognito browser window.

## Storage

Virlo stores the imported cookies only in your browser. The cookies are sent to the backend only when you run a YouTube URL job.

The backend writes cookies to a temporary per-job file for yt-dlp and deletes that file after the job finishes or fails.

## Updating Cookies

If YouTube downloads start failing again, your cookies may have expired. Click `Update` in the YouTube Access panel and import a fresh cookies.txt file.

## Removing Cookies

Click `Remove` in the YouTube Access panel to delete saved YouTube cookies from this browser.
