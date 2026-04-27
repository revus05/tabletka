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

declare global {
  interface Window {
    ymaps?: {
      ready: (callback: () => void) => void
      Map: new (container: HTMLElement | string, options: Record<string, unknown>) => YMap
      Placemark: new (coords: [number, number], properties: Record<string, unknown>, options?: Record<string, unknown>) => YPlacemark
      geocode: (address: string) => Promise<{ geoObjects: { get: (index: number) => { geometry: { getCoordinates: () => [number, number] } } | null } }>
    }
  }
}

type YMap = {
  geoObjects: {
    add: (obj: YPlacemark) => void
  }
  setBounds: (bounds: [[number, number], [number, number]], options?: Record<string, unknown>) => void
  setCenter: (center: [number, number], zoom?: number) => void
}

type YPlacemark = object

export function PharmacyMap({ pharmacies }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<YMap | null>(null)

  useEffect(() => {
    // Load Yandex Maps API
    if (!window.ymaps) {
      const script = document.createElement("script")
      script.src = "https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU"
      script.async = true
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    function initMap() {
      window.ymaps?.ready(async () => {
        if (!mapContainerRef.current || mapRef.current) return

        // Center on Belarus by default
        const map = new window.ymaps!.Map(mapContainerRef.current, {
          center: [53.9, 27.5667],
          zoom: 6,
          controls: ["zoomControl", "geolocationControl"],
        })

        mapRef.current = map

        // Add placemarks for each pharmacy
        const bounds: [number, number][] = []

        for (const pharmacy of pharmacies) {
          try {
            let coords: [number, number]

            if (pharmacy.latitude && pharmacy.longitude) {
              coords = [pharmacy.latitude, pharmacy.longitude]
            } else {
              // Geocode address
              const result = await window.ymaps!.geocode(pharmacy.address)
              const firstGeoObject = result.geoObjects.get(0)
              if (!firstGeoObject) continue
              coords = firstGeoObject.geometry.getCoordinates()
            }

            bounds.push(coords)

            const placemark = new window.ymaps!.Placemark(
              coords,
              {
                balloonContentHeader: pharmacy.name,
                balloonContentBody: pharmacy.address,
                hintContent: pharmacy.name,
              },
              {
                preset: "islands#greenMedicalIcon",
              }
            )

            map.geoObjects.add(placemark)
          } catch {
            // Skip if geocoding fails
            console.error(`Failed to geocode: ${pharmacy.address}`)
          }
        }

        // Fit map to show all placemarks
        if (bounds.length > 1) {
          const minLat = Math.min(...bounds.map((b) => b[0]))
          const maxLat = Math.max(...bounds.map((b) => b[0]))
          const minLng = Math.min(...bounds.map((b) => b[1]))
          const maxLng = Math.max(...bounds.map((b) => b[1]))
          map.setBounds(
            [
              [minLat - 0.1, minLng - 0.1],
              [maxLat + 0.1, maxLng + 0.1],
            ],
            { checkZoomRange: true }
          )
        } else if (bounds.length === 1) {
          map.setCenter(bounds[0], 14)
        }
      })
    }

    return () => {
      // Cleanup is handled by Yandex Maps internally
    }
  }, [pharmacies])

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] md:h-[500px]"
    />
  )
}
