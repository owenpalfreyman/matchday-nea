"use client"

import { useEffect, useState } from "react"
import { Navigate, replace, useNavigate } from "react-router-dom"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { supabase } from "@/lib/supabase"
import { ChevronsUpDownIcon, BadgeCheckIcon, LogOutIcon, SettingsIcon } from "lucide-react"

type SidebarUser = {
  name: string
  email: string
  avatar: string | null
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const [user, setUser] = useState<SidebarUser | null>(null)

  useEffect(() => {

    async function loadUser() {
      // 1. Validate the current user and return its data
      const { data: { user } } = await supabase.auth.getUser()

      // 2. If no user they should be redirected to a non-auth protected page
      if (!user) {
        console.warn("No authenticated user - need to redirect from auth protected page")
        return <Navigate to="/login" replace={true} /> // Redirect and prevents it from being in browsing history stack
      }

      // 3. Query profiles table using the auth user's ID
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, email, avatar_url")
        .eq("id", user.id)
        .maybeSingle()

      console.log(data)

      if (error) {
        console.error("No user profile found.")
      }

      // Set the details
      setUser({ name: data.display_name, email: data.email, avatar: data.avatar_url });
    }

    loadUser() // Call the function itself
  }, [navigate]) // deps array

  // Early return if the user is still being validated
  if (!user) return <div>Loading...</div>

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    // Error handling
    if (error) {
      console.error("Failed to sign out user.")
    }
  }


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon
                />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon
              />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
