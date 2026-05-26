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

  return (
    <>
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <color attach="background" args={['#ffffff']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <ScrollControls pages={6} damping={0.1}>
            {/* 3D Scene Layer */}
            <NetworkNodes />
            <ChaosVortex />
            
            {/* HTML Overlay Layer */}
            <Scroll html>
              <UI setActiveModal={setActiveModal} />
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>

      {/* Modal Overlay Rendered Outside Canvas for true fixed positioning */}
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
              
              {activeModal === 'diagnostic' ? (
                <QuizModal onClose={() => setActiveModal(null)} />
              ) : (
                <>
                  <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Student Profile</h2>
                  <p style={{ color: 'var(--secondary-text)', fontSize: '1.1rem' }}>
                    Student profile matching engine goes here.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
