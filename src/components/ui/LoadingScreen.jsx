import React from 'react'
import { useProgress } from '@react-three/drei'

export default function LoadingScreen() {
  const { progress } = useProgress()
  
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-pirate-bg text-pirate-gold font-pirate">
      <div className="text-4xl mb-4 animate-pulse pt-8 text-center">
        Setting Sail to the Grand Line...
      </div>
      <div className="w-64 border-2 border-pirate-wood p-1">
        <div 
          className="h-4 bg-pirate-primary transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 text-pirate-paper">{Math.round(progress)}%</div>
    </div>
  )
}
