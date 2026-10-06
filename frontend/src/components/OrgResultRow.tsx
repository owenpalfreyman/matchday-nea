import { Button } from './ui/button'
import type { Org } from '../types/organisation'

type OrgResultRowProps = {
  org: Org
}

// One search result
const OrgResultRow = ({ org }: OrgResultRowProps) => (
  <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
    <span className="truncate text-sm font-medium">{org.name}</span>
    <span className="text-2sm text-gray-500">ID: {org.id}</span>
    <Button size="sm">
      Request
    </Button>
  </div>
)

export default OrgResultRow