import React from 'react'
import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params
  
  // 将所有根路径的 slug 重定向到 /posts/slug
  redirect(`/posts/${slug}`)
}
