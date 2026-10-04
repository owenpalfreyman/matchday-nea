import { supabase } from '@/lib/supabase'
import React, { useEffect, useState } from 'react'


const Organisations = () => {
  // Functions to change the state of pending
  const [org, setOrg] = useState({ status: "loading" })

  async function loadOrganisation() {
    // Get current user and query for the organisation
    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error("User could not be found.")
      return
    }

    // Supabase Query
    const { data: memberRow, error: memberError } = await supabase
      .from("organisation_members")
      .select("user_id")
      .eq("user_id", authData.user.id)
      .maybeSingle()

    if (memberError) {
      console.error("Error searching the table.")
      setOrg({ status: "error"}) // Change the state
    }

    if (memberRow == null) {
      setOrg({ status: "none" }) // Change the state to show there is no user in the table
    } else {
      setOrg({ status: "member"})
      
    }
  }

  useEffect(() => {
    loadOrganisation()
  }, [])

  // Conditionally render the page
  if (org.status === "loading") return <div>Loading</div>
  if (org.status === "none") return <div>Create organisation form</div>
  if (org.status === "error") return <div>Error. Try refreshing the page.</div>
  if (org.status === "member") return <div>Your organisation's page</div>

  return (
    <div>Organisations</div>
  )
}

export default Organisations