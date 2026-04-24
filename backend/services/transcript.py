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
                transcript_list = api.list_transcripts(video_id)
                first_available = next(iter(transcript_list))
                transcript = first_available.fetch()

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
    except Exception as e:
        raise Exception(f"Error fetching transcript: {str(e)}")