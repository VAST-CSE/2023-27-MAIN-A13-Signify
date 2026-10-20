import React from 'react';
import { BookOpen, CircleHelp, Lightbulb, Wrench, ShieldCheck } from 'lucide-react';
import Card from '../components/Card';

export default function AboutHelp() {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div className="hero-badges">
          <span className="status-pill info">Help</span>
          <span className="status-pill ready">Simple guide</span>
        </div>
        <h1>Help</h1>
        <p>Learn how to use the app, what each section does, and how to fix common issues.</p>
      </div>

      <div className="simple-grid help-grid">
        <Card title="About this project" icon={<BookOpen size={18} />}>
          <p className="help-copy">Smart ISL Communication Assistant helps people communicate more easily between Indian Sign Language and English. It is designed to be simple, friendly, and easy for first-time users.</p>
          <ul className="help-list">
            <li>Use the camera to translate signs into English.</li>
            <li>Type or speak to convert English into ISL-style signs.</li>
            <li>Learn common signs in a simple lesson section.</li>
          </ul>
        </Card>

        <Card title="How to use" icon={<Lightbulb size={18} />}>
          <ol className="help-list ordered">
            <li>Open Home to see the main tools.</li>
            <li>Choose Sign to English and allow camera access.</li>
            <li>Choose English to Sign and type or speak a sentence.</li>
            <li>Use Learn ISL to practice everyday signs with the camera.</li>
          </ol>
        </Card>

        <Card title="Troubleshooting" icon={<Wrench size={18} />}>
          <ul className="help-list">
            <li>If the camera does not open, allow browser permission.</li>
            <li>If speech does not work, type your sentence instead.</li>
            <li>If the app feels slow, refresh the page and try again.</li>
            <li>Use a bright area with clear hand movements for better results.</li>
          </ul>
        </Card>

        <Card title="Need support?" icon={<ShieldCheck size={18} />}>
          <p className="help-copy">This app is meant to be simple and beginner-friendly. Start with the home page, follow the prompts, and use the camera and text tools in the order shown.</p>
          <div className="support-box">
            <CircleHelp size={18} />
            <span>Tip: keep your hands in view and avoid background clutter.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
