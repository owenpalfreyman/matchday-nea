import { Card, CardTitle } from '@/components/ui/card'
import getCurrentOrganisationId from '@/lib/get-current-organisation-id'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'


const Venue = () => {
    // Function to fetch the venue and check if the user is part of the same organisation
    async function fetchVenue(venueId: string, navigate: ReturnType<typeof useNavigate>) {
        // Query for the venue matching the ID
        const { data: venue, error: venueError } = await supabase
            .from('venues')
            .select('*')
            .eq('id', venueId)
            .single()

        if (venueError) {
            console.error('Error fetching venue:', venueError)
            return
        }

        // Check that the user's organisation ID is the same as this venue's organisation ID
        const organisation = await getCurrentOrganisationId()

        // If the user is not part of the same organisation as the venue, redirect to the venues
        if (organisation.organisationId !== venue.organisation_id) {
            navigate('/dashboard/venues')
        }
}

    return (
        <Card>
            <CardTitle>Hello</CardTitle>
        </Card>
    )
}

export default Venue