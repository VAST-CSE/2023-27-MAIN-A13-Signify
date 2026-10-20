"""
NLP Service Base Interface
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List


class NLPServiceInterface(ABC):
    """
    Abstract interface for Natural Language Processing in the ISL Assistant.
    """

    @abstractmethod
    def gloss_to_english(self, gloss_sequence: List[str]) -> Dict[str, Any]:
        """
        Translates a sequence of recognized ISL Glosses into a grammatically coherent English sentence.
        """
        pass

    @abstractmethod
    def english_to_isl_structure(self, english_text: str) -> Dict[str, Any]:
        """
        Parses an English sentence into its ISL grammatical representation (Subject-Object-Verb / Gloss sequence).
        """
        pass
