import React, { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { KeyboardControls, Sky, Environment, BakeShadows } from '@react-three/drei'
import IslandWorld from '../components/world/IslandWorld'
import Player from '../components/world/Player'
import Ocean from '../components/world/Ocean'
import OverlayUI from '../components/ui/OverlayUI'
import MobileControls from '../components/ui/MobileControls'
import useStore from '../store/useStore'
import LoadingScreen from '../components/ui/LoadingScreen'
import Lights from '../components/world/Lights'

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'interact', keys: ['KeyE', 'Enter'] }
]

export default function GamePage() {
  const [started, setStarted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!started) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-pirate-bg bg-opacity-90 relative">
        <div className="absolute inset-0 z-0 bg-black opacity-50"></div>
        <div className="z-10 text-center text-white glass-panel p-12 rounded-lg border-2 border-pirate-gold max-w-2xl mx-auto">
          <h1 className="text-6xl font-pirate text-pirate-primary mb-4 shadow-black drop-shadow-lg">
            Divyesh Chauhan
          </h1>
          <h2 className="text-2xl font-body text-pirate-gold mb-8">
            Full Stack Developer | MERN Developer
          </h2>
          <p className="mb-8 font-body text-gray-300">
            Welcome to my Grand Line portfolio. <br />
            Explore the island, discover my skills, and uncover projects.
          </p>
          <div className="mb-8 grid grid-cols-2 gap-4 text-sm text-gray-400">
            <div className="bg-white/5 p-4 rounded text-left">
              <strong className="text-pirate-gold block mb-2 font-pirate">Desktop Controls:</strong>
              WASD or Arrows - Move<br />
              Mouse drag - Look around<br />
              E / Enter - Interact
            </div>
            <div className="bg-white/5 p-4 rounded text-left">
              <strong className="text-pirate-gold block mb-2 font-pirate">Mobile Controls:</strong>
              On-screen Joystick - Move<br />
              Swipe - Look around<br />
              Tap buttons - Interact
            </div>
          </div>
          <button 
            onClick={() => setStarted(true)}
            className="px-8 py-4 bg-pirate-primary hover:bg-pirate-secondary text-white font-pirate text-xl rounded transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(230,57,70,0.5)] border border-pirate-gold"
          >
            Enter World
          </button>
        </div>
      </div>
    )
  }

  return (
    <KeyboardControls map={keyboardMap}>
      <div className="w-full h-screen relative">
        <Canvas shadows camera={{ fov: 45 }}>
          <Suspense fallback={null}>
            <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
            <Lights />
            <Environment preset="sunset" />
            <Physics gravity={[0, -9.81, 0]}>
              <IslandWorld />
              <Player />
            </Physics>
            <Ocean />
            <BakeShadows />
          </Suspense>
        </Canvas>
        <OverlayUI />
        {isMobile && <MobileControls />}
      </div>
    </KeyboardControls>
  )
}
