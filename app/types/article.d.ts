export interface ProfileResult {
  results: Profile[]
}

export interface Article {
  objectId: string
  title?: string
  lang: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  slug: string
  body: string
}
