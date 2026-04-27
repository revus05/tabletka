"use client"

import { useEffect, useRef } from "react"

type Pharmacy = {
  id: number
  name: string
  address: string
  latitude?: number | null
  longitude?: number | null
}

type Props = {
  pharmacies: Pharmacy[]
}

type YMap = {
  geoObjects: { add: (obj: object) => void }
  setBounds: (bounds: [[number, number], [number, number]], options?: Record<string, unknown>) => void
  setCenter: (center: [number, number], zoom?: number) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getYmaps = () => (window as any).ymaps as any

export function PharmacyMap({ pharmacies }: Props) {
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
      getYmaps()?.ready(async () => {
        if (!mapContainerRef.current || mapRef.current) return
        const ymaps = getYmaps()

        const map: YMap = new ymaps.Map(mapContainerRef.current, {
          center: [53.9, 27.5667],
          zoom: 6,
          controls: ["zoomControl", "geolocationControl"],
        })

        mapRef.current = map

        const bounds: [number, number][] = []

        for (const pharmacy of pharmacies) {
          try {
            let coords: [number, number]

            if (pharmacy.latitude && pharmacy.longitude) {
              coords = [pharmacy.latitude, pharmacy.longitude]
            } else {
              const result = await ymaps.geocode(pharmacy.address)
              const first = result.geoObjects.get(0)
              if (!first) continue
              coords = first.geometry.getCoordinates()
            }

            bounds.push(coords)

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
          } catch {
            console.error(`Failed to geocode: ${pharmacy.address}`)
          }
        }

        if (bounds.length > 1) {
          const minLat = Math.min(...bounds.map((b) => b[0]))
          const maxLat = Math.max(...bounds.map((b) => b[0]))
          const minLng = Math.min(...bounds.map((b) => b[1]))
          const maxLng = Math.max(...bounds.map((b) => b[1]))
          map.setBounds([[minLat - 0.1, minLng - 0.1], [maxLat + 0.1, maxLng + 0.1]], { checkZoomRange: true })
        } else if (bounds.length === 1) {
          map.setCenter(bounds[0], 14)
        }
      })
    }

    return () => {}
  }, [pharmacies])

  return <div ref={mapContainerRef} className="w-full h-[400px] md:h-[500px]" />
}
