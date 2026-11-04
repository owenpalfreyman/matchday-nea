import { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { supabase } from '@/lib/supabase'

type Request = {
  request_id: string
  organisation_id: string | null
  role: string | null
  league_id: string | null
  team_id: string | null
  status: string | null
}

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

      // Set requests so they can be used in the return
      setRequests((data ?? []) as Request[])
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
              <TableCell>{request.organisation_id}</TableCell>
              <TableCell>{request.role}</TableCell>
              <TableCell>{request.league_id ?? '-'}</TableCell>
              <TableCell>{request.team_id ?? '-'}</TableCell>
              <TableCell>{request.status}</TableCell>
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