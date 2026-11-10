import { supabase } from "./supabase"

async function getLeagueFixtures(leagueId: number) {
    // Database query for fixtures
    const { data: fixtures, error } = await supabase
        .from('fixtures')
        .select('*')
        .eq('league_id', leagueId)

    // Error handling
    if (error) {
        console.error('Error fetching fixtures:', error)
        return null
    }
    
    return fixtures
}

export default getLeagueFixtures