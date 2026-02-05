/**
 * Purpose: Wrapper component that provides camera-based zoom transition animations.
 * Owns: Scale transforms, fade effects, and transition timing per MC-COCKPIT-ZOOM-SPEC-v1 section 5.2/5.5.
 * Notes: Implements INV-CONT-001 through INV-CONT-004 (visual continuity invariants).
 *        Transition duration: 300ms ease-out for zoom-in, ease-in for zoom-out.
 *        Uses CSS transforms for smooth 60fps animations.
 */

import { useEffect, useState, type ReactNode } from 'react';
import { useZoom } from './ZoomContext';

interface Props {
  children: ReactNode;
}

export function ZoomTransition({ children }: Props) {
  const { state, completeTransition } = useZoom();
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'animating' | 'revealing'>('idle');

  useEffect(() => {
    if (state.isTransitioning) {
      // Start animation phase
      setAnimationPhase('animating');

      // After animation duration, switch to reveal phase
      const animationTimer = setTimeout(() => {
        setAnimationPhase('revealing');
      }, 300); // 300ms zoom animation

      // After reveal, complete transition
      const revealTimer = setTimeout(() => {
        setAnimationPhase('idle');
        completeTransition();
      }, 450); // 300ms zoom + 150ms reveal

      return () => {
        clearTimeout(animationTimer);
        clearTimeout(revealTimer);
      };
    }
  }, [state.isTransitioning, completeTransition]);

  // Calculate transform based on transition direction and phase
  const getTransformStyle = () => {
    if (!state.isTransitioning && animationPhase === 'idle') {
      return {
        transform: 'scale(1)',
        opacity: 1,
      };
    }

    if (state.transitionDirection === 'in') {
      // Zoom in: content scales up slightly then settles
      if (animationPhase === 'animating') {
        return {
          transform: 'scale(0.95)',
          opacity: 0.8,
        };
      }
      return {
        transform: 'scale(1)',
        opacity: 1,
      };
    }

    if (state.transitionDirection === 'out') {
      // Zoom out: content scales down slightly then settles
      if (animationPhase === 'animating') {
        return {
          transform: 'scale(1.05)',
          opacity: 0.8,
        };
      }
      return {
        transform: 'scale(1)',
        opacity: 1,
      };
    }

    return {
      transform: 'scale(1)',
      opacity: 1,
    };
  };

  const transformStyle = getTransformStyle();

  return (
    <div
      style={{
        transform: transformStyle.transform,
        opacity: transformStyle.opacity,
        transformOrigin: 'center center',
        transition: state.isTransitioning
          ? `transform 300ms ${state.transitionDirection === 'in' ? 'ease-out' : 'ease-in'}, opacity 300ms ease`
          : 'none',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Hook to check if the view should show its content (after zoom animation completes).
 * Per INV-CONT-003, detail content reveals AFTER zoom motion completes.
 */
export function useDetailReveal(): boolean {
  const { state } = useZoom();
  const [isRevealed, setIsRevealed] = useState(true);

  useEffect(() => {
    if (state.isTransitioning) {
      setIsRevealed(false);
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, 350); // Reveal after zoom animation
      return () => clearTimeout(timer);
    }
  }, [state.isTransitioning]);

  return isRevealed;
}
