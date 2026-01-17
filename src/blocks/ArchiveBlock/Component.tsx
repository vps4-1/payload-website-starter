import React from 'react'

import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import { CollectionArchive } from '@/components/CollectionArchive'
import type { CardPostData } from '@/components/Card'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, selectedDocs } = props

  const posts: CardPostData[] = (selectedDocs || [])
    .map((doc) => {
      if (typeof doc.value === 'object' && doc.value !== null) {
        return {
          ...doc.value,
          categories: []
        } as CardPostData
      }
      return null
    })
    .filter((post): post is CardPostData => post !== null)

  return (
    <div className="my-16" id={`block-${id}`}>
      <CollectionArchive posts={posts} />
    </div>
  )
}
