import createGlobe from 'cobe'
import React from 'react'
import { useEffect, useRef } from 'react'
import { useSpring } from 'react-spring'

const locationToAngles = (lat, long) => {
  return [Math.PI - ((long * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180]
}

export const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointerInteracting = useRef(null)
  const pointerInteractionMovement = useRef(0)
  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }))
  useEffect(() => {
    let phi = 0
    let width = 0
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
    window.addEventListener('resize', onResize)
    onResize()
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 0,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [85 / 255, 150 / 255, 236 / 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: [
        { location: [35.6895, 139.6917], size: 37468000 / 100000000 }, // Tokyo
        { location: [28.6139, 77.209], size: 28514000 / 100000000 }, // Delhi
        { location: [31.2304, 121.4737], size: 25582000 / 100000000 }, // Shanghai
        { location: [-23.5505, -46.6333], size: 21650000 / 100000000 }, // São Paulo
        { location: [19.4326, -99.1332], size: 21581000 / 100000000 }, // Mexico City
        { location: [30.8025, 31.2357], size: 20076000 / 100000000 }, // Cairo
        { location: [19.076, 72.8777], size: 19980000 / 100000000 }, // Mumbai
        { location: [39.9042, 116.4074], size: 19618000 / 100000000 }, // Beijing
        { location: [23.8103, 90.4125], size: 19578000 / 100000000 }, // Dhaka
        { location: [34.6937, 135.5023], size: 19281000 / 100000000 }, // Osaka
        { location: [40.7128, -74.006], size: 18819000 / 100000000 }, // New York
        { location: [24.8607, 67.0011], size: 15400000 / 100000000 }, // Karachi
        { location: [-34.6037, -58.3816], size: 14967000 / 100000000 }, // Buenos Aires
        { location: [29.4316, 106.9123], size: 14838000 / 100000000 }, // Chongqing
        { location: [41.0082, 28.9784], size: 14751000 / 100000000 }, // Istanbul
        { location: [22.5726, 88.3639], size: 14681000 / 100000000 }, // Kolkata
        { location: [14.5995, 120.9842], size: 13482000 / 100000000 }, // Manila
        { location: [6.5244, 3.3792], size: 13463000 / 100000000 }, // Lagos
        { location: [-22.9068, -43.1729], size: 13293000 / 100000000 }, // Rio de Janeiro
        { location: [39.3434, 117.3616], size: 13215000 / 100000000 }, // Tianjin
        { location: [-4.4419, 15.2663], size: 13171000 / 100000000 }, // Kinshasa
        { location: [23.1291, 113.2644], size: 12638000 / 100000000 }, // Guangzhou
        { location: [34.0522, -118.2437], size: 12458000 / 100000000 }, // Los Angeles
        { location: [55.7558, 37.6173], size: 12410000 / 100000000 }, // Moscow
        { location: [22.5431, 114.0579], size: 11908000 / 100000000 }, // Shenzhen
        { location: [31.5497, 74.3436], size: 11738000 / 100000000 }, // Lahore
        { location: [12.9716, 77.5946], size: 11440000 / 100000000 }, // Bangalore
        { location: [48.8566, 2.3522], size: 10901000 / 100000000 }, // Paris
        { location: [4.71, -74.0721], size: 10574000 / 100000000 }, // Bogotá
        { location: [-6.1751, 106.865], size: 10517000 / 100000000 }, // Jakarta
        { location: [13.0827, 80.2707], size: 10456000 / 100000000 }, // Chennai
        { location: [-12.0464, -77.0428], size: 10391000 / 100000000 }, // Lima
        { location: [13.7563, 100.5018], size: 10156000 / 100000000 }, // Bangkok
        { location: [37.5665, 126.978], size: 9963000 / 100000000 }, // Seoul
        { location: [35.1815, 136.9066], size: 9507000 / 100000000 }, // Nagoya
        { location: [17.385, 78.4867], size: 9482000 / 100000000 }, // Hyderabad
        { location: [51.5074, -0.1278], size: 9046000 / 100000000 }, // London
        { location: [35.6892, 51.389], size: 8896000 / 100000000 }, // Tehran
        { location: [41.8781, -87.6298], size: 8864000 / 100000000 }, // Chicago
        { location: [30.5728, 104.0668], size: 8813000 / 100000000 }, // Chengdu
        { location: [32.0603, 118.7969], size: 8245000 / 100000000 }, // Nanjing
        { location: [30.5928, 114.3055], size: 8176000 / 100000000 }, // Wuhan
        { location: [10.8231, 106.6297], size: 8145000 / 100000000 }, // Ho Chi Minh City
        { location: [-8.839, 13.2894], size: 7774000 / 100000000 }, // Luanda
        { location: [23.0225, 72.5714], size: 7681000 / 100000000 }, // Ahmedabad
        { location: [3.139, 101.6869], size: 7564000 / 100000000 }, // Kuala Lumpur
        { location: [34.3416, 108.9398], size: 7444000 / 100000000 }, // Xi'an
        { location: [22.3193, 114.1694], size: 7429000 / 100000000 }, // Hong Kong
        { location: [23.0207, 113.7518], size: 7360000 / 100000000 }, // Dongguan
        { location: [30.2741, 120.1551], size: 7236000 / 100000000 }, // Hangzhou
        { location: [23.0215, 113.1214], size: 7236000 / 100000000 }, // Foshan
        { location: [41.8057, 123.4315], size: 6921000 / 100000000 }, // Shenyang
        { location: [24.7136, 46.6753], size: 6907000 / 100000000 }, // Riyadh
        { location: [33.3152, 44.3661], size: 6812000 / 100000000 }, // Baghdad
        { location: [-33.4489, -70.6693], size: 6680000 / 100000000 }, // Santiago
        { location: [21.1702, 72.8311], size: 6564000 / 100000000 }, // Surat
        { location: [40.4168, -3.7038], size: 6497000 / 100000000 }, // Madrid
        { location: [31.2989, 120.5853], size: 6339000 / 100000000 }, // Suzhou
        { location: [18.5204, 73.8567], size: 6276000 / 100000000 }, // Pune
        { location: [45.8038, 126.5349], size: 6115000 / 100000000 }, // Harbin
        { location: [29.7604, -95.3698], size: 6115000 / 100000000 }, // Houston
        { location: [32.7767, -96.797], size: 6099000 / 100000000 }, // Dallas
        { location: [43.6532, -79.3832], size: 6082000 / 100000000 }, // Toronto
        { location: [-6.7924, 39.2083], size: 6048000 / 100000000 }, // Dar es Salaam
      ],
      onRender: (state) => {
        // This prevents rotation while dragging
        if (!pointerInteracting.current) {
          // Called on every animation frame.
          // `state` will be an empty object, return updated params.
          phi += 0.002
        }
        state.phi = phi + r.get()
        state.width = width * 2
        state.height = width * 2
      },
    })
    setTimeout(() => (canvasRef.current.style.opacity = '1'))
    return () => globe.destroy()
  }, [])
  return (
    <div
      style={{
        aspectRatio: 1,
        margin: 'auto',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current
          canvasRef.current.style.cursor = 'grabbing'
        }}
        onPointerUp={() => {
          pointerInteracting.current = null
          canvasRef.current.style.cursor = 'grab'
        }}
        onPointerOut={() => {
          pointerInteracting.current = null
          canvasRef.current.style.cursor = 'grab'
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            api.start({
              r: delta / 200,
            })
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            api.start({
              r: delta / 100,
            })
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          contain: 'layout paint size',
          opacity: 0,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  )
}
