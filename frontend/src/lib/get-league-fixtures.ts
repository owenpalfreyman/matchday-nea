import { supabase } from "./supabase"

async function getLeagueFixtures(leagueId: number) {
    // Database query for fixtures
    const { data: fixtures, error } = await supabase
        .from('fixtures')
        // Join the teams table to get the home and away team names
        .select(`id,
            gameweek,
            fixture_date,
            start_time,
            venue_id,
            venue:venues!venue_id(name),
            home_team:teams!home_team_id(name),
            away_team:teams!away_team_id(name)`)
        .eq('league_id', leagueId)

    // Error handling
    if (error) {
        console.error('Error fetching fixtures:', error)
        return null
    }
    
    return fixtures
}

export default getLeagueFixtures