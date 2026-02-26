import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Ocean() {
    const ref = useRef()

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x = -Math.PI / 2
            // Simple wave animation
            ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2 - 1.5
        }
    })

    return (
        <mesh ref={ref} receiveShadow position={[0, -1.5, 0]}>
            <planeGeometry args={[1000, 1000, 32, 32]} />
            <meshStandardMaterial
                color="#457b9d"
                roughness={0.1}
                metalness={0.8}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}
