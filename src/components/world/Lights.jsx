import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Lights() {
    const dirLightRef = useRef()

    useFrame((state) => {
        // Optional: make sun rotate for day/night
        // const t = state.clock.elapsedTime
        // dirLightRef.current.position.x = Math.sin(t * 0.1) * 100
        // dirLightRef.current.position.y = Math.cos(t * 0.1) * 100
    })

    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight
                ref={dirLightRef}
                castShadow
                position={[100, 100, 50]}
                intensity={1.5}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={200}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
                color="#ffecd2"
            />
        </>
    )
}
