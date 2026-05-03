"use client"

import { useEffect, useRef } from "react"

type Pharmacy = {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
}

type Props = {
  pharmacy: Pharmacy
}

type YMap = {
  geoObjects: { add: (obj: object) => void }
  setCenter: (center: [number, number], zoom?: number) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getYmaps = () => (window as any).ymaps as any

export function PharmacySingleMap({ pharmacy }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<YMap | null>(null)

  useEffect(() => {
    const ym = getYmaps()
    if (!ym) {
      const script = document.createElement("script")
      script.src = "https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU"
      script.async = true
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    function initMap() {
      getYmaps()?.ready(() => {
        if (!mapContainerRef.current || mapRef.current) return
        const ymaps = getYmaps()

        const coords: [number, number] = [pharmacy.latitude, pharmacy.longitude]

        const map: YMap = new ymaps.Map(mapContainerRef.current, {
          center: coords,
          zoom: 16,
          controls: ["zoomControl", "geolocationControl"],
        })

        mapRef.current = map

        const placemark = new ymaps.Placemark(
          coords,
          {
            balloonContentHeader: pharmacy.name,
            balloonContentBody: pharmacy.address,
            hintContent: pharmacy.name,
          },
          { preset: "islands#greenMedicalIcon" }
        )

        map.geoObjects.add(placemark)
      })
    }

    return () => {}
  }, [pharmacy])

  return <div ref={mapContainerRef} className="w-full h-[300px] md:h-[400px]" />
}
