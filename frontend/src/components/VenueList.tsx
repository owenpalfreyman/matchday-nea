import React, { useEffect, useState } from 'react'
import getOrganisationId from '../lib/get-current-organisation-id'
import { supabase } from '@/lib/supabase'

const VenueList = () => {
  const [organisationId, setOrganisationId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadVenues() {
      const organisation = await getOrganisationId()
      const currentOrganisationId = organisation.organisationId

      if (!mounted) return

      setOrganisationId(currentOrganisationId)

      const { data: venues, error: venuesError } = await supabase
        .from("venues")
        .select("*")
        .eq("organisation_id", currentOrganisationId)

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