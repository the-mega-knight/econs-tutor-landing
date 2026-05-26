import { useState } from 'react';

const diagnosticData = {
  questions: [
    {
      q: "You are writing the final paragraph of a 25-mark Macro essay. What is your primary objective?",
      options: [
        { text: "A: Summarize points.", value: 'A' },
        { text: "B: Provide synthesized judgment on relative significance.", value: 'B' }
      ]
    },
    {
      q: "The extract shows a 4% increase CPI and 0.5% drop in real GDP. Next step?",
      options: [
        { text: "A: Define terms.", value: 'A' },
        { text: "B: Identify stagflation and scan for supply shocks.", value: 'B' }
      ]
    },
    {
      q: "Impact of a carbon tax?",
      options: [
        { text: "A: Micro externality diagram only.", value: 'A' },
        { text: "B: Micro correction + Macro cost-push inflation impacts.", value: 'B' }
      ]
    }
  ]
};

const profileData = {
  questions: [
    {
      q: "Primary revision strategy?",
      options: [
        { text: "A: Memorize notes/essays.", value: 'A' },
        { text: "B: Analyze Cambridge examiner reports.", value: 'B' }
      ]
    },
    {
      q: "Reaction to an unexpected 25-mark question?",
      options: [
        { text: "A: Brain-dump to secure content marks.", value: 'A' },
        { text: "B: Draft a rigid framework before writing.", value: 'B' }
      ]
    },
    {
      q: "Typical evaluation paragraph?",
      options: [
        { text: "A: 'Both policies have pros and cons.'", value: 'A' },
        { text: "B: 'Policy A is a stopgap; Policy B addresses root causes.'", value: 'B' }
      ]
    }
  ]
};

export default function QuizModal({ type, onClose }: { type: 'diagnostic' | 'profile', onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const data = type === 'diagnostic' ? diagnosticData : profileData;

  const handleOptionClick = (val: string) => {
    setAnswers(prev => [...prev, val]);
    setStep(prev => prev + 1);
  };

  if (step >= data.questions.length) {
    if (type === 'diagnostic') {
      return (
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#1d1d1f', letterSpacing: '-0.03em', fontWeight: 700 }}>
            Diagnostic Complete.<br />Structural Gaps Identified.
          </h2>
          <p style={{ color: 'var(--secondary-text)', fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>
            Standard memorization is capping your grade. You are losing critical marks in contextual application and synthesis.
          </p>
          <a 
            href="mailto:aidantheeconstutor1001@gmail.com?subject=Diagnostic%20Consultation%20Inquiry" 
            className="apple-btn" 
            style={{ display: 'inline-block', textDecoration: 'none', background: '#000', color: '#fff', fontSize: '1.3rem', padding: '1.2rem 3rem' }} 
            onClick={onClose}
          >
            Secure Your Slot
          </a>
        </div>
      );
    } else {
      const countA = answers.filter(a => a === 'A').length;
      const isMemorizer = countA >= 2;

      return (
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#1d1d1f', letterSpacing: '-0.03em', fontWeight: 700 }}>
            {isMemorizer ? 'Profile: The Memorizer.' : 'Profile: The Analyst.'}
          </h2>
          <p style={{ color: 'var(--secondary-text)', fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>
            {isMemorizer 
              ? "You are relying on brute force in a subject that tests structural logic. This is why your grades are stagnating. You need a system."
              : "You have the right mindset, but you need the exact Cambridge framework to guarantee the 'A'. Let's refine your execution."}
          </p>
          <a 
            href="mailto:aidantheeconstutor1001@gmail.com?subject=Profile%20Consultation%20Inquiry" 
            className="apple-btn" 
            style={{ display: 'inline-block', textDecoration: 'none', background: '#000', color: '#fff', fontSize: '1.3rem', padding: '1.2rem 3rem' }} 
            onClick={onClose}
          >
            Secure Your Slot
          </a>
        </div>
      );
    }
  }

  const currentQ = data.questions[step];

  return (
    <div style={{ width: '100%', maxWidth: '600px', textAlign: 'left' }}>
      <p style={{ color: 'var(--secondary-text)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Question {step + 1} of {data.questions.length}
      </p>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#1d1d1f', lineHeight: 1.4, fontWeight: 600 }}>{currentQ.q}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {currentQ.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => handleOptionClick(opt.value)}
            style={{ 
              padding: '1.2rem 1.5rem', 
              textAlign: 'left', 
              background: '#f5f5f7', 
              border: '1px solid rgba(0,0,0,0.05)', 
              borderRadius: '16px', 
              fontSize: '1.1rem',
              cursor: 'pointer',
              color: '#1d1d1f',
              transition: 'all 0.2s',
              lineHeight: 1.4
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
