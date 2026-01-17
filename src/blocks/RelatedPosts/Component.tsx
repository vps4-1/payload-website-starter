import type { Post } from '@/payload-types'

import { Card } from '@/components/Card'
import React from 'react'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: any
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { docs, introContent } = props

  return (
    <div className="container">
      {introContent && <div>{introContent}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          const docWithCategories = {
            ...doc,
            categories: []
          }

          return <Card key={index} doc={docWithCategories} relationTo="posts" showCategories />
        })}
      </div>
    </div>
  )
}
