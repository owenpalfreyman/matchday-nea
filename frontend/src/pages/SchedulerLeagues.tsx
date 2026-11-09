import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import getOrganisationLeagues from '@/lib/get-organisation-leagues';
import getOrganisationId from '@/lib/get-current-organisation-id';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type League = {
    id: string;
    name: string;
};

const SchedulerLeagues = () => {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Function to fetch leagues for the current organisation
        async function fetchLeagues() {
            try {
                const { organisationId, role } = await getOrganisationId();

                // Check if the user has the 'admin' role, if not redirect to dashboard
                if (role !== 'admin') {
                    console.log(role);
                    return;
                }

                const organisationLeagues = await getOrganisationLeagues(organisationId);

                setLeagues((organisationLeagues ?? []) as League[]);
            } catch (error) {
                console.error('Error checking scheduler access:', error);
                setLeagues([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLeagues();
    }, [navigate]);

    return (
        <Card className="w-full max-w-lg p-6">
            <CardTitle>Your Leagues</CardTitle>
            <CardDescription>Select a league to open its scheduler.</CardDescription>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>League</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* If loading display a message */}
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center text-muted-foreground">
                                    Loading leagues...
                                </TableCell>
                            </TableRow>
                        ) : leagues.length === 0 ? (
                            // If the length is 0 display a message
                            <TableRow>
                                <TableCell colSpan={2} className="text-center text-muted-foreground">
                                    No leagues found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            // Map through the leagues and display them in the table
                            leagues.map((league) => (
                                <TableRow key={league.id}>
                                    <TableCell className="font-medium">{league.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild size="sm">
                                            <Link to={`/dashboard/scheduler/${league.id}`}>
                                                Open scheduler
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default SchedulerLeagues;
