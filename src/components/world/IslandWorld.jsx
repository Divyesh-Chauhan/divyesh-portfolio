import React, { useRef } from 'react'
import { RigidBody } from '@react-three/rapier'
import { Box, Sphere, Cylinder } from '@react-three/drei'
import { InteractiveZone } from './InteractiveZone'

export default function IslandWorld() {
    return (
        <group>
            {/* Ground */}
            <RigidBody type="fixed" colliders="hull" name="ground">
                <Box args={[100, 1, 100]} position={[0, -0.5, 0]}>
                    <meshStandardMaterial color="#3e2723" roughness={1} />
                </Box>
                <Box args={[90, 1, 90]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#6b4c3a" roughness={1} />
                </Box>
            </RigidBody>

            {/* Dock Area - Spawn */}
            <group position={[0, 0.5, 45]}>
                <RigidBody type="fixed">
                    <Box args={[10, 1, 15]}>
                        <meshStandardMaterial color="#5c4033" />
                    </Box>
                </RigidBody>
                {/* Spawn Zone Indicator */}
                <InteractiveZone id="dock" position={[0, 1, 0]} range={5} message="Press E near Dock" />
            </group>

            {/* Home Island (About Me) */}
            <group position={[-20, 0.5, 20]}>
                <RigidBody type="fixed">
                    <Cylinder args={[8, 10, 2, 32]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#2d4c1e" />
                    </Cylinder>
                </RigidBody>
                <InteractiveZone id="about" position={[0, 2, 0]} range={6} message="Press E to open About Me" />
            </group>

            {/* Devil Fruit Lab (Skills) */}
            <group position={[25, 0.5, 10]}>
                <RigidBody type="fixed">
                    <Box args={[12, 6, 12]} position={[0, 3, 0]}>
                        <meshStandardMaterial color="#1a1a24" />
                    </Box>
                </RigidBody>
                <InteractiveZone id="skills" position={[0, 2, -8]} range={7} message="Press E to view Skills Lab" />
            </group>

            {/* Bounty Board Town (Projects) */}
            <group position={[0, 0.5, -20]}>
                <RigidBody type="fixed">
                    <Box args={[15, 0.5, 15]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#7f6b5d" />
                    </Box>
                    <Box args={[4, 5, 1]} position={[0, 2.5, -5]}>
                        <meshStandardMaterial color="#4a3018" />
                    </Box>
                </RigidBody>
                <InteractiveZone id="projects" position={[0, 2, 0]} range={8} message="Press E to view Bounties (Projects)" />
            </group>

            {/* Marine HQ (Resume + Links) */}
            <group position={[-30, 0.5, -30]}>
                <RigidBody type="fixed">
                    <Box args={[16, 12, 10]} position={[0, 6, 0]}>
                        <meshStandardMaterial color="#f0f0f0" />
                    </Box>
                </RigidBody>
                <InteractiveZone id="marine" position={[0, 2, 8]} range={7} message="Press E to enter Marine HQ" />
            </group>

            {/* Den Den Mushi Station (Contact Form) */}
            <group position={[30, 0.5, -30]}>
                <RigidBody type="fixed">
                    <Cylinder args={[2, 2, 6, 16]} position={[0, 3, 0]}>
                        <meshStandardMaterial color="#c0392b" />
                    </Cylinder>
                </RigidBody>
                <InteractiveZone id="contact" position={[0, 2, 3]} range={5} message="Press E to use Den Den Mushi (Contact)" />
            </group>

            {/* Obstacles to make it interesting */}
            {Array.from({ length: 15 }).map((_, i) => (
                <RigidBody key={i} type="fixed" position={[Math.random() * 80 - 40, 1, Math.random() * 80 - 40]}>
                    <Box args={[2, 4, 2]}>
                        <meshStandardMaterial color="#3e2723" />
                    </Box>
                </RigidBody>
            ))}
        </group>
    )
}
