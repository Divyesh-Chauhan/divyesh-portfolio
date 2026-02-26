import React, { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import useStore from '../../store/useStore'
import * as THREE from 'three'

export function InteractiveZone({ id, position, range = 5, message = "Interact" }) {
    const { camera } = useThree()
    const vec = new THREE.Vector3()
    const [inRange, setInRange] = useState(false)
    const zoneRef = useRef()
    const setActiveUI = useStore((state) => state.setActiveUI)
    const activeUI = useStore((state) => state.activeUI)
    const [cooldown, setCooldown] = useState(false)

    // Basic distance check from camera to zone
    useFrame(() => {
        if (zoneRef.current) {
            zoneRef.current.getWorldPosition(vec)
            const distance = camera.position.distanceTo(vec)
            const isNear = distance < range

            if (isNear !== inRange) {
                setInRange(isNear)
            }
        }
    })

    // Handle keypress interaction
    // We attach a listener for the keydown inside an effect, but since we have a global store and useKeyboardControls in Player,
    // we can also handle the interaction globally. For simplicity, we detect key down here if 'inRange'.
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.code === 'KeyE' || e.code === 'Enter') && inRange && !cooldown && !activeUI) {
                setActiveUI(id)
                setCooldown(true)
                setTimeout(() => setCooldown(false), 1000)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [inRange, cooldown, id, setActiveUI, activeUI])

    return (
        <group position={position} ref={zoneRef}>
            <mesh visible={false}>
                <sphereGeometry args={[range, 16, 16]} />
                <meshBasicMaterial color="red" wireframe />
            </mesh>

            {inRange && (
                <Float speed={2} rotationIntensity={0} floatIntensity={1}>
                    <Text
                        position={[0, 2, 0]}
                        fontSize={0.8}
                        color="#f4a261"
                        font="/fonts/CinzelDecorative.woff" // Optional: custom font if added to public
                        outlineWidth={0.05}
                        outlineColor="#000000"
                    >
                        {message}
                    </Text>
                </Float>
            )}
        </group>
    )
}
