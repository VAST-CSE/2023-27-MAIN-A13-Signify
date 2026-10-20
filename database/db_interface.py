"""
Modular Database & Storage Interface

Provides an abstraction layer so that in-memory storage, SQLite, or Firebase
can be plugged in without refactoring API handlers.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime


class DatabaseInterface(ABC):
    @abstractmethod
    def save_session_history(self, session_data: Dict[str, Any]) -> str:
        pass

    @abstractmethod
    def get_session_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_learning_progress(self, user_id: str) -> Dict[str, Any]:
        pass


class InMemoryDatabase(DatabaseInterface):
    """
    Lightweight, dependency-free in-memory database for local runs and development.
    """

    def __init__(self):
        self.history: List[Dict[str, Any]] = []
        self.learning_progress: Dict[str, Dict[str, Any]] = {}

    def save_session_history(self, session_data: Dict[str, Any]) -> str:
        session_id = f"sess_{len(self.history) + 1}_{int(datetime.now().timestamp())}"
        record = {
            "id": session_id,
            "timestamp": datetime.utcnow().isoformat(),
            **session_data
        }
        self.history.append(record)
        return session_id

    def get_session_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        return list(reversed(self.history))[:limit]

    def get_learning_progress(self, user_id: str) -> Dict[str, Any]:
        return self.learning_progress.get(user_id, {
            "user_id": user_id,
            "completed_lessons": [],
            "practice_score": 0,
            "last_active": datetime.utcnow().isoformat()
        })


# Default in-memory database instance
db = InMemoryDatabase()
