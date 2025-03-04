"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { X, MapPin } from "lucide-react"
import { useToast } from "./ui/use-toast"
import { createPost } from "@/lib/db"

type CreatePostFormProps = {
  onClose: () => void
  onPostCreated?: () => void
}

export function CreatePostForm({ onClose, onPostCreated }: CreatePostFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Please add some content to your post",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to create posts",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createPost({
        content: content.trim(),
        author_id: user.id,
        location: location.trim() ? { address: location.trim() } : null,
        title: "", // Required by schema
        category: tags.join(",") // Store tags in category field
      })

      toast({
        title: "Post created successfully",
        description: "Your post has been shared with the community",
      })
      setContent("")
      setTags([])
      setLocation("")
      onPostCreated?.()
      onClose()
    } catch (error) {
      toast({
        title: "Error creating post",
        description: "There was a problem creating your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Create a new post</DialogTitle>
        <DialogDescription>Share resources, request help, or announce community events</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 my-4">
        <div className="space-y-2">
          <Label htmlFor="content">What would you like to share?</Label>
          <Textarea
            id="content"
            placeholder="Describe your offer, request, or announcement..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (helps others find your post)</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="tags"
              placeholder="Add a tag (e.g., food, housing, event)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
              Add
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="sage" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full hover:bg-sage-700/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {tag}</span>
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Location (optional)
          </Label>
          <Input
            id="location"
            placeholder="Add a location (e.g., Community Garden, Downtown)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting} variant="earth">
          {isSubmitting ? "Posting..." : "Post to Community"}
        </Button>
      </DialogFooter>
    </form>
  )
}

