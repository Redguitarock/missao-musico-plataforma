'use client'

import { EbookBuilder } from '@/modules/builder'

export default function BuilderPage({ user }: { user?: any }) {
  return <EbookBuilder user={user} />
}
