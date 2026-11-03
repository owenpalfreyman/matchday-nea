import JoinOrgForm from '@/components/JoinOrgForm'
import getUserStatus from '@/lib/get-user-status'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const JoinOrg = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const checkUserStatus = async () => {
      const user = await getUserStatus()

      if (user) {
        navigate('/dashboard/organisations', { replace: true })
      }
    }

    checkUserStatus()
  }, [navigate])

  return <JoinOrgForm />
}

export default JoinOrg