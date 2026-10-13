import React, { useEffect } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { supabase } from '@/lib/supabase'

// Get the leagues for the relevant organisation
async function getLeagues() {
    // Fetch authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser()

    // Check for which organisation the user is in
    const { data: orgMemberData, error: orgMemberError } = await supabase
        .from("organisation_members")
        .select("organisation_id")
        .eq("user_id", authData.user?.id)
        .single() // Should only be one organisation per user

    if (orgMemberError) {
        console.error("Could not find organisation for user:", orgMemberError)
        alert("Could not find organisation for user. Are you in an organisation?")
    }

    // If user cannot be found
    // The user should not be here - error for redirecting and protected routes (see main.tsx)
    if (authError) {
        console.error("Error fetching user:", authError)
        return { leagues: null, error: authError }
    }

    // Find the league(s) with the matching organisation_id
    const { data: leagues, error: leaguesError } = await supabase
        .from("leagues")
        .select("*")
        .eq("organisation_id", orgMemberData?.organisation_id)

    if (leaguesError) {
        console.warn("No leagues found for organisation:", leaguesError)
        // TODO: Return the leagues as null and handle it in the component
    } else {
        console.log("Leagues found for organisation:", leagues)
    }
}

const YourLeagues = () => {
    useEffect(() => {
        getLeagues()
    }, [])

  return (
    <Card>
        <CardHeader>
            <CardTitle>Your Leagues</CardTitle>
            <CardDescription>Your leagues in your organisation.</CardDescription>
            
        </CardHeader>
    </Card>
  )
}

export default YourLeagues