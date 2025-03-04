"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { MapPin, Plus, X, Search } from "lucide-react"
import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ResourceList } from "@/components/resource-list"

declare global {
  interface Window {
    google: {
      maps: {
        Geocoder: new () => google.maps.Geocoder
        GeocoderStatus: google.maps.GeocoderStatus
        Map: typeof google.maps.Map
        places: {
          PlacesService: any
          PlacesServiceStatus: any
          PlaceResult: any
        }
      }
    }
  }
}

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-muted flex items-center justify-center">
      <p>Loading map...</p>
    </div>
  ),
})

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

export default function MapPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingResource, setIsAddingResource] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  // Form state for adding a new resource
  const [resourceName, setResourceName] = useState("")
  const [resourceDescription, setResourceDescription] = useState("")
  const [resourceCategory, setResourceCategory] = useState("")
  const [resourceCoordinates, setResourceCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate fetching resources
    const fetchResources = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockResources: Resource[] = [
        {
          id: "resource-1",
          name: "Southside Community Garden",
          description:
            "Urban garden with 20 plots available for community members. Offers free gardening workshops every month.",
          category: "Food",
          coordinates: { lat: 35.0345, lng: -85.3094 },
          addedBy: "user-2",
        },
        {
          id: "resource-2",
          name: "Northshore Free Health Clinic",
          description:
            "Provides basic healthcare services to uninsured and underinsured community members. Open Tuesdays and Thursdays.",
          category: "Healthcare",
          coordinates: { lat: 35.0628, lng: -85.3097 },
          addedBy: "user-3",
        },
        {
          id: "resource-3",
          name: "Downtown Mutual Aid Food Pantry",
          description: "Community-run food pantry offering free groceries. No ID required. Open daily 3-7pm.",
          category: "Food",
          coordinates: { lat: 35.0456, lng: -85.3097 },
          addedBy: "user-4",
        },
      ]
      // Ensure coordinates are plain objects
      const sanitizedResources = mockResources.map(resource => ({
        ...resource,
        coordinates: {
          lat: Number(resource.coordinates.lat),
          lng: Number(resource.coordinates.lng)
        }
      }))
      setResources(sanitizedResources)
      setIsLoading(false)
    }
    fetchResources()
  }, [])

  const handleAddResource = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add resources",
      })
      return
    }
    setIsAddingResource(true)
  }

  const handleMapClick = (coordinates: { lat: number; lng: number }) => {
    if (isAddingResource) {
      // Ensure coordinates are numbers
      setResourceCoordinates({
        lat: Number(coordinates.lat),
        lng: Number(coordinates.lng)
      })
    }
  }

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource)
  }

  const handleAddressSearch = () => {
    if (!searchQuery || typeof window.google === "undefined") return

    const geocoder = new window.google.maps.Geocoder()
    
    geocoder.geocode(
      { address: searchQuery.trim() },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === "OK" && results && results.length > 0) {
          try {
            const location = results[0].geometry.location
            // Extract primitive values immediately to avoid Google Maps object issues
            const lat = typeof location.lat === 'function' ? location.lat() : Number(location.lat)
            const lng = typeof location.lng === 'function' ? location.lng() : Number(location.lng)
            
            // Store both state updates in a local object first
            const updates = {
              coordinates: {
                lat: Number(lat),
                lng: Number(lng)
              },
              address: String(results[0].formatted_address || searchQuery)
            }

            // Update both states at once to prevent intermediate renders
            setResourceCoordinates(updates.coordinates)
            setSearchQuery(updates.address)
          } catch (error) {
            console.error('Error processing geocoding result:', error)
            toast({
              title: "Error processing location",
              description: "Failed to process the location data. Please try again.",
              variant: "destructive",
            })
          }
        } else {
          console.error("Geocode was not successful:", status)
          toast({
            title: "Address search failed",
            description: status === "ZERO_RESULTS" 
              ? "No locations found for this address" 
              : "Failed to find address. Please try again.",
            variant: "destructive",
          })
        }
      }
    )
  }

  const handleSubmitResource = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resourceName || !resourceDescription || !resourceCategory || !resourceCoordinates) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select a location on the map",
        variant: "destructive",
      })
      return
    }

    const newResource: Resource = {
      id: `resource-${Date.now()}`,
      name: resourceName,
      description: resourceDescription,
      category: resourceCategory,
      coordinates: resourceCoordinates,
      addedBy: user?.id || "unknown",
    }

    setResources([...resources, newResource])
    setResourceName("")
    setResourceDescription("")
    setResourceCategory("")
    setResourceCoordinates(null)
    setIsAddingResource(false)

    toast({
      title: "Resource added",
      description: "Your resource has been added to the map",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-earth-800">Community Resources</h1>
        <Button variant="earth" onClick={handleAddResource}>
          <Plus className="h-4 w-4 mr-1" />
          Add Resource
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-hidden rounded-lg">
          <MapComponent
            resources={resources}
            onMapClick={handleMapClick}
            onResourceClick={handleResourceClick}
            selectedLocation={resourceCoordinates}
            isAddingResource={isAddingResource}
          />
        </CardContent>
      </Card>

      <ResourceList resources={resources} onResourceClick={handleResourceClick} />

      <Dialog open={isAddingResource} onOpenChange={setIsAddingResource}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitResource} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resource-name">Resource Name</Label>
              <Input
                id="resource-name"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="e.g., Community Garden, Food Pantry"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-category">Category</Label>
              <Input
                id="resource-category"
                value={resourceCategory}
                onChange={(e) => setResourceCategory(e.target.value)}
                placeholder="e.g., Food, Healthcare, Housing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-description">Description</Label>
              <Textarea
                id="resource-description"
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
                placeholder="Describe what this resource offers, hours, requirements, etc."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-address">Address</Label>
              <div className="flex gap-2">
                <Input
                  id="resource-address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter an address to search"
                  className="flex-grow"
                />
                <Button type="button" variant="outline" onClick={handleAddressSearch}>
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <p className="text-sm text-muted-foreground">
                {resourceCoordinates
                  ? `Selected location: ${resourceCoordinates.lat.toFixed(4)}, ${resourceCoordinates.lng.toFixed(4)}`
                  : "Use the map to select a location or search for an address"}
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddingResource(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="earth">
                Add to Map
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {selectedResource && (() => {
        // Sanitize coordinates before rendering
        const coordinates = {
          lat: Number(selectedResource.coordinates.lat),
          lng: Number(selectedResource.coordinates.lng)
        }
        
        return (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{selectedResource.name}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedResource(null)} className="h-8 w-8 p-0">
                <span className="sr-only">Close</span>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-medium text-muted-foreground mb-2">{selectedResource.category}</div>
              <p className="text-sm mb-4">{selectedResource.description}</p>
              <div className="text-xs text-muted-foreground flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>
                  {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })()}
    </div>
  )
}

