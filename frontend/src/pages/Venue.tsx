import { Card, CardTitle } from '@/components/ui/card'
import getCurrentOrganisationId from '@/lib/get-current-organisation-id'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Venue = () => {
    const { venueId } = useParams<{ venueId: string }>()
    const navigate = useNavigate()
    const [venue, setVenue] = useState(null)

    useEffect(() => {
        async function fetchVenue() {
            if (!venueId) {
                return
            }

            const { data: venue, error: venueError } = await supabase
                .from('venues')
                .select('*')
                .eq('id', venueId)
                .single()

            if (venueError) {
                console.error('Error fetching venue:', venueError)
                return
            }

            setVenue(venue)

            const organisation = await getCurrentOrganisationId()

            if (organisation.organisationId !== venue.organisation_id) {
                navigate('/dashboard/venues')
            }
        }

        void fetchVenue()
    }, [venueId, navigate])

    return (
        <Card>
            <CardTitle>{venue.name}</CardTitle>
        </Card>
    )
}

export default Venue