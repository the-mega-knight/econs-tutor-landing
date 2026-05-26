import { motion } from 'framer-motion';
import MarketSimulator from './MarketSimulator';

export default function UI({ setActiveModal }: { setActiveModal: (modal: string | null) => void }) {
  return (
    <div className="html-container">
      
      {/* Page 1: Hero */}
      <section className="html-section">
        <div className="max-w-6xl glass-text-bg" style={{ textAlign: 'center' }}>
          <motion.h1 
            className="massive-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            You don't need more studying.<br />You need a system.
          </motion.h1>
          <motion.p 
            className="sub-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            viewport={{ once: true }}
          >
            Master H2 & A2 Economics with structured data, brutal honesty, and relentless practice.
          </motion.p>
        </div>
      </section>

      {/* Page 2: The Chaos */}
      <section className="html-section dark-theme">
        <div className="max-w-6xl glass-text-bg" style={{ textAlign: 'center' }}>
          <h2 className="massive-text" style={{ color: '#1d1d1f' }}>The Market of Confusion.</h2>
          <p className="sub-text" style={{ color: '#1d1d1f', fontWeight: 500 }}>Standard memorization will fail.</p>
        </div>
      </section>

      {/* Page 3: The Structure */}
      <section className="html-section">
        <div className="max-w-6xl glass-text-bg" style={{ textAlign: 'center' }}>
          <h2 className="massive-text" style={{ color: '#0066cc' }}>The Power of Analysis.</h2>
          <p className="sub-text" style={{ color: '#1d1d1f', fontWeight: 500 }}>Concise essays, 3-a-week practice regimens, and pure structural logic.</p>
        </div>
      </section>

      {/* Page 4: Interactive Market Simulator */}
      <section className="html-section" style={{ minHeight: '110vh' }}>
        <MarketSimulator />
      </section>

      {/* Page 5: The Profile */}
      <section className="html-section">
        <div className="max-w-6xl">
          <div className="profile-container">
            <div className="profile-image-placeholder">
              <img 
                src="/profile.jpg" 
                alt="Aidan Koh" 
                style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: 'inherit', filter: 'grayscale(100%)' }} 
              />
            </div>
            <div className="profile-text">
              <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em' }}>The Architect.</h2>
              <p style={{ fontSize: '1.3rem', color: 'var(--secondary-text)', lineHeight: 1.6, marginBottom: '1rem' }}>
                I am Aidan Koh. NUS Merit Scholar (Data Science & Economics) and ACS Alumnus.
              </p>
              <p style={{ fontSize: '1.3rem', color: 'var(--secondary-text)', lineHeight: 1.6, marginBottom: '1rem' }}>
                I don't just teach economics; I reverse-engineer the Cambridge marking scheme. With a background in data science and proprietary trading, my curriculum is built on structural logic, pattern recognition, and zero fluff.
              </p>
              <p style={{ fontSize: '1.3rem', color: '#000', fontWeight: 600, lineHeight: 1.6 }}>
                If you want comfort, look elsewhere. If you want an A, we get to work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Page 5: Authority & Results (Bento Grid) */}
      <section className="html-section">
        <div className="max-w-6xl">
          <div className="bento-grid">
            <div className="bento-card">
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Elite Pedigree</h3>
              <p style={{ color: 'var(--secondary-text)', lineHeight: 1.6 }}>4 Years. 15+ Students. Taught by an NUS Merit Scholar (Data Science & Economics) and ACS Alumnus (6 Distinctions).</p>
            </div>
            <div className="bento-card">
              <h3 style={{ fontSize: '3rem', color: '#0066cc', marginBottom: '1rem' }}>E to A</h3>
              <p style={{ color: 'var(--secondary-text)', lineHeight: 1.6 }}>Proven track record of transforming failing grades into distinctions in under 8 months.</p>
            </div>
            <div className="bento-card bento-span-2">
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>The Regimen</h3>
              <p style={{ color: 'var(--secondary-text)', lineHeight: 1.6 }}>Zero sugarcoating. 3 marked essays a week. Pure concise evaluation tailored precisely to Cambridge marking schemes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Page 6: Testimonial & Interactive Assessment & CTA */}
      <section className="html-section">
        <div className="max-w-6xl" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="quote-mark">"</div>
          <p className="testimonial-text">
            I was so down bad for H2 Econs (got an E). He promised me an A within 4 months… I thought he was a scammer. After he showed me his secret sauce, I changed his contact to DR ECONS. He forced me to do 3 essays a week even though he was busy in uni. Went from not knowing I needed to evaluate to his ideal way: concise. He is very real and doesn't sugarcoat. Got an A in less than 8 months. He's the real deal.
          </p>
          <p style={{ marginTop: '1.5rem', fontWeight: 600, color: 'var(--secondary-text)', fontSize: '1.2rem' }}>— Hong Xiang, NS Private Candidate</p>
        </div>

        <div className="max-w-6xl" style={{ marginBottom: '4rem' }}>
          <div className="assessment-container">
            <div className="assessment-card" onClick={() => setActiveModal('diagnostic')}>
              <h3 style={{ fontSize: '1.8rem' }}>Diagnostic Test</h3>
              <p style={{ color: 'var(--secondary-text)', marginTop: '0.8rem', fontSize: '1.1rem' }}>Where are you losing marks?</p>
            </div>
            <div className="assessment-card" onClick={() => setActiveModal('profile')}>
              <h3 style={{ fontSize: '1.8rem' }}>Student Profile</h3>
              <p style={{ color: 'var(--secondary-text)', marginTop: '0.8rem', fontSize: '1.1rem' }}>What's your Econ blindspot?</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl" style={{ background: '#000', color: '#fff', padding: '5rem 3rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>Stop guessing. Start executing.</h2>
          <p style={{ color: '#a1a1a6', marginBottom: '2.5rem', fontSize: '1.3rem' }}>Booking for H2 and A2 intensive coaching.</p>
          <button className="apple-btn" style={{ background: '#fff', color: '#000', padding: '1.2rem 3rem', fontSize: '1.3rem' }} onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>Apply Now</button>
        </div>
      </section>

    </div>
  );
}
