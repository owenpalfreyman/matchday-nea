import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
import { TrashIcon } from 'lucide-react'

type CurrentLeagueBlackouts = {
    leagueId: string
}

type BlackoutWindow = {
    id: string
    league_id: string
    start_date: string
    end_date: string
    description: string
}

const CurrentLeagueBlackouts = ({ leagueId }: CurrentLeagueBlackouts) => {
    const [blackoutWindows, setBlackoutWindows] = useState<BlackoutWindow[]>([])
    
        // Function to load the current league's blackout dates
        async function loadBlackouts() {
            const { data, error: blackoutsError } = await supabase
                .from("league_blackouts")
                .select("*")
                .eq("league_id", leagueId) // Filter only for the league with the ID
    
            if (blackoutsError) {
                console.log("Error getting the blackout windows for this venue.", blackoutsError)
            }
    
            // If there is no data, save an empty list
            setBlackoutWindows(data ?? [])
        }
    
        // Function to delete a blackout window
        async function deleteBlackouts(id: string) {
            const { data, error: deleteBlackoutError } = await supabase
                .from("league_blackouts")
                .delete()
                .eq("id", id)
    
            if (deleteBlackoutError) {
                console.error("Error deleting a window of unavailability")
                return
            }
    
            // Remove the deleted row from local state so the table re-renders
            setBlackoutWindows((current) => current.filter((slot) => slot.id !== id))
        }
    
        useEffect(() => {
            loadBlackouts()
        }, [leagueId])

  return (
    <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">This League's Blackout Windows</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption className="sr-only">League's Blackout Windows</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {/* If there are currently no blackout windows */}
                    {blackoutWindows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                                No blackout windows added yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        blackoutWindows.map((slot) => (
                            <TableRow key={slot.id}>
                                <TableCell>{slot.start_date}</TableCell>
                                <TableCell>{slot.end_date}</TableCell>
                                <TableCell>{slot.description}</TableCell>
                                <TableCell className="text-right">
                                    <Button onClick={() => deleteBlackouts(slot.id)}>
                                        <TrashIcon />
                                    </Button>
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

export default CurrentLeagueBlackouts