import { Button } from './ui/button'
import type { Org } from '../types/organisation'

type OrgResultRowProps = {
  org: Org
  onRequest: (orgId: string) => void
}

// One search result. The Request / Pending / Member variants will live here later.
const OrgResultRow = ({ org, onRequest }: OrgResultRowProps) => (
  <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
    <span className="truncate text-sm font-medium">{org.name}</span>
    <Button size="sm" onClick={() => onRequest(org.id)}>
      Request
    </Button>
  </div>
)

export default OrgResultRow