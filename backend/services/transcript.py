import re
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound


def extract_video_id(url: str) -> str:
    patterns = [
        r"v=([a-zA-Z0-9_-]+)",
        r"youtu\.be/([a-zA-Z0-9_-]+)"
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    raise ValueError("Invalid YouTube URL")


def get_transcript(video_id: str):
    try:
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id)

        # Convert transcript objects into simple dicts
        return [
            {
                "text": t.text,
                "start": t.start,
                "duration": t.duration
            }
            for t in transcript
        ]

    except TranscriptsDisabled:
        raise Exception("Transcripts are disabled for this video")

    except NoTranscriptFound:
        raise Exception("No transcript found for this video")

    except Exception as e:
        raise Exception(f"Error fetching transcript: {str(e)}")