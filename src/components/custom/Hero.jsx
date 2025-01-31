import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

const Earth = () => {
  const texture = useMemo(() => new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'), []);

  // Continent positions (lat, long)


  return (
    <mesh rotation={[0, 0, 0.3]}>
      <sphereGeometry args={[5, 64, 64]} />
      <meshPhongMaterial
        map={texture}
        transparent
        opacity={0.9}
        roughness={0.5}
        metalness={0.5}
      />
      
    </mesh>
  );
};

const EarthScene = () => {
  return (
    <div style={{ height: '100vh', background: 'linear-gradient(to bottom, #000428, #004e92)' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Earth />
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.5}
        />
        <Stars radius={300} depth={60} count={2000} factor={7} />
      </Canvas>
      
      {/* Overlay Content */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        padding: '2rem',
        color: 'white',
        pointerEvents: 'none'
      }}>
        
        
        <div style={{ 
          textAlign: 'center',
          marginTop: '15vh'
        }}>
          <h1 style={{ 
            fontSize: '4rem',
            background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 1rem 0'
          }}>
            Discover Your Next Adventure with AI
          </h1>
          <p style={{ 
            fontSize: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: '1.5'
          }}>
            Your personal trip planner and travel curator, creating<br />
            Custom itineraries tailored to your interests and budget.
          </p>
          <Link to={'/create-trip'}>
          <button style={{
            pointerEvents: 'auto',
            background: '#ff4081',
            color: 'white',
            border: 'none',
            padding: '1.2rem 3rem',
            borderRadius: '40px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Get Started For Free
          </button>
          </Link>
        </div>
      </div>
      
      <style>{`
        .continent-label {
          color: white;
          background: rgba(0,0,0,0.7);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          white-space: nowrap;
          transform: translateX(-50%);
        }
      `}</style>
    </div>
  );
};

export default EarthScene;