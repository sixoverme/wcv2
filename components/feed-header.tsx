"use client"

import { useAuth } from "./auth-provider"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { CreatePostForm } from "./create-post-form"
import Link from "next/link"
import { useState } from "react"

export function FeedHeader({ onPostCreated }: { onPostCreated?: () => void }) {
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-earth-800">Woven Circles</h1>
        <div className="flex items-center space-x-2">
          {!user && (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {user && (
        <Card>
          <CardContent className="p-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-muted-foreground h-auto py-3 px-4">
                  What resources would you like to share or request today?
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <CreatePostForm 
                  onClose={() => setIsDialogOpen(false)} 
                  onPostCreated={onPostCreated}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

