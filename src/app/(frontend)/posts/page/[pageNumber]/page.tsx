import type { Metadata } from 'next/types'
import { redirect } from 'next/navigation'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  redirect('/posts')
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Posts - SiJiGPT',
  }
}

export async function generateStaticParams() {
  return []
}
