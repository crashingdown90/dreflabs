'use client'

import { Canvas } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei'

export default function HeroScene() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <Sphere args={[1.5, 64, 64]} position={[2, 0, -2]}>
                        <MeshDistortMaterial
                            color="#C0C0C0"
                            attach="material"
                            distort={0.4}
                            speed={2}
                            roughness={0.2}
                            metalness={1}
                        />
                    </Sphere>
                </Float>

                <Float speed={1.5} rotationIntensity={1.5} floatIntensity={0.5}>
                    <Sphere args={[0.8, 32, 32]} position={[-2, 1, -1]}>
                        <MeshDistortMaterial
                            color="#A0A0A0"
                            attach="material"
                            distort={0.3}
                            speed={1.5}
                            roughness={0.1}
                            metalness={0.9}
                        />
                    </Sphere>
                </Float>

                <pointLight position={[-10, -10, -10]} intensity={0.5} />
            </Canvas>
        </div>
    )
}
