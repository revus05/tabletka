"use client"

import { useEffect, useRef, useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getYmaps = () => (window as any).ymaps as any

type Props = {
  address?: string
  defaultLat?: number | null
  defaultLng?: number | null
  onChange: (lat: number, lng: number) => void
}

export function PharmacyMapPicker({ address, defaultLat, defaultLng, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<object | null>(null)
  const placemarkRef = useRef<object | null>(null)
  const [coords, setCoords] = useState<[number, number] | null>(
    defaultLat && defaultLng ? [defaultLat, defaultLng] : null
  )
  const [geocoding, setGeocoding] = useState(false)

  useEffect(() => {
    function initMap() {
      getYmaps()?.ready(() => {
        if (!containerRef.current || mapRef.current) return
        const ymaps = getYmaps()

        const initialCenter: [number, number] = coords ?? [53.9, 27.5667]
        const initialZoom = coords ? 16 : 6

        const map = new ymaps.Map(containerRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          controls: ["zoomControl", "geolocationControl"],
        })
        mapRef.current = map

        if (coords) placeMark(coords)

        map.events.add("click", (e: { get: (key: string) => [number, number] }) => {
          const newCoords = e.get("coords")
          setCoords(newCoords)
          onChange(newCoords[0], newCoords[1])
          placeMark(newCoords)
        })
      })
    }

    function placeMark(c: [number, number]) {
      const map = mapRef.current
      if (!map) return
      const ymaps = getYmaps()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (placemarkRef.current) (map as any).geoObjects.remove(placemarkRef.current)
      const pm = new ymaps.Placemark(c, {}, { preset: "islands#greenMedicalIcon", draggable: true })
      pm.events?.add("dragend", () => {
        const c2: [number, number] = pm.geometry?.getCoordinates?.()
        if (c2) {
          setCoords(c2)
          onChange(c2[0], c2[1])
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(map as any).geoObjects.add(pm)
      placemarkRef.current = pm
    }

    if (!getYmaps()) {
      const script = document.createElement("script")
      script.src = "https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU"
      script.async = true
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleGeocode() {
    const ymaps = getYmaps()
    if (!address || !ymaps) return
    setGeocoding(true)
    try {
      const result = await ymaps.geocode(address)
      const first = result.geoObjects.get(0)
      if (first) {
        const c: [number, number] = first.geometry.getCoordinates()
        setCoords(c)
        onChange(c[0], c[1])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const map = mapRef.current as any
        map?.setCenter(c, 16)
        if (placemarkRef.current) map?.geoObjects.remove(placemarkRef.current)
        if (map) {
          const pm = new ymaps.Placemark(c, {}, { preset: "islands#greenMedicalIcon", draggable: true })
          map.geoObjects.add(pm)
          placemarkRef.current = pm
        }
      }
    } finally {
      setGeocoding(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-gray">
          {coords
            ? `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`
            : "Точка не задана — кликните на карте"}
        </span>
        {address && (
          <button
            type="button"
            onClick={handleGeocode}
            disabled={geocoding}
            className="text-[13px] text-brand hover:underline disabled:opacity-50"
          >
            {geocoding ? "Определяю..." : "Определить по адресу"}
          </button>
        )}
      </div>
      <div ref={containerRef} className="w-full h-[300px] rounded-[4px] overflow-hidden border border-gray-border" />
    </div>
  )
}
