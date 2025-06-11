import React, { useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function UnityComponent({ puntaje, coches, max}) {
  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "unityf4/Build/unityf4.loader.js",
    dataUrl: "unityf4/Build/unityf4.data",
    frameworkUrl: "unityf4/Build/unityf4.framework.js",
    codeUrl: "unityf4/Build/unityf4.wasm",
  });

  useEffect(() => {
    if (isLoaded) {
      sendMessage("Visibilidad", "setContador", String(puntaje));
      sendMessage("Visibilidad", "setContadorCoche", String(coches));
      sendMessage("Visibilidad", "Max", String(max));
    }
  }, [puntaje, coches, max, isLoaded]);

  return (
    <div>
      <Unity unityProvider={unityProvider} style={{ width: 800, height: 600 }} />
    </div>
  );
}