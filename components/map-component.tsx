"use client"
import { useState, useEffect, useCallback } from "react"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"

const mapContainerStyle = {
  width: "100%",
  height: "500px",
}

const center = {
  lat: 35.0456,
  lng: -85.3097,
}

type Resource = {
  id: string
  name: string
  description: string
  category: string
  coordinates: {
    readonly lat: number
    readonly lng: number
  }
  addedBy: string
}

type MapComponentProps = {
  resources: Resource[]
  onMapClick: (coordinates: { lat: number; lng: number }) => void
  onResourceClick: (resource: Resource) => void
  selectedLocation: { lat: number; lng: number } | null
  isAddingResource: boolean
}

export default function MapComponent({
  resources,
  onMapClick,
  onResourceClick,
  selectedLocation,
  isAddingResource,
}: MapComponentProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [sanitizedMarkers, setSanitizedMarkers] = useState<Array<{ id: string; position: { lat: number; lng: number } }>>(
    resources.map(r => ({
      id: r.id,
      position: {
        lat: Number(r.coordinates.lat),
        lng: Number(r.coordinates.lng)
      }
    }))
  )

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "geocoding"],
  })

  useEffect(() => {
    // Update sanitized markers when resources change
    setSanitizedMarkers(
      resources.map(r => ({
        id: r.id,
        position: {
          lat: Number(r.coordinates.lat),
          lng: Number(r.coordinates.lng)
        }
      }))
    )
  }, [resources])

  useEffect(() => {
    if (loadError) {
      console.error("Error loading Google Maps:", loadError)
      setErrorMessage("Failed to load Google Maps. Please check your API key and project configuration.")
    }
  }, [loadError])

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !isAddingResource) return

    const lat = e.latLng.lat()
    const lng = e.latLng.lng()

    if (typeof lat === 'number' && typeof lng === 'number') {
      onMapClick({ lat, lng })
    }
  }, [isAddingResource, onMapClick])

  if (loadError) {
    return <div>Error loading maps: {errorMessage}</div>
  }

  if (!isLoaded) return <div>Loading maps...</div>

  const sanitizedSelectedLocation = selectedLocation ? {
    lat: Number(selectedLocation.lat),
    lng: Number(selectedLocation.lng)
  } : null

  return (
    <div className="relative">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onClick={handleMapClick}
      >
        {sanitizedMarkers.map(({ id, position }) => (
          <Marker 
            key={id}
            position={position}
            onClick={() => {
              const resource = resources.find(r => r.id === id)
              if (resource) {
                onResourceClick(resource)
              }
            }}
          />
        ))}
        {sanitizedSelectedLocation && isAddingResource && (
          <Marker position={sanitizedSelectedLocation} />
        )}
      </GoogleMap>
    </div>
  )
}

