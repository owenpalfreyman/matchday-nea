import { supabase } from "./supabase"

// Function to get data for each team in a league
async function getLeagueTeams(leagueId: string) {
    if (!leagueId) {
        console.error("No league ID.")
        return null
    }

    // Database query for organisation
    const { data: teamsData, error: teamsError} = await supabase
        .from("teams")
        .select("*")
        .eq("league_id", leagueId)

    // Error handling
    if (teamsError) {
        console.error("Error fetching teams from this league", teamsError)
    }

    return teamsData
}

export default getLeagueTeams