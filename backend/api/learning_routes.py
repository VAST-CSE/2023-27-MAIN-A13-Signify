"""
ISL Learning & Curriculum API Endpoints
"""

from fastapi import APIRouter
from backend.schemas.models import LearningResponse, LessonItem

router = APIRouter(prefix="/learning", tags=["ISL Learning"])

# Predefined standard Indian Sign Language curriculum items
LESSONS_CATALOG = [
    LessonItem(
        id="isl_alpha_a",
        category="Alphabets (Two-Handed / Single-Handed)",
        name="Letter 'A'",
        gloss="A",
        description="Form a fist with your primary hand and rest your thumb against the side of the index finger pointing upwards.",
        key_points=["Keep wrist upright", "Thumb points vertically upwards", "Fingers curled securely"],
        difficulty="Beginner",
        hand_used="Single Hand (Dominant)"
    ),
    LessonItem(
        id="isl_alpha_b",
        category="Alphabets (Two-Handed / Single-Handed)",
        name="Letter 'B'",
        gloss="B",
        description="Hold both hands with index and middle fingers joined to form the dual loops of the letter B.",
        key_points=["Touch index finger tips together", "Touch thumbs at bottom", "Keep palms facing inward"],
        difficulty="Beginner",
        hand_used="Two Hands"
    ),
    LessonItem(
        id="isl_alpha_c",
        category="Alphabets (Two-Handed / Single-Handed)",
        name="Letter 'C'",
        gloss="C",
        description="Curved open hand forming the letter 'C' shape with thumb and index finger.",
        key_points=["Form distinct C arc", "Palm facing sideways", "Maintain finger curve"],
        difficulty="Beginner",
        hand_used="Single Hand (Dominant)"
    ),
    LessonItem(
        id="isl_word_hello",
        category="Everyday Greetings",
        name="Hello / Namaste",
        gloss="HELLO",
        description="Bring palms together near chest level in traditional Namaste or wave an open palm smoothly near shoulder height.",
        key_points=["Palms joined at chest level", "Gentle slight head nod", "Natural respectful posture"],
        difficulty="Beginner",
        hand_used="Two Hands"
    ),
    LessonItem(
        id="isl_word_thankyou",
        category="Everyday Greetings",
        name="Thank You",
        gloss="THANK YOU",
        description="Touch fingertips of dominant hand to your chin/lips, then extend the hand forward towards the conversation partner.",
        key_points=["Start at lower lip/chin", "Move smoothly outward towards person", "Palm tilted slightly upward"],
        difficulty="Beginner",
        hand_used="Single Hand (Dominant)"
    ),
    LessonItem(
        id="isl_word_help",
        category="Emergency & Assistance",
        name="Help",
        gloss="HELP",
        description="Place a closed fist with thumb up (dominant hand) onto the flat open palm of the non-dominant hand and raise both slightly.",
        key_points=["Non-dominant palm flat facing up", "Dominant fist placed on palm", "Lift both hands upward together"],
        difficulty="Intermediate",
        hand_used="Two Hands"
    ),
    LessonItem(
        id="isl_word_name",
        category="Conversation",
        name="Name",
        gloss="NAME",
        description="Form 'H' shape (index and middle extended) on both hands and tap dominant fingers across non-dominant fingers.",
        key_points=["Index and middle fingers extended", "Tap twice gently", "Keep hands in front of chest"],
        difficulty="Intermediate",
        hand_used="Two Hands"
    )
]


@router.get("", response_model=LearningResponse)
def get_isl_lessons():
    """
    Returns structured ISL learning lessons and curriculum metadata.
    """
    categories = sorted(list(set(item.category for item in LESSONS_CATALOG)))
    return LearningResponse(
        categories=categories,
        lessons=LESSONS_CATALOG,
        total_lessons=len(LESSONS_CATALOG),
        system_status="Practice interface active. CNN-BiLSTM evaluation model integration in progress."
    )
