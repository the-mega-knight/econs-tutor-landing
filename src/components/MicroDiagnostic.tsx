import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    q: "A government subsidizes an industry facing inelastic demand. What is the primary impact on the consumer?",
    options: [
      { text: "Price drops significantly, and consumer surplus increases heavily.", isCorrect: true, eval: "Correct. With inelastic demand, the incidence of the subsidy falls heavily on the consumer. The steep curve means the vertical price drop is massive compared to quantity expansion." },
      { text: "Quantity traded surges, maximizing consumer utility.", isCorrect: false, eval: "Incorrect. You failed to recognize the elasticity constraint. Inelastic demand implies consumers are unresponsive to price changes. Quantity barely moves. This is an automatic fail on part (b)." }
    ]
  },
  {
    q: "In an oligopoly, firm A lowers prices to capture market share. Why is this a fatal strategy?",
    options: [
      { text: "Because it triggers a price war, leading to a kinked demand curve scenario where revenue falls.", isCorrect: true, eval: "Correct. Rivals will match price cuts but ignore price hikes. You recognized the structural rigidity of the kinked demand curve." },
      { text: "Because production costs will exceed marginal revenue.", isCorrect: false, eval: "Incorrect. You are confusing market structure theory with basic profit maximization. Oligopolistic interdependence is the key. The examiner will penalize your lack of structural logic." }
    ]
  },
  {
    q: "A carbon tax is implemented on steel production. Meanwhile, global demand for steel surges. What happens to the market price?",
    options: [
      { text: "Price surges definitively, but quantity traded is indeterminate.", isCorrect: true, eval: "Correct. The tax shifts Supply left (cost-push), while the surge shifts Demand right. Both forces push price up definitively, but their opposing effects on quantity require exact magnitude data." },
      { text: "Price and quantity both increase definitively.", isCorrect: false, eval: "Incorrect. You assumed magnitude without data. The leftward supply shift contracts quantity, while the rightward demand shift expands it. The final quantity is indeterminate. This lack of rigorous logic will cap your grade." }
    ]
  }
];

export default function MicroDiagnostic() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const q = questions[currentIdx];
  const isFinished = currentIdx >= questions.length;

  return (
    <div className="glass-text-bg" style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '3rem', 
      textAlign: 'left',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {!isFinished ? (
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em' }}>The Micro-Diagnostic</h3>
              <span style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', fontWeight: 600, letterSpacing: '0.1em' }}>
                Q{currentIdx + 1} OF 3
              </span>
            </div>

            <p style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: '2rem', lineHeight: 1.5 }}>{q.q}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {q.options.map((opt, i) => {
                const isSelected = selectedIdx === i;
                const isCorrect = opt.isCorrect;
                const showReveal = selectedIdx !== null;
                
                let bg = 'rgba(255, 255, 255, 0.8)';
                let border = '1px solid rgba(0,0,0,0.1)';
                let textColor = 'var(--text-color)';

                if (showReveal) {
                  if (isSelected && isCorrect) {
                    bg = '#e8f5e9'; 
                    border = '1px solid #4caf50';
                    textColor = '#2e7d32';
                  } else if (isSelected && !isCorrect) {
                    bg = '#ffebee'; 
                    border = '1px solid #f44336';
                    textColor = '#c62828';
                  } else if (isCorrect) {
                    border = '1px solid #4caf50';
                  }
                }

                return (
                  <button 
                    key={i}
                    onClick={() => { if (selectedIdx === null) setSelectedIdx(i) }}
                    style={{
                      background: bg,
                      border: border,
                      color: textColor,
                      padding: '1.5rem',
                      borderRadius: '16px',
                      textAlign: 'left',
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      cursor: showReveal ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {selectedIdx !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: q.options[selectedIdx].isCorrect ? '#e8f5e9' : '#fff0f0',
                  borderLeft: `4px solid ${q.options[selectedIdx].isCorrect ? '#4caf50' : '#ff3b30'}`,
                  borderRadius: '0 12px 12px 0'
                }}
              >
                <p style={{ fontWeight: 600, color: q.options[selectedIdx].isCorrect ? '#2e7d32' : '#c62828', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                  Examiner Evaluation
                </p>
                <p style={{ color: '#1d1d1f', fontSize: '1.1rem', lineHeight: 1.5 }}>
                  {q.options[selectedIdx].eval}
                </p>
                
                <button 
                  className="apple-btn"
                  style={{ marginTop: '1.5rem', padding: '0.8rem 2rem', fontSize: '1rem' }}
                  onClick={() => {
                    setSelectedIdx(null);
                    setCurrentIdx(c => c + 1);
                  }}
                >
                  Next Scenario
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Diagnostic Complete.</h3>
          <p style={{ fontSize: '1.2rem', color: 'var(--secondary-text)', marginBottom: '2rem' }}>If you hesitated on any of those, your structural logic is flawed. We fix that here.</p>
          <button 
            className="apple-btn"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            Claim Your Spot
          </button>
        </div>
      )}
    </div>
  );
}
