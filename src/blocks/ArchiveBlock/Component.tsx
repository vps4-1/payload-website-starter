import React from 'react'

import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, selectedDocs } = props

  const posts = (selectedDocs || []).map((doc) => {
    if (typeof doc.value === 'object' && doc.value !== null) {
      return {
        ...doc.value,
        categories: []
      }
    }
    return null
  }).filter(Boolean)

  return (
    <div className="my-16" id={`block-${id}`}>
      <CollectionArchive posts={posts} />
    </div>
  )
}
