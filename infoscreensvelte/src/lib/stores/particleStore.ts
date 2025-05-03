// src/lib/stores/particleStore.ts
import {writable, type Writable} from 'svelte/store';
import type {Particle, ParticleBounds} from '../../types/particles.js';
import {ParticleError} from '../../types/particles.js';

/**
 * Validates particle position and velocity
 */
const isValidParticle = (particle: Partial<Particle>): boolean =>
  particle?.x !== undefined &&
  particle?.y !== undefined &&
  particle?.dx !== undefined &&
  particle?.dy !== undefined &&
  particle?.color !== undefined &&
  typeof particle.x === 'number' &&
  typeof particle.y === 'number' &&
  typeof particle.dx === 'number' &&
  typeof particle.dy === 'number' &&
  typeof particle.color === 'string';

/**
 * Creates a new particle with random position and velocity
 */
const createParticle = (bounds: ParticleBounds, color: string): Particle => {
  const particle = {
    id: crypto.randomUUID(),
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
    dx: (Math.random() - 0.5) * 4,
    dy: (Math.random() - 0.5) * 4,
    color
  };

  if (!isValidParticle(particle)) {
    throw new ParticleError('Invalid particle created');
  }

  return particle;
};

/**
 * Creates a particle store with initialization and update methods
 */
const createParticleStore = () => {
  const store: Writable<Particle[]> = writable<Particle[]>([]);
  let frameId: number | null = null;

  const colors = [
    'rgba(255, 80, 0, 0.6)', // metropoliaMainOrange
    // 'rgba(229, 75, 0, 0.6)', // metropoliaSecondaryOrange
    // 'rgba(227, 132, 196, 0.6)', // metropoliaTrendPink
    'rgba(93, 177, 228, 0.6)', // metropoliaTrendLightBlue
    'rgba(59, 168, 143, 0.6)' // metropoliaTrendGreen
  ];

  /**
   * Initializes particles within container bounds
   */
  const initializeParticles = (container: HTMLElement): void => {
    try {
      if (!container) throw new ParticleError('Invalid container element');
      const bounds = container.getBoundingClientRect();
      const particles = colors.map((color) => createParticle(bounds, color));
      store.set(particles);
    } catch (error) {
      console.error(
        'Error initializing particles:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      store.set([]);
    }
  };

  /**
   * Updates particle positions with bounds checking
   */
  const updateParticles = (container: HTMLElement): void => {
    store.update((particles) => {
      try {
        if (!container) throw new ParticleError('Invalid container element');
        const bounds = container.getBoundingClientRect();

        return particles.map((p): Particle => {
          const newX = p.x + p.dx * 2;
          const newY = p.y + p.dy * 2;

          // Bounce off edges with boundary validation
          const dx = newX <= 0 || newX >= bounds.width - 100 ? -p.dx : p.dx;
          const dy = newY <= 0 || newY >= bounds.height - 100 ? -p.dy : p.dy;

          const updatedParticle = {
            ...p,
            x: Math.max(0, Math.min(newX, bounds.width - 100)),
            y: Math.max(0, Math.min(newY, bounds.height - 100)),
            dx,
            dy
          };

          if (!isValidParticle(updatedParticle)) {
            throw new ParticleError(
              `Invalid particle update: ${JSON.stringify(updatedParticle)}`
            );
          }

          return updatedParticle;
        });
      } catch (error) {
        console.error(
          'Error updating particles:',
          error instanceof Error ? error.message : 'Unknown error'
        );
        return particles; // Return unchanged particles on error
      }
    });
  };

  /**
   * Starts animation loop
   */
  const startAnimation = (container: HTMLElement): void => {
    const animate = () => {
      updateParticles(container);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
  };

  /**
   * Stops animation loop
   */
  const stopAnimation = (): void => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  };

  return {
    subscribe: store.subscribe,
    initializeParticles,
    updateParticles,
    startAnimation,
    stopAnimation
  };
};

export const particleStore = createParticleStore();
