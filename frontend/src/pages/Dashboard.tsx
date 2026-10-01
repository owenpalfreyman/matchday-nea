import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"

const Dashboard = () => {
  const [userName, setUserName] = useState("Mr. Mysterious")

  useEffect(() => {
    async function loadPlayer() {
      const result = await supabase.auth.getUser()
      const user = result.data.user

      if (!user) {
        return
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle()

        if (error) {
          console.error(error)
          return
        }

        setUserName(data?.display_name || "mate")
    }

      void loadPlayer()
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
