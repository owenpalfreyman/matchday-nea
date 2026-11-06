import JoinOrgForm from '@/components/JoinOrgForm'
import ViewMyRequests from '@/components/ViewMyRequests'
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

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <JoinOrgForm />
      <ViewMyRequests />
    </main>
  )
}

export default JoinOrg