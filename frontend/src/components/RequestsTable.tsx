import { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
import getOrganisationId from '@/lib/get-current-organisation-id'
import { supabase } from '@/lib/supabase'
import { getLeagueName, getOrganisationName, getTeamName } from '@/lib/convert-ids-names'

// TODO: Function to comvert IDs to names

type JoinRequest = {
    id: string
    role: string
    organisation_id: string
    league_id: string | null
    team_id: string | null
    profiles: { display_name: string; email: string } | null
    organisation_name: string | null
    league_name: string | null
    team_name: string | null
}

const RequestsTable = () => {
    const [requests, setRequests] = useState<JoinRequest[]>([])

    useEffect(() => {
        // Fetch and load the requests from the table
        async function loadRequests() {
            const { organisationId } = await getOrganisationId()

            const { data, error } = await supabase
                .from("requests")
                .select("id, role, league_id, team_id, profiles(display_name, email)")
                .eq("organisation_id", organisationId)
                .eq("status", "pending")

            // Error handling
            if (error) {
                console.error("Error fetching requests", error)
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

            // Set requests
            setRequests(requestsWithNames as unknown as JoinRequest[])
        }

        // Call the function
        loadRequests()
    }, [])

    
    async function updateStatus(id: string, status: "accepted" | "rejected") {
        const { error } = await supabase
            .from("requests")
            .update({ status })
            .eq("id", id)

        if (error) {
            console.error("Error updating request", error)
            return
        }

        // No longer pending, so drop it from the list
        setRequests((prev) => prev.filter((r) => r.id !== id))
    }

    return (
        <Card>
            <CardContent>
                <Table>
                    <TableCaption>A list of people requesting to join your organisation</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>League</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5}>No pending requests</TableCell>
                            </TableRow>
                        ) : (
                            requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>{request.profiles?.email}</TableCell>
                                    <TableCell>{request.role ? request.role.charAt(0).toUpperCase() + request.role.slice(1) : '-'}</TableCell>
                                    <TableCell>{request.league_name ?? '-'}</TableCell>
                                    <TableCell>{request.team_name ?? '-'}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button size="sm" onClick={() => updateStatus(request.id, "accepted")}>Accept</Button>
                                        <Button size="sm" variant="outline" onClick={() => updateStatus(request.id, "rejected")}>Reject</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default RequestsTable