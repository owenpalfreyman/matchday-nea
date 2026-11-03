import { supabase } from './supabase'

// Get the currently authenticated user's data, including their ID.
async function getUserId(): Promise<string | null> {
    const { data: { user }, error } = await supabase.auth.getUser()

    // Error handling - in reality, the user would be redirected before component mounts
    if (error) {
        console.error("Error getting user - not authenticated.", error)
        return null
    }

    return user?.id ?? null
}

async function getUserData(id: string) {
    const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle()

    if (userError) {
        console.error("Error getting the user's data.", userError)
        return null
    }

    return userData
}

export { getUserId, getUserData }