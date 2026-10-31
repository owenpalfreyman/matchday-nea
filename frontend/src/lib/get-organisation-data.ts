import { supabase } from "./supabase"

// Get the data about the relevant organisation
async function getOrganisationData(orgId: string) {
    if (!orgId) { // User should be redirected anyway (safety check)
        console.warn("No organisation ID")
        return null
    }

    // Database query for organisation
    const { data: orgData, error: orgError } = await supabase
        .from("organisations")
        .select("id, name") // No need for the owner ID
        .eq("id", orgId)
        .single()

    // Error handling
    if (orgError) {
        console.error("Error fetching the organisation.", orgError)
        return null
    }

    return orgData
}

export default getOrganisationData