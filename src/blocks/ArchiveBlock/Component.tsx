import React from 'react'

import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, introContent, selectedDocs } = props

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
      {introContent && (
        <div className="container mb-16">
          <div className="prose dark:prose-invert max-w-none">
            {introContent}
          </div>
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  )
}
