"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    ymaps?: {
      ready: (cb: () => void) => void
      Map: new (el: HTMLElement, opts: Record<string, unknown>) => YMap
      Placemark: new (coords: [number, number], props: Record<string, unknown>, opts?: Record<string, unknown>) => YPlacemark
      geocode: (q: string) => Promise<{ geoObjects: { get: (i: number) => { geometry: { getCoordinates: () => [number, number] } } | null } }>
    }
  }
}
type YMap = {
  geoObjects: { add: (p: YPlacemark) => void; remove: (p: YPlacemark) => void }
  events: { add: (event: string, cb: (e: { get: (key: string) => [number, number] }) => void) => void }
  setCenter: (c: [number, number], z?: number) => void
}
type YPlacemark = object

type Props = {
  address?: string
  defaultLat?: number | null
  defaultLng?: number | null
  onChange: (lat: number, lng: number) => void
}

export function PharmacyMapPicker({ address, defaultLat, defaultLng, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<YMap | null>(null)
  const placemarkRef = useRef<YPlacemark | null>(null)
  const [coords, setCoords] = useState<[number, number] | null>(
    defaultLat && defaultLng ? [defaultLat, defaultLng] : null
  )
  const [geocoding, setGeocoding] = useState(false)

  useEffect(() => {
    function initMap() {
      window.ymaps!.ready(() => {
        if (!containerRef.current || mapRef.current) return

        const initialCenter: [number, number] = coords ?? [53.9, 27.5667]
        const initialZoom = coords ? 16 : 6

        const map = new window.ymaps!.Map(containerRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          controls: ["zoomControl", "geolocationControl"],
        })
        mapRef.current = map

        if (coords) {
          placeMark(coords)
        }

        map.events.add("click", (e) => {
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
      if (placemarkRef.current) map.geoObjects.remove(placemarkRef.current)
      const pm = new window.ymaps!.Placemark(c, {}, { preset: "islands#greenMedicalIcon", draggable: true })
      // @ts-expect-error - ymaps types
      pm.events?.add("dragend", (dragEvent) => {
        // @ts-expect-error - ymaps types
        const c2: [number, number] = dragEvent.get?.("target")?.geometry?.getCoordinates?.()
          // @ts-expect-error - ymaps types
          ?? pm.geometry?.getCoordinates?.()
        if (c2) {
          setCoords(c2)
          onChange(c2[0], c2[1])
        }
      })
      map.geoObjects.add(pm)
      placemarkRef.current = pm
    }

    if (!window.ymaps) {
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
    if (!address || !window.ymaps) return
    setGeocoding(true)
    try {
      const result = await window.ymaps.geocode(address)
      const first = result.geoObjects.get(0)
      if (first) {
        const c = first.geometry.getCoordinates()
        setCoords(c)
        onChange(c[0], c[1])
        mapRef.current?.setCenter(c, 16)
        // trigger placemark via re-click emulation: add mark directly
        if (mapRef.current && placemarkRef.current) {
          mapRef.current.geoObjects.remove(placemarkRef.current)
        }
        if (mapRef.current) {
          const pm = new window.ymaps.Placemark(c, {}, { preset: "islands#greenMedicalIcon", draggable: true })
          mapRef.current.geoObjects.add(pm)
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
