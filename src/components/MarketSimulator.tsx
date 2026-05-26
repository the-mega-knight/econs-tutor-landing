import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

type Elasticity = 'inelastic' | 'standard' | 'elastic';

const getSlope = (e: Elasticity) => {
  if (e === 'inelastic') return 2;
  if (e === 'elastic') return 0.5;
  return 1;
};

export default function MarketSimulator() {
  const [dShift, setDShift] = useState(0);
  const [sShift, setSShift] = useState(0);
  const [dElast, setDElast] = useState<Elasticity>('standard');
  const [sElast, setSElast] = useState<Elasticity>('standard');

  const { dPath, sPath, eqX, eqY, evaluation } = useMemo(() => {
    const dSlope = getSlope(dElast);
    const sSlope = getSlope(sElast);

    // Calculate Intercepts ensuring (50, 50) is default intersection
    const dInterceptBase = 50 + dSlope * 50;
    const sInterceptBase = 50 - sSlope * 50;

    // Apply shifts. D-shift adds to intercept. S-shift (rightward) subtracts from intercept proportional to slope.
    const dIntercept = dInterceptBase + dShift;
    const sIntercept = sInterceptBase - sSlope * sShift;

    // Equilibrium Q and P
    const qEq = (dIntercept - sIntercept) / (dSlope + sSlope);
    const pEq = sIntercept + sSlope * qEq;

    // SVG coordinate mapping (Y is inverted)
    const svgY = (y: number) => 100 - y;
    const svgX = (x: number) => x;

    // Demand Path Points (Q=0 to Q=100)
    const dY0 = dIntercept;
    const dY100 = dIntercept - dSlope * 100;
    const dPath = `M 0 ${svgY(dY0)} L 100 ${svgY(dY100)}`;

    // Supply Path Points (Q=0 to Q=100)
    const sY0 = sIntercept;
    const sY100 = sIntercept + sSlope * 100;
    const sPath = `M 0 ${svgY(sY0)} L 100 ${svgY(sY100)}`;

    // Generate Dynamic Evaluation Text
    let evalText = "Market is in equilibrium.";
    const dRight = dShift > 5;
    const dLeft = dShift < -5;
    const sRight = sShift > 5;
    const sLeft = sShift < -5;

    if (dRight && !sRight && !sLeft) evalText = "Demand shifts outward. Consumers bid up prices as scarcity emerges, resulting in a definitive expansion in both Price and Quantity traded.";
    else if (dLeft && !sRight && !sLeft) evalText = "Demand contracts. Sellers must discount to clear excess inventory, causing an unambiguous drop in both Price and Quantity.";
    else if (sRight && !dRight && !dLeft) evalText = "Supply shifts outward. A surplus emerges at the original price, forcing an unambiguous drop in Price while Quantity expands.";
    else if (sLeft && !dRight && !dLeft) evalText = "Supply contracts. Cost-push pressures force sellers to raise prices. Quantity contracts while Price unambiguously surges.";
    
    // Simultaneous
    else if (dRight && sRight) evalText = "Simultaneous Shift: Both forces definitively expand Quantity. However, opposing pressures on Price render the final price impact strictly indeterminate without exact magnitude data.";
    else if (dLeft && sLeft) evalText = "Simultaneous Shift: Both forces definitively contract Quantity. Opposing pressures on Price render the final price impact indeterminate.";
    else if (dRight && sLeft) evalText = "Simultaneous Shift: Both forces exert immense upward pressure on Price, guaranteeing a surge. However, opposing quantity pressures render the final output indeterminate.";
    else if (dLeft && sRight) evalText = "Simultaneous Shift: Both forces drive Price downwards definitively. However, opposing forces on quantity render the final market output indeterminate.";

    return {
      dPath,
      sPath,
      eqX: svgX(qEq),
      eqY: svgY(pEq),
      evaluation: evalText
    };
  }, [dShift, sShift, dElast, sElast]);

  return (
    <div className="simulator-card" style={{ 
      background: 'rgba(255, 255, 255, 0.65)', 
      backdropFilter: 'blur(16px)', 
      WebkitBackdropFilter: 'blur(16px)', 
      borderRadius: '24px', 
      padding: '3rem', 
      border: '1px solid rgba(255,255,255,0.4)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      pointerEvents: 'auto'
    }}>
      <h3 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', letterSpacing: '-0.03em' }}>The ezA Market Simulator</h3>
      
      {/* SVG Canvas */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#f5f5f7', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none">
          {/* Axes */}
          <line x1="0" y1="100" x2="100" y2="100" stroke="#d2d2d7" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2="100" stroke="#d2d2d7" strokeWidth="1" />
          
          {/* Demand Curve */}
          <motion.path 
            d={dPath} 
            stroke="#0066cc" 
            strokeWidth="1.5" 
            fill="none"
            initial={false}
            animate={{ d: dPath }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
          />
          {/* Supply Curve */}
          <motion.path 
            d={sPath} 
            stroke="#ff3b30" 
            strokeWidth="1.5" 
            fill="none"
            initial={false}
            animate={{ d: sPath }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
          />

          {/* Equilibrium Dashed Lines */}
          <motion.line
            x1={0} y1={eqY} x2={eqX} y2={eqY}
            stroke="#86868b" strokeWidth="0.5" strokeDasharray="2"
            animate={{ x2: eqX, y1: eqY, y2: eqY }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
          />
          <motion.line
            x1={eqX} y1={100} x2={eqX} y2={eqY}
            stroke="#86868b" strokeWidth="0.5" strokeDasharray="2"
            animate={{ x1: eqX, x2: eqX, y2: eqY }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
          />
          
          {/* Intersection Dot */}
          <motion.circle 
            cx={eqX} cy={eqY} r="1.5" fill="#1d1d1f"
            animate={{ cx: eqX, cy: eqY }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
          />
        </svg>
      </div>

      {/* Evaluation Text Engine */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
        <p style={{ fontWeight: 600, color: '#1d1d1f', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Examiner Evaluation</p>
        <p style={{ fontSize: '1.1rem', color: 'var(--secondary-text)', lineHeight: 1.5 }}>{evaluation}</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Demand Controls */}
        <div style={{ background: '#f5f5f7', padding: '1.5rem', borderRadius: '16px' }}>
          <h4 style={{ color: '#0066cc', marginBottom: '1rem', fontWeight: 600 }}>Demand Controls</h4>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--secondary-text)' }}>
              <span>Shift</span> <span>{dShift > 0 ? '+' : ''}{dShift}</span>
            </label>
            <input 
              type="range" min="-40" max="40" value={dShift} 
              onChange={(e) => setDShift(Number(e.target.value))}
              className="apple-slider"
            />
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--secondary-text)' }}>Elasticity (PED)</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['inelastic', 'standard', 'elastic'].map(e => (
                <button 
                  key={e}
                  onClick={() => setDElast(e as Elasticity)}
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', fontSize: '0.8rem', cursor: 'pointer',
                    background: dElast === e ? '#0066cc' : '#e8e8ed',
                    color: dElast === e ? '#fff' : '#1d1d1f',
                    transition: 'all 0.2s'
                  }}
                >
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Supply Controls */}
        <div style={{ background: '#f5f5f7', padding: '1.5rem', borderRadius: '16px' }}>
          <h4 style={{ color: '#ff3b30', marginBottom: '1rem', fontWeight: 600 }}>Supply Controls</h4>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--secondary-text)' }}>
              <span>Shift</span> <span>{sShift > 0 ? '+' : ''}{sShift}</span>
            </label>
            <input 
              type="range" min="-40" max="40" value={sShift} 
              onChange={(e) => setSShift(Number(e.target.value))}
              className="apple-slider"
            />
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--secondary-text)' }}>Elasticity (PES)</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['inelastic', 'standard', 'elastic'].map(e => (
                <button 
                  key={e}
                  onClick={() => setSElast(e as Elasticity)}
                  style={{
                    flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', fontSize: '0.8rem', cursor: 'pointer',
                    background: sElast === e ? '#ff3b30' : '#e8e8ed',
                    color: sElast === e ? '#fff' : '#1d1d1f',
                    transition: 'all 0.2s'
                  }}
                >
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
