export interface ParticleConfig {
  minSize: number;
  maxSize: number;
  minSpeed: number;
  maxSpeed: number;
  minOrbit: number;
  maxOrbit: number;
}

export interface Particle extends Vector {
  id: number;
  size: number;
  speed: number;
  orbit: number;
  offset: number;
  color: string;
}
export interface Point {
  x: number;
  y: number;
}

export interface Vector extends Point {
  dx: number;
  dy: number;
}

export class ParticleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParticleError';
  }
}
export interface ParticleBounds {
  width: number;
  height: number;
}
