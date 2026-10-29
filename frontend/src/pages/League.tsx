import AddLeagueBlackoutDate from '@/components/AddLeagueBlackoutDate'
import CreateTeamForm from '@/components/CreateTeamForm'
import CurrentLeagueBlackouts from '@/components/CurrentLeagueBlackouts'
import { Card, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Get the league with the matching leagueId which is passed in
async function getLeague(leagueId: string) {
    const { data: league, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', leagueId)
        .single()

    // Error handling
    if (error) {
        console.error('Error fetching league:', error)
        return null
    }
    return league
}


const League = () => {
    const { leagueId } = useParams()
    const [league, setLeague] = useState<{
        id: string
        name: string
        organisation_id: string
    } | null>(null)

    useEffect(() => {
        if (!leagueId) return

        // Fetch the league data when the component mounts or when leagueId changes
        const fetchLeague = async () => {
            const league = await getLeague(leagueId)
            setLeague(league)
        }

        void fetchLeague()
    }, [leagueId])


    return (
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            {league && (
                <>
                    <Card className="p-6">
                        <CardTitle className="text-2xl">{league.name}</CardTitle>
                    </Card>
                    <CreateTeamForm
                        leagueId={league.id}
                        organisationId={league.organisation_id}
                    />
                    <AddLeagueBlackoutDate leagueId={league.id} />
                    <CurrentLeagueBlackouts leagueId={league.id} />
                </>
            )}
        </main>
    )
}

export default League