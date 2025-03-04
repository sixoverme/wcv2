"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useAuth } from "./auth-provider"
import { useToast } from "./ui/use-toast"
import type { PostComment } from "./post-list"

type CommentFormProps = {
  postId: string
  onCommentAdded: (comment: PostComment) => void
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Please add a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newComment: PostComment = {
      id: `comment-${Date.now()}`,
      userId: user?.id || "unknown",
      userName: user?.user_metadata?.name || "Anonymous",
      content: content.trim(),
      timestamp: new Date(),
    }

    onCommentAdded(newComment)

    setIsSubmitting(false)
    setContent("")

    toast({
      title: "Comment added successfully",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-2"
      />
      <Button type="submit" disabled={isSubmitting} variant="earth">
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  )
}

