"use client"
import { FeedHeader } from "@/components/feed-header"
import { PostList } from "@/components/post-list"
import { useRef } from "react"

export default function Home() {
  const postListRef = useRef<{ refreshPosts?: () => void }>({})

  const handlePostCreated = () => {
    postListRef.current.refreshPosts?.()
  }

  return (
    <div className="space-y-6">
      <FeedHeader onPostCreated={handlePostCreated} />
      <PostList ref={postListRef} />
    </div>
  )
}

