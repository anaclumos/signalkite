import createGlobe from 'cobe'
import React from 'react'
import { useEffect, useRef } from 'react'
import { useSpring } from 'react-spring'

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
      diffuse: 2,
      mapSamples: 32000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [85 / 255, 150 / 255, 236 / 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: [
        { location: [35.6895, 139.6917], size: Math.log(37468000) / 300 }, // Tokyo
        { location: [28.6139, 77.209], size: Math.log(28514000) / 300 }, // Delhi
        { location: [31.2304, 121.4737], size: Math.log(25582000) / 300 }, // Shanghai
        { location: [-23.5505, -46.6333], size: Math.log(21650000) / 300 }, // São Paulo
        { location: [19.4326, -99.1332], size: Math.log(21581000) / 300 }, // Mexico City
        { location: [30.8025, 31.2357], size: Math.log(20076000) / 300 }, // Cairo
        { location: [19.076, 72.8777], size: Math.log(19980000) / 300 }, // Mumbai
        { location: [39.9042, 116.4074], size: Math.log(19618000) / 300 }, // Beijing
        { location: [23.8103, 90.4125], size: Math.log(19578000) / 300 }, // Dhaka
        { location: [34.6937, 135.5023], size: Math.log(19281000) / 300 }, // Osaka
        { location: [40.7128, -74.006], size: Math.log(18819000) / 300 }, // New York
        { location: [24.8607, 67.0011], size: Math.log(15400000) / 300 }, // Karachi
        { location: [-34.6037, -58.3816], size: Math.log(14967000) / 300 }, // Buenos Aires
        { location: [29.4316, 106.9123], size: Math.log(14838000) / 300 }, // Chongqing
        { location: [41.0082, 28.9784], size: Math.log(14751000) / 300 }, // Istanbul
        { location: [22.5726, 88.3639], size: Math.log(14681000) / 300 }, // Kolkata
        { location: [14.5995, 120.9842], size: Math.log(13482000) / 300 }, // Manila
        { location: [6.5244, 3.3792], size: Math.log(13463000) / 300 }, // Lagos
        { location: [-22.9068, -43.1729], size: Math.log(13293000) / 300 }, // Rio de Janeiro
        { location: [39.3434, 117.3616], size: Math.log(13215000) / 300 }, // Tianjin
        { location: [-4.4419, 15.2663], size: Math.log(13171000) / 300 }, // Kinshasa
        { location: [23.1291, 113.2644], size: Math.log(12638000) / 300 }, // Guangzhou
        { location: [34.0522, -118.2437], size: Math.log(12458000) / 300 }, // Los Angeles
        { location: [55.7558, 37.6173], size: Math.log(12410000) / 300 }, // Moscow
        { location: [22.5431, 114.0579], size: Math.log(11908000) / 300 }, // Shenzhen
        { location: [31.5497, 74.3436], size: Math.log(11738000) / 300 }, // Lahore
        { location: [12.9716, 77.5946], size: Math.log(11440000) / 300 }, // Bangalore
        { location: [48.8566, 2.3522], size: Math.log(10901000) / 300 }, // Paris
        { location: [4.71, -74.0721], size: Math.log(10574000) / 300 }, // Bogotá
        { location: [-6.1751, 106.865], size: Math.log(10517000) / 300 }, // Jakarta
        { location: [13.0827, 80.2707], size: Math.log(10456000) / 300 }, // Chennai
        { location: [-12.0464, -77.0428], size: Math.log(10391000) / 300 }, // Lima
        { location: [13.7563, 100.5018], size: Math.log(10156000) / 300 }, // Bangkok
        { location: [37.5665, 126.978], size: Math.log(9963000) / 300 }, // Seoul
        { location: [35.1815, 136.9066], size: Math.log(9507000) / 300 }, // Nagoya
        { location: [17.385, 78.4867], size: Math.log(9482000) / 300 }, // Hyderabad
        { location: [51.5074, -0.1278], size: Math.log(9046000) / 300 }, // London
        { location: [35.6892, 51.389], size: Math.log(8896000) / 300 }, // Tehran
        { location: [41.8781, -87.6298], size: Math.log(8864000) / 300 }, // Chicago
        { location: [30.5728, 104.0668], size: Math.log(8813000) / 300 }, // Chengdu
        { location: [32.0603, 118.7969], size: Math.log(8245000) / 300 }, // Nanjing
        { location: [30.5928, 114.3055], size: Math.log(8176000) / 300 }, // Wuhan
        { location: [10.8231, 106.6297], size: Math.log(8145000) / 300 }, // Ho Chi Minh City
        { location: [-8.839, 13.2894], size: Math.log(7774000) / 300 }, // Luanda
        { location: [23.0225, 72.5714], size: Math.log(7681000) / 300 }, // Ahmedabad
        { location: [3.139, 101.6869], size: Math.log(7564000) / 300 }, // Kuala Lumpur
        { location: [34.3416, 108.9398], size: Math.log(7444000) / 300 }, // Xi'an
        { location: [22.3193, 114.1694], size: Math.log(7429000) / 300 }, // Hong Kong
        { location: [23.0207, 113.7518], size: Math.log(7360000) / 300 }, // Dongguan
        { location: [30.2741, 120.1551], size: Math.log(7236000) / 300 }, // Hangzhou
        { location: [23.0215, 113.1214], size: Math.log(7236000) / 300 }, // Foshan
        { location: [41.8057, 123.4315], size: Math.log(6921000) / 300 }, // Shenyang
        { location: [24.7136, 46.6753], size: Math.log(6907000) / 300 }, // Riyadh
        { location: [33.3152, 44.3661], size: Math.log(6812000) / 300 }, // Baghdad
        { location: [-33.4489, -70.6693], size: Math.log(6680000) / 300 }, // Santiago
        { location: [21.1702, 72.8311], size: Math.log(6564000) / 300 }, // Surat
        { location: [40.4168, -3.7038], size: Math.log(6497000) / 300 }, // Madrid
        { location: [31.2989, 120.5853], size: Math.log(6339000) / 300 }, // Suzhou
        { location: [18.5204, 73.8567], size: Math.log(6276000) / 300 }, // Pune
        { location: [45.8038, 126.5349], size: Math.log(6115000) / 300 }, // Harbin
        { location: [29.7604, -95.3698], size: Math.log(6115000) / 300 }, // Houston
        { location: [32.7767, -96.797], size: Math.log(6099000) / 300 }, // Dallas
        { location: [43.6532, -79.3832], size: Math.log(6082000) / 300 }, // Toronto
        { location: [-6.7924, 39.2083], size: Math.log(6048000) / 300 }, // Dar es Salaam
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
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
              r: delta / 3000,
            })
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            api.start({
              r: delta / 300,
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
