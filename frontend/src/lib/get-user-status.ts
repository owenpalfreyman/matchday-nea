import { supabase } from '@/lib/supabase'

// Check if the user is part of an organisation
async function getUserStatus() {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
        console.error("Error checking the current user.", userError)
        return false
    }
    
    if (!user) {
        return false
    }

    const { data: membership, error: membershipError } = await supabase
        .from("organisation_members")
        .select("*")
        .eq("profile_id", user.id)
        .maybeSingle() // Won't return an error if there are no rows found

    // Error checks
    if (membershipError) {
        console.error("Error checking user membership status.", membershipError)
        return false
    }

    // If the user is not part of an organisation, return false
    if (membership === null) {
        return false
    }

    return user
}

export default getUserStatus