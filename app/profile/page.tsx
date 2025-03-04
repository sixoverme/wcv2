"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { getProfile, updateProfile } from "@/lib/db"
import { getInitials } from "@/lib/utils"
import type { Database } from "@/types/supabase"

type Profile = Database['public']['Tables']['profiles']['Row']

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    bio: ""
  })

  // Fetch profile data when component mounts
  useEffect(() => {
    if (user) {
      getProfile(user.id).then((data) => {
        if (data) {
          setProfile(data)
          setFormData({
            name: data.name || "",
            location: data.location || "",
            bio: data.bio || ""
          })
        }
      })
    }
  }, [user])

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/login")
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile(user.id, {
        name: formData.name,
        location: formData.location,
        bio: formData.bio
      })
      
      setProfile(prev => prev ? { ...prev, ...formData } : null)
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    })
  }

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-earth-800">Your Profile</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{profile.name}</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, State"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell the community about yourself..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>{profile.location || "Not specified"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                <p className="whitespace-pre-line">{profile.bio || "No bio provided yet"}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isEditing ? (
            <div className="flex w-full space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="earth" onClick={handleSave} disabled={isSaving} className="flex-1">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Activity</CardTitle>
          <CardDescription>View your posts, comments, and saved resources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-earth-700">0</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-earth-700">0</div>
              <div className="text-sm text-muted-foreground">Comments</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-earth-700">0</div>
              <div className="text-sm text-muted-foreground">Resources</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

