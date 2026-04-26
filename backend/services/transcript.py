import re
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound


def extract_video_id(url: str) -> str:
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(pattern, url)
    if not match:
        raise Exception("Invalid YouTube URL")
    return match.group(1)


def get_transcript(video_id: str):
    try:
        api = YouTubeTranscriptApi()

        try:
            transcript = api.fetch(video_id, languages=["en"])
        except NoTranscriptFound:
            try:
                transcript = api.fetch(video_id, languages=["en-US", "en-GB"])
            except NoTranscriptFound:
                # fallback: get whatever language is available
                transcript_list = api.list(video_id)
                first_available = next(iter(transcript_list))
                transcript = first_available.fetch()

        return [
            {
                "text": snippet.text,
                "start": snippet.start,
                "duration": snippet.duration
            }
            for snippet in transcript
        ]

    except TranscriptsDisabled:
        raise Exception("Transcripts are disabled for this video. Try a different video.")
    except StopIteration:
        raise Exception("No transcripts available for this video.")
    except Exception as e:
        msg = str(e)
        if "no element found" in msg.lower() or "list_transcripts" in msg.lower():
            raise Exception("Could not fetch transcript. The video may be private, age-restricted, or have no captions.")
        raise Exception(f"Could not fetch transcript: {msg}")