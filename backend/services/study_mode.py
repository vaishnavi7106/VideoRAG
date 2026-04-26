from services.llm import generate_study_questions


def build_study_set(video_id: str, video_title: str, chunks: list) -> dict:
    """
    Builds a study set for a video: questions, answers, timestamps.
    """
    if not chunks:
        return {
            "video_id": video_id,
            "video_title": video_title,
            "questions": []
        }

    questions = generate_study_questions(chunks, video_title)

    return {
        "video_id": video_id,
        "video_title": video_title,
        "questions": questions
    }