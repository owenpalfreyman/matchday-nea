import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"

const Dashboard = () => {
  const [userName, setUserName] = useState("there")

  useEffect(() => {
    let isMounted = true

    async function loadUserName() {
      // Read the authenticated profile after the OAuth call
      const { data: { user } } = await supabase.auth.getUser()

      // If neither happens, there is an empty reutrn preventing the setUserName
      if (!isMounted || !user) return

      const metadata = user.user_metadata as { name?: string }
      // Use the display name stored in the Supabase user metadata.
      setUserName(metadata.name || user.email || "there")
    }

    void loadUserName()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center text-foreground">
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome, {userName}!
      </h1>
    </div>
  )
}

export default Dashboard
