// src/HeartModel.js
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

function HeartModel(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/heart.gltf');

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.Heart.geometry}
        material={materials.Material}
        scale={props.scale}
        position={props.position}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload('/heart.gltf');

export default HeartModel;