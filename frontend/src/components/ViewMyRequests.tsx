import { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { supabase } from '@/lib/supabase'
import { getLeagueName, getOrganisationName, getTeamName } from '@/lib/convert-ids-names'

type Request = {
  request_id: string
  organisation_id: string | null
  role: string | null
  league_id: string | null
  team_id: string | null
  status: string | null
  organisation_name: string | null
  league_name: string | null
  team_name: string | null
}

// TODO: Add a button to cancel a request, which will delete the request from the database and update the table accordingly.
// TODO: Styling

const ViewMyRequests = () => {
  const [requests, setRequests] = useState<Request[]>([])

  useEffect(() => {
    // Function to fetch the user's requests from the database
    async function fetchRequests() {
      const { data: authData, error: authError } = await supabase.auth.getUser()

      // Auth error handling
      if (authError || !authData.user) {
        console.error('Error fetching authenticated user:', authError)
        return
      }

      // Get the user's requests
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("profile_id", authData.user.id)
 
      if (error) {
        console.error('Error fetching requests:', error)
        return
      }

      // Convert the IDs to names for each request
      const requestsWithNames = await Promise.all(
        (data ?? []).map(async (request) => ({
          ...request,
          organisation_name: request.organisation_id ? await getOrganisationName(request.organisation_id) : null,
          league_name: request.league_id ? await getLeagueName(request.league_id) : null,
          team_name: request.team_id ? await getTeamName(request.team_id) : null,
        }))
      )

      // Set requests so they can be used in the return
      setRequests(requestsWithNames as Request[])
    }

    void fetchRequests()
  }, [])

  return (
    <Table>
      <TableCaption>A list of your requests</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Organisation</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>League</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length > 0 ? (
          requests.map((request) => (
            <TableRow key={request.request_id}>
              <TableCell>{request.organisation_name}</TableCell>
              <TableCell>{request.role ? request.role.charAt(0).toUpperCase() + request.role.slice(1) : '-'}</TableCell>
              <TableCell>{request.league_name ?? '-'}</TableCell>
              <TableCell>{request.team_name ?? '-'}</TableCell>
              <TableCell>{request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : '-'}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>No requests found.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default ViewMyRequests