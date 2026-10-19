import React, { useEffect, useState } from 'react'
import getOrganisationId from '../lib/get-current-organisation-id'
import { supabase } from '@/lib/supabase'

const VenueList = () => {
  // Set useStates
  const [organisationId, setOrganisationId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    // Function to load the venues from the venues table with the matching org ID
    async function loadVenues() {
      // Get the organisation ID from the helper function
      const organisation = await getOrganisationId()
      // Set variable so it can be used for the select this render
      const currentOrganisationId = organisation.organisationId

      if (!mounted) return

      // Set org ID
      setOrganisationId(currentOrganisationId)

      // Select the venues with the matching organisation ID
      const { data: venues, error: venuesError } = await supabase
        .from("venues")
        .select("*")
        .eq("organisation_id", currentOrganisationId)

        // Error handling
      if (venuesError) {
        console.error("Error fetching venues.", venuesError)
        return
      }

      
      if (mounted) {
        console.log(venues)
      }
    }

    loadVenues()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div>{organisationId}</div>
  )
}

export default VenueList