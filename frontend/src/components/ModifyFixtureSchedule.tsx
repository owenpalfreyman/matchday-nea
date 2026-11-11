import { supabase } from '@/lib/supabase'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FixtureRow } from './FixtureList'
import { Card, CardDescription, CardTitle } from './ui/card'

const ModifyFixtureSchedule = ({ fixtureId }: { fixtureId: string }) => {
    const navigate = useNavigate()
    const [fixture, setFixture] = useState(null as FixtureRow | null)

    useEffect(() => {
        // Function to get the fixture ID
        async function getFixture() {
            // Database Query
            const { data, error } = await supabase
                .from('fixtures')
                .select('*')
                .eq('id', fixtureId)
                .single()

            // If no fixture is found redirect the user to the scheduler page
            if (error) {
                console.error('Error fetching fixture ID:', error)
                navigate('/scheduler') // Redirect to scheduler page on error
                return
            }

            setFixture(data as FixtureRow)
            console.log(data)
        }

        getFixture()
    }, [fixtureId, navigate])

    return (
        <Card>
            <CardTitle>Modify Fixture Schedule</CardTitle>
            <CardDescription>Change the venue, date and time of this fixture</CardDescription>

            {fixture ? (
                <h1>There is a fixture.</h1>
            ) : (
                <h1>There is not a fixture.</h1>
            )}

        </Card>
    )
}

export default ModifyFixtureSchedule
