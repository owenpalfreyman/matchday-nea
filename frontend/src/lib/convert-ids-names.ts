import { supabase } from "./supabase"

export async function getOrganisationName(organisationId: string) {
    if (!organisationId) {
        console.error("No organisation ID.")
        return null
    }

    // Database query for organisation
    const { data: organisationData, error: organisationError} = await supabase
        .from("organisations")
        .select("name")
        .eq("id", organisationId)
        .single()

    // Error handling
    if (organisationError) {
        console.error("Error fetching organisation name:", organisationError)
        return null
    }

    return organisationData?.name || null
}

export async function getLeagueName(leagueId: string) {
    if (!leagueId) {
        console.error("No league ID.")
        return null
    }

    // Database query for league
    const { data: leagueData, error: leagueError} = await supabase
        .from("leagues")
        .select("name")
        .eq("id", leagueId)
        .single()

    // Error handling
    if (leagueError) {
        console.error("Error fetching league name:", leagueError)
        return null
    }

    return leagueData?.name || null
}

export async function getTeamName(teamId: string) {
    if (!teamId) {
        console.error("No team ID.")
        return null
    }

    // Database query for team
    const { data: teamData, error: teamError} = await supabase
        .from("teams")
        .select("name")
        .eq("id", teamId)
        .single()

    // Error handling
    if (teamError) {
        console.error("Error fetching team name:", teamError)
        return null
    }

    return teamData?.name || null
}

export default { getOrganisationName, getLeagueName, getTeamName }