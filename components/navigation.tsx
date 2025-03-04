"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, User, BookOpen, Plus, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { CreatePostForm } from "./create-post-form"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { getInitials } from "@/lib/utils"

export default function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <div className="container max-w-4xl mx-auto flex items-center justify-between p-2">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
            isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          href="/map"
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
            isActive("/map") ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Map className="h-5 w-5" />
          <span className="text-xs mt-1">Map</span>
        </Link>
        {user ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="earth" size="sm" className="rounded-full h-12 w-12 p-0 shadow-md">
                <Plus className="h-6 w-6" />
                <span className="sr-only">Create Post</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <CreatePostForm onClose={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        ) : (
          <Link href="/login">
            <Button variant="earth" size="sm" className="rounded-full h-12 w-12 p-0 shadow-md">
              <Plus className="h-6 w-6" />
              <span className="sr-only">Create Post</span>
            </Button>
          </Link>
        )}
        <Link
          href="/guidelines"
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
            isActive("/guidelines") ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs mt-1">Guidelines</span>
        </Link>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
                isActive("/profile") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <Avatar className="h-5 w-5">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{getInitials(user.user_metadata?.name || user.email || '')}</AvatarFallback>
                </Avatar>
                <span className="text-xs mt-1">Profile</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
              isActive("/login") ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Login</span>
          </Link>
        )}
      </div>
    </div>
  )
}

