import ModifyFixtureSchedule from '@/components/ModifyFixtureSchedule'
import { useParams } from 'react-router-dom'

const ChangeFixtureInfo = () => {
    // Get fixtureId from the URL parameters
    const { fixtureId } = useParams<{ fixtureId: string }>()

    if (!fixtureId) return <p>Fixture not found.</p>

	return (
        <ModifyFixtureSchedule fixtureId={fixtureId} />
    )
}

export default ChangeFixtureInfo
