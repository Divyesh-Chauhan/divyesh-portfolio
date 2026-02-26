import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import * as THREE from 'three'
import useStore from '../../store/useStore'

const SPEED = 10
const JUMP_FORCE = 8

export default function Player() {
    const [, get] = useKeyboardControls()
    const rigidBody = useRef()
    const { camera } = useThree()

    const [joystickDir, setJoystickDir] = useState({ x: 0, y: 0 })
    const activeUI = useStore(state => state.activeUI)

    // Listen for custom joystick event
    useEffect(() => {
        const handleJoystick = (e) => {
            setJoystickDir(e.detail)
        }
        window.addEventListener('joystickMove', handleJoystick)
        return () => window.removeEventListener('joystickMove', handleJoystick)
    }, [])

    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3()
    const sideVector = new THREE.Vector3()

    const speed = new THREE.Vector3()

    useFrame((state, delta) => {
        if (!rigidBody.current || activeUI) return

        const { forward, backward, left, right, jump } = get()

        // Joystick handling
        let inputY = forward ? -1 : backward ? 1 : joystickDir.y
        let inputX = left ? -1 : right ? 1 : joystickDir.x

        // Normalize if needed
        if (inputY !== 0 || inputX !== 0) {
            const length = Math.sqrt(inputX * inputX + inputY * inputY)
            if (length > 1) {
                inputX /= length
                inputY /= length
            }
        }

        frontVector.set(0, 0, inputY)
        sideVector.set(inputX, 0, 0)

        // Direction calculation
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(SPEED)
            .applyEuler(camera.rotation)

        // Handle RigidBody movement
        const linvel = rigidBody.current.linvel()

        // Applying movement
        rigidBody.current.setLinvel({ x: direction.x, y: linvel.y, z: direction.z })

        // Jump
        const worldPosition = rigidBody.current.translation()
        // Simple ground detection (only jump if close to y=1)
        if (jump && worldPosition.y < 2) {
            rigidBody.current.setLinvel({ x: linvel.x, y: JUMP_FORCE, z: linvel.z })
        }

        // Camera follow (First Person / Third Person hybrid)
        camera.position.set(worldPosition.x, worldPosition.y + 3, worldPosition.z + 8)
        // Smooth look at
        const target = new THREE.Vector3(worldPosition.x, worldPosition.y + 1, worldPosition.z)
        camera.lookAt(target)
    })

    return (
        <RigidBody
            ref={rigidBody}
            colliders={false}
            mass={1}
            type="dynamic"
            position={[0, 5, 45]}
            enabledRotations={[false, false, false]}
        >
            <CapsuleCollider args={[0.75, 0.5]} />
            {/* Player character visual */}
            <mesh castShadow position={[0, -0.4, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 1.5, 16]} />
                <meshStandardMaterial color="#e63946" />
            </mesh>
            {/* Head */}
            <mesh castShadow position={[0, 0.6, 0]}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial color="#f4a261" />
            </mesh>
        </RigidBody>
    )
}
