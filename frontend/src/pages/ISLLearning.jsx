import React, { useMemo, useState } from 'react';
import { BookOpen, Camera, CheckCircle2, ChevronRight, Sparkles, Trophy } from 'lucide-react';
import Card from '../components/Card';
import WebcamCapture from '../components/WebcamCapture';

const lessonData = [
  { id: 1, category: 'Greetings', title: 'Hello', tag: 'HELLO', description: 'Wave your hand gently and smile.' },
  { id: 2, category: 'Greetings', title: 'Good morning', tag: 'GOOD MORNING', description: 'Open palm near your face and move forward.' },
  { id: 3, category: 'Numbers', title: 'One', tag: 'ONE', description: 'Hold up one finger in front of your chest.' },
  { id: 4, category: 'Numbers', title: 'Two', tag: 'TWO', description: 'Hold up two fingers clearly.' },
  { id: 5, category: 'Daily Use', title: 'Thank you', tag: 'THANK YOU', description: 'Bring your hand to your chest and move forward gently.' },
  { id: 6, category: 'Daily Use', title: 'Please', tag: 'PLEASE', description: 'Open palm facing upward and move slightly.' },
  { id: 7, category: 'Family', title: 'Mother', tag: 'MOTHER', description: 'Touch your chin and move your hand down gently.' },
  { id: 8, category: 'Questions', title: 'How are you?', tag: 'HOW ARE YOU', description: 'Ask with an open palm and eye contact.' },
  { id: 9, category: 'Emergency', title: 'Help', tag: 'HELP', description: 'Raise both hands with palms open and outward.' }
];

const categories = ['Greetings', 'Numbers', 'Daily Use', 'Family', 'Questions', 'Emergency'];

export default function ISLLearning() {
  const [selectedCategory, setSelectedCategory] = useState('Greetings');
  const [activeLesson, setActiveLesson] = useState(lessonData[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [completed, setCompleted] = useState(new Set([1]));

  const visibleLessons = useMemo(
    () => lessonData.filter((lesson) => lesson.category === selectedCategory),
    [selectedCategory]
  );

  const progressPercentage = Math.round((completed.size / lessonData.length) * 100);

  const toggleComplete = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="hero-badges">
          <span className="status-pill ready">Learn ISL</span>
          <span className="status-pill info">Practice with camera</span>
        </div>
        <h1>Learn ISL</h1>
        <p>Explore everyday signs, practice with a camera, and track your progress.</p>
      </div>

      <Card className="progress-card">
        <div className="progress-top">
          <div className="progress-label">
            <Trophy size={18} />
            <span>Your progress</span>
          </div>
          <strong>{completed.size} / {lessonData.length}</strong>
        </div>
        <div className="progress-bar">
          <span style={{ width: `${progressPercentage}%` }} />
        </div>
      </Card>

      <div className="chip-row">
        {categories.map((category) => (
          <button
            key={category}
            className={`chip ${selectedCategory === category ? 'selected' : ''}`}
            onClick={() => {
              setSelectedCategory(category);
              const firstLesson = lessonData.find((item) => item.category === category);
              if (firstLesson) setActiveLesson(firstLesson);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="simple-grid">
        <div className="lesson-list">
          {visibleLessons.map((lesson) => {
            const isSelected = activeLesson?.id === lesson.id;
            const isDone = completed.has(lesson.id);

            return (
              <button
                key={lesson.id}
                className={`lesson-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setActiveLesson(lesson)}
              >
                <div className="lesson-item-main">
                  <div className="lesson-check" onClick={(e) => { e.stopPropagation(); toggleComplete(lesson.id); }}>
                    <CheckCircle2 size={18} fill={isDone ? 'currentColor' : 'none'} />
                  </div>

                  <div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.category}</p>
                  </div>
                </div>

                <div className="lesson-tag-box">
                  <span>{lesson.tag}</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            );
          })}
        </div>

        {activeLesson && (
          <Card title={activeLesson.title} icon={<BookOpen size={18} />} subtitle={`Category: ${activeLesson.category}`}>
            <div className="lesson-detail-box">
              <span className="mini-label">Sign guide</span>
              <p>{activeLesson.description}</p>
            </div>

            <div className="practice-box">
              <div className="practice-header">
                <span className="mini-label">Practice with camera</span>
                <span className="tiny-badge">{isCameraActive ? 'Live' : 'Ready'}</span>
              </div>

              <WebcamCapture
                isStreaming={isCameraActive}
                setIsStreaming={setIsCameraActive}
                landmarkStatus={isCameraActive ? 'Practice mode' : 'Not active'}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
