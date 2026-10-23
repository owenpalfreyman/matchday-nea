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
        // Get the venue data (if the user is from the correct organisation)
        async function fetchVenue() {
            if (!venueId) {
                console.warn("No venue")
                return
            }

            // Database query for the venue with a matching ID as the parameter
            const { data: venue, error: venueError } = await supabase
                .from('venues')
                .select('*')
                .eq('id', venueId)
                .maybeSingle()

            // Error handling
            if (venueError) {
                console.error('Error fetching venue:', venueError)
                return
            }

            setVenue(venue)

            // Get current org ID from user data
            const organisation = await getCurrentOrganisationId()

            // For debugging purposes
            console.log("The user's organisation: ", organisation.organisationId)
            console.log("The venue's organisation: ", venue.organisation_id)

            // Check to see if the user's org ID and the venue's org ID match
            if (organisation.organisationId !== venue.organisation_id) {
                // If not, user has to be navigated back to the /venues
                navigate('/dashboard/venues', { replace: true })
            }

            // Catches if the venue is null so should be redirected
            if (!venue || venue === null) {
                navigate("dashboard/venues", {replace: true})
            }
        }

        void fetchVenue()
    }, [venueId, navigate])

    return (
        <Card>
            <CardTitle>{venue?.name}</CardTitle>
        </Card>
    )
}

export default Venue