// src/components/ModelViewer.jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={0.5} />
}

export default function ModelViewer({ url }) {
  if (!url) return null

  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <Model url={url} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}