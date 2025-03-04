"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { MapPin, Flag, MessageCircle, Heart, ChevronDown, ChevronUp, Search, X } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import { useAuth } from "./auth-provider"
import { Textarea } from "./ui/textarea"
import { useToast } from "./ui/use-toast"
import { CommentForm } from "./comment-form"
import { Input } from "./ui/input"
import { getPosts, createComment, getComments } from "@/lib/db"

export type PostComment = {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
}

type Post = {
  id: string
  userId: string
  userName: string
  userLocation?: string
  content: string
  tags: string[]
  location?: { address: string } | string
  timestamp: Date
  likes: number
  comments: PostComment[]
  userLiked: boolean
}

export const PostList = forwardRef<{ refreshPosts?: () => void }>((_, ref) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState("")
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const fetchedPosts = await getPosts()
      setPosts(fetchedPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: "Error loading posts",
        description: "There was a problem loading the posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, []) // Initial load

  // Add this function to expose refresh capability
  const refreshPosts = () => {
    fetchPosts()
  }

  useImperativeHandle(ref, () => ({
    refreshPosts: fetchPosts
  }))

  useEffect(() => {
    // Filter posts based on search term and selected tag
    const filtered = posts.filter((post) => {
      const matchesSearch =
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true
      return matchesSearch && matchesTag
    })
    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedTag])

  const handleLike = (postId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to like posts",
      })
      return
    }

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newLikedState = !post.userLiked
          return {
            ...post,
            likes: newLikedState ? post.likes + 1 : post.likes - 1,
            userLiked: newLikedState,
          }
        }
        return post
      }),
    )
  }

  const handleReport = (postId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to report posts",
      })
      return
    }

    setSelectedPostId(postId)
    setReportDialogOpen(true)
  }

  const submitReport = () => {
    if (!reportReason.trim()) {
      toast({
        title: "Please provide a reason",
        description: "A reason is required to submit a report",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would send the report to the server
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe",
    })

    setReportDialogOpen(false)
    setReportReason("")
    setSelectedPostId(null)
  }

  const handleCommentAdded = (postId: string, comment: PostComment) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, comment],
          }
        }
        return post
      }),
    )
  }

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag)
    setSearchTerm("")
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTag(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-16 bg-muted rounded"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-between">
                <div className="h-8 w-20 bg-muted rounded"></div>
                <div className="h-8 w-20 bg-muted rounded"></div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {(searchTerm || selectedTag) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        {selectedTag && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Filtered by tag:</span>
            <Badge variant="sage" className="text-xs">
              {selectedTag}
              <button onClick={() => setSelectedTag(null)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}
        {filteredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{getInitials(post.userName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.userName}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    {post.userLocation && (
                      <>
                        <MapPin className="h-3 w-3 mr-1" />
                        {post.userLocation} ·
                      </>
                    )}
                    <span className="ml-1">{formatDate(post.timestamp)}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="whitespace-pre-line">{post.content}</p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="sage"
                      className={`text-xs cursor-pointer ${selectedTag === tag ? "bg-sage-700 text-white" : ""}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {post.location && (
                <div className="mt-3 text-sm flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {typeof post.location === 'string' ? 
                    JSON.parse(post.location).address : 
                    post.location.address}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-3">
              <div className="flex w-full justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart className={`h-4 w-4 ${post.userLiked ? "fill-primary text-primary" : ""}`} />
                    <span>{post.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments.length}</span>
                    {expandedComments[post.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleReport(post.id)}>
                  <Flag className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>
            </CardFooter>
            {expandedComments[post.id] && (
              <CardContent className="border-t pt-3">
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(comment.userName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{comment.userName}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <CommentForm postId={post.id} onCommentAdded={(comment) => handleCommentAdded(post.id, comment)} />
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Post</DialogTitle>
            <DialogDescription>
              Please let us know why you're reporting this post. This helps our community moderators review it
              appropriately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Please explain why you're reporting this post..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitReport}>
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
})

