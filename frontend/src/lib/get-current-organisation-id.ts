import { redirect } from "react-router-dom";
import { supabase } from "./supabase";

const getOrganisationId = async () => {
    // Get the user login details
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) redirect("/login");
    
    // Find organisation ID from membership table
    const { data: membership, error: membershipError } = await supabase
        .from("organisation_members")
        .select("organisation_id, role")
        .eq("user_id", user.id)
        .maybeSingle();

    if (membershipError) console.error("Error fetching membership:", membershipError);
    if (!membership) redirect("/login");

    return {
        userId: user?.id,
        organisationId: membership?.organisation_id,
        role: membership?.role,
    };
}

export default getOrganisationId;