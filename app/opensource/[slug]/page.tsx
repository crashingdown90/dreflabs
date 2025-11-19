import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import RepositoryDetail from '@/components/opensource/RepositoryDetail'
import repositories from '@/content/data/repositories.json'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return repositories.map((repo) => ({
    slug: repo.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const repo = repositories.find((r) => r.slug === params.slug)

  if (!repo) {
    return {
      title: 'Repository Not Found',
    }
  }

  return {
    title: `${repo.name} | Open Source - Dref Labs`,
    description: repo.description,
    keywords: repo.tags,
    openGraph: {
      title: repo.name,
      description: repo.description,
      images: [repo.coverImage],
    },
  }
}

export default function RepositoryPage({ params }: Props) {
  const repo = repositories.find((r) => r.slug === params.slug)

  if (!repo) {
    notFound()
  }

  return <RepositoryDetail repository={repo} />
}

