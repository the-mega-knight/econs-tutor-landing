import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import NetworkNodes from './components/NetworkNodes';
import ChaosVortex from './components/ChaosVortex';
import UI from './components/UI';
import QuizModal from './components/QuizModal';

function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Note: Since ScrollControls hijacks the scroll, window.scrollTo inside nav-btn won't work natively if Drei captures it.
  // We can use native smooth scroll by simulating it, or simply scroll the scroll container that Drei creates.
  // Actually, `@react-three/drei` ScrollControls intercepts the wheel, but allows the native scrollbar on the parent wrapper if not hidden.
  // But since we just want a visual button, window.scrollTo might just trigger the native browser scroll which Drei listens to!

  return (
    <>
      <nav className="nav-bar">
        <div className="nav-logo">ezA tuition centre</div>
        <button 
          className="nav-btn" 
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        >
          Book Assessment
        </button>
      </nav>

      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <color attach="background" args={['#ffffff']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <ScrollControls pages={7} damping={0.1}>
            <NetworkNodes />
            <ChaosVortex />
            <Scroll html>
              <UI setActiveModal={setActiveModal} />
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setActiveModal(null)}>Close</button>
              <QuizModal type={activeModal as 'diagnostic' | 'profile'} onClose={() => setActiveModal(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
