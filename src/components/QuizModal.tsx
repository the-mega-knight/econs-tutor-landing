import { useState } from 'react';

const questions = [
  {
    q: "You are writing the final paragraph of a 25-mark Macro essay. What is your primary objective?",
    options: [
      { text: "A: Summarize points.", isCorrect: false },
      { text: "B: Provide synthesized judgment on relative significance.", isCorrect: true }
    ]
  },
  {
    q: "The extract shows a 4% increase CPI and 0.5% drop in real GDP. Next step?",
    options: [
      { text: "A: Define terms.", isCorrect: false },
      { text: "B: Identify stagflation and scan for supply shocks.", isCorrect: true }
    ]
  },
  {
    q: "Impact of a carbon tax?",
    options: [
      { text: "A: Micro externality diagram only.", isCorrect: false },
      { text: "B: Micro correction + Macro cost-push inflation impacts.", isCorrect: true }
    ]
  }
];

export default function QuizModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  const handleOptionClick = () => {
    setStep(prev => prev + 1);
  };

  if (step >= questions.length) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1d1d1f' }}>Assessment Complete.</h2>
        <p style={{ color: 'var(--secondary-text)', fontSize: '1.2rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          Your structural gaps have been identified. Book your consultation to review the data.
        </p>
        <button className="apple-btn" onClick={() => { onClose(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}>
          Book Consultation
        </button>
      </div>
    );
  }

  const currentQ = questions[step];

  return (
    <div style={{ width: '100%', maxWidth: '500px' }}>
      <p style={{ color: 'var(--secondary-text)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Question {step + 1} of {questions.length}
      </p>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#1d1d1f', lineHeight: 1.4 }}>{currentQ.q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {currentQ.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={handleOptionClick}
            style={{ 
              padding: '1rem 1.5rem', 
              textAlign: 'left', 
              background: '#f5f5f7', 
              border: '1px solid rgba(0,0,0,0.05)', 
              borderRadius: '12px', 
              fontSize: '1.1rem',
              cursor: 'pointer',
              color: '#1d1d1f',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#e8e8ed')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#f5f5f7')}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
