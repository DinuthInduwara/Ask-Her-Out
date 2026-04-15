import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Interactive Floating Background - Full-screen floating emojis that:
 * - Styled in monochrome/pastel pink to match aesthetic
 * - Float slowly with gentle sway
 * - Jump to new random position when clicked/tapped
 * - Have particle explosion effect on click
 * - Play sound effect on click
 * - Never overlap during initialization
 * - Use spring animation for smooth jumping
 * - Includes subtle sparkle particle effect for empty spots
 */
export function FloatingBackground() {
  // Emojis and icons to use
  const emojis = ["💖", "✨", "🌸", "🦋", "💕", "🌟", "🌺", "💗", "⭐", "🌷", "🎀", "💝", "🦋", "✨", "💫"];
  
  const [elements, setElements] = useState([]);
  const [particles, setParticles] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio on mount
  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playBoingSound = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };
    
    audioRef.current = { playBoingSound };
  }, []);

  // Generate sparkle particles for empty spots
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = [];
      const count = 30; // More sparkles for fuller effect
      
      for (let i = 0; i < count; i++) {
        newSparkles.push({
          id: `sparkle-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1, // 1-4px
          opacity: Math.random() * 0.5 + 0.2,
          duration: Math.random() * 3 + 2, // 2-5s
          delay: Math.random() * 5,
        });
      }
      
      setSparkles(newSparkles);
    };
    
    generateSparkles();
    
    // Regenerate sparkles periodically
    const interval = setInterval(() => {
      generateSparkles();
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate initial positions with overlap prevention
  useEffect(() => {
    const generateNonOverlappingPositions = () => {
      const newElements = [];
      const count = 18; // Slightly fewer for better spacing
      const minDistance = 15; // Increased minimum distance
      const padding = 8; // Increased padding from edges
      
      let attempts = 0;
      const maxAttempts = 1000;
      
      while (newElements.length < count && attempts < maxAttempts) {
        attempts++;
        
        const x = Math.random() * (100 - 2 * padding) + padding;
        const y = Math.random() * (100 - 2 * padding) + padding;
        
        const hasOverlap = newElements.some(el => {
          const dx = el.x - x;
          const dy = el.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < minDistance;
        });
        
        if (!hasOverlap) {
          newElements.push({
            id: newElements.length,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            x,
            y,
            size: Math.random() * 1.5 + 1.5,
            floatDuration: Math.random() * 15 + 20, // Slower: 20-35s
            floatDelay: Math.random() * 10,
            swayAmount: Math.random() * 30 + 15,
            rotation: Math.random() * 20 - 10,
            opacity: Math.random() * 0.3 + 0.3, // Lower opacity for subtlety
          });
        }
      }
      
      return newElements;
    };
    
    setElements(generateNonOverlappingPositions());
  }, []);

  // Handle emoji interaction
  const handleEmojiInteraction = useCallback((id, event) => {
    event.stopPropagation();
    event.preventDefault();
    
    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
    
    if (audioRef.current) {
      audioRef.current.playBoingSound();
    }
    
    // Create pastel pink particle explosion
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      x: clientX,
      y: clientY,
      angle: (i / 10) * 360 + Math.random() * 20,
      distance: Math.random() * 60 + 40,
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
    
    // Find new position
    setElements(prev => {
      const element = prev.find(el => el.id === id);
      if (!element) return prev;
      
      let newX, newY;
      let attempts = 0;
      const minDistance = 15;
      const padding = 8;
      
      do {
        newX = Math.random() * (100 - 2 * padding) + padding;
        newY = Math.random() * (100 - 2 * padding) + padding;
        attempts++;
        
        const hasOverlap = prev.some(el => {
          if (el.id === id) return false;
          const dx = el.x - newX;
          const dy = el.y - newY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < minDistance;
        });
        
        if (!hasOverlap) break;
      } while (attempts < 100);
      
      return prev.map(el => 
        el.id === id ? { ...el, x: newX, y: newY } : el
      );
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="floating-background-interactive"
      aria-hidden="true"
    >
      {/* Subtle Sparkle Effect */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <SparkleParticle key={sparkle.id} {...sparkle} />
        ))}
      </AnimatePresence>
      
      {/* Floating Emojis - Monochrome/Pastel Pink Styled */}
      <AnimatePresence>
        {elements.map((element) => (
          <FloatingEmoji
            key={element.id}
            element={element}
            onInteract={(e) => handleEmojiInteraction(element.id, e)}
          />
        ))}
      </AnimatePresence>
      
      {/* Particle Explosion Effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <ParticleExplosion key={particle.id} {...particle} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Subtle sparkle particle for empty spots - monochrome/pastel pink
 */
function SparkleParticle({ x, y, size, opacity, duration, delay }) {
  return (
    <motion.div
      className="sparkle-particle"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0,
        rotate: 0 
      }}
      animate={{ 
        opacity: [0, opacity, opacity, 0],
        scale: [0, 1, 1, 0],
        rotate: [0, 45, 90, 135],
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 2,
        ease: "easeInOut",
      }}
    />
  );
}

/**
 * Individual floating emoji - styled in monochrome/pastel pink
 */
function FloatingEmoji({ element, onInteract }) {
  const { emoji, x, y, size, floatDuration, floatDelay, swayAmount, rotation, opacity } = element;
  
  const floatVariants = {
    float: {
      y: [0, -20, 0, 20, 0],
      x: [0, swayAmount, 0, -swayAmount, 0],
      rotate: [0, rotation, 0, -rotation, 0],
      transition: {
        y: {
          duration: floatDuration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: floatDelay,
        },
        x: {
          duration: floatDuration * 0.7,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: floatDelay + 0.5,
        },
        rotate: {
          duration: floatDuration * 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: floatDelay + 0.3,
        },
      },
    },
  };
  
  return (
    <motion.div
      className="floating-emoji-interactive"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: `${size}rem`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity,
        x: 0,
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: floatDelay * 0.1,
      }}
      whileHover={{ 
        scale: 1.15,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.9,
        transition: { duration: 0.1 }
      }}
      onClick={onInteract}
      onTouchStart={onInteract}
      data-emoji-id={element.id}
    >
      <motion.span
        className="floating-emoji-content"
        variants={floatVariants}
        animate="float"
      >
        {emoji}
      </motion.span>
    </motion.div>
  );
}

/**
 * Particle explosion effect - pastel pink colored
 */
function ParticleExplosion({ x, y, angle, distance }) {
  const radians = (angle * Math.PI) / 180;
  const endX = Math.cos(radians) * distance;
  const endY = Math.sin(radians) * distance;
  
  return (
    <motion.div
      className="particle-pink"
      style={{
        left: x,
        top: y,
      }}
      initial={{ 
        scale: 1, 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      animate={{ 
        scale: 0, 
        opacity: 0, 
        x: endX, 
        y: endY 
      }}
      exit={{ opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.5,
      }}
    />
  );
}
