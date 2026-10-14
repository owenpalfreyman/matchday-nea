import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { supabase } from '@/lib/supabase'

// Define Types
type League = {
    id: string
    name: string
    result_format: string | null
    is_team_based: boolean | null
}

// Get the leagues for the relevant organisation
async function getLeagues(): Promise<League[]> {
    // Fetch authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser()

    // If user cannot be found
    // The user should not be here - error for redirecting and protected routes (see main.tsx)
    if (authError || !authData.user) {
        console.error("Error fetching user:", authError)
        return []
    }

    // Check for which organisation the user is in
    const { data: orgMemberData, error: orgMemberError } = await supabase
        .from("organisation_members")
        .select("organisation_id")
        .eq("user_id", authData.user.id)
        .maybeSingle() // Should only be one organisation per user

    if (orgMemberError) {
        console.error("Could not find organisation for user:", orgMemberError)
        return []
    }

    // Find the league(s) with the matching organisation_id
    const { data: leagues, error: leaguesError } = await supabase
        .from("leagues")
        .select("*")
        .eq("organisation_id", orgMemberData?.organisation_id)

    if (leaguesError) {
        console.warn("No leagues found for organisation:", leaguesError)
        return []
    } else {
        console.log("Leagues found for organisation:", leagues)
        return leagues as League[]
    }
}

const YourLeagues = () => {
    const [leagues, setLeagues] = useState<League[]>([])

    useEffect(() => {
        getLeagues().then(setLeagues)
    }, [])

  return (
    <Card size="sm" className="w-full max-w-md p-6">
        <CardHeader>
            <CardTitle>Your Leagues</CardTitle>
            <CardDescription>Your leagues in your organisation.</CardDescription>
        </CardHeader>
        <CardContent>
            {leagues.length > 0 ? (
                <div className="divide-y rounded-md border">
                    {leagues.map((league) => (
                        <div key={league.id} className="flex items-center justify-between gap-4 px-3 py-2">
                            <span className="truncate font-medium">{league.name}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                                {league.result_format ?? (league.is_team_based ? "Team league" : "Player league")}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    {/* If no leagues are found, display a message */}
                    No leagues found.</p>
            )}
        </CardContent>
    </Card>
  )
}

export default YourLeagues