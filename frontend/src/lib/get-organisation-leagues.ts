import { supabase } from "./supabase"

// Function to get the leagues and their data for the organisation
async function getOrganisationLeagues(orgId:string) {
    if (!orgId) { // User should be redirected anyway (safety check)
        console.warn("No organisation ID")
        return null
    }

    // Database search query
    const { data: leaguesData, error: leaguesError } = await supabase
        .from("leagues")
        .select("*")
        .eq("organisation_id", orgId)

    // Error handling
    if (leaguesError) {
        console.error("Error fetching the leagues for this organisation.", leaguesError)
        return null
    }

    return leaguesData
}

export default getOrganisationLeagues