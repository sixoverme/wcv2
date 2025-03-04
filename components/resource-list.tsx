"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

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

type ResourceListProps = {
  resources: Resource[]
  onResourceClick: (resource: Resource) => void
}

export function ResourceList({ resources, onResourceClick }: ResourceListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredResources = useMemo(() => 
    resources.filter(
      (resource) =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
    [resources, searchTerm]
  )

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search resources..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => {
          // Ensure coordinates are always numbers
          const coordinates = {
            lat: Number(resource.coordinates.lat),
            lng: Number(resource.coordinates.lng)
          }

          return (
            <Card
              key={resource.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onResourceClick({
                ...resource,
                coordinates // Pass sanitized coordinates
              })}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{resource.name}</CardTitle>
                <Badge variant="sage" className="mt-1">
                  {resource.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>
                    {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

