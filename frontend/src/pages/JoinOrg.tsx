import getLeagueTeams from '@/lib/get-league-teams'
import getOrganisationData from '@/lib/get-organisation-data'
import getOrganisationLeagues from '@/lib/get-organisation-leagues'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const JoinOrg = () => {
    const { orgId } = useParams<{ orgId: string }>()
    const navigate = useNavigate()

    useEffect(() => {
        // Get the data about the relevant organisation
        async function getData (orgId: string) {
            if (!orgId) {
                navigate('/organisations')
                return
            }

            // Call function which gets the organisation ID and name
            const organisation = await getOrganisationData(orgId)

            // If there is no organisation, rediret the user back to organisations
            if (!organisation) {
                navigate('/organisations', { replace: true })
                return
            }
            
            // Call function which gets the leagues
            const leagues = await getOrganisationLeagues(orgId)


            const teams = await Promise.all(
              leagues.map((league) => getLeagueTeams(league.id))
            )

            console.log("Organisation:", organisation)
            console.log("Leagues:", leagues)
            console.log("Teams:", teams)

        }

      void getData(orgId)
    }, [navigate, orgId])

  return (
    <div>JoinOrg</div>
  )
}

export default JoinOrg