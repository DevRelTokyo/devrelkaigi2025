export interface Profile {
  objectId: string
  socials: string
  user: string
  name: string
  image_url: string
  profile: string
  organization: string
  slug: string
  lang: string
  createdAt: string
  updatedAt: string
  email: string
  ACL: string
  title: string
  image_file: string
  username: string
  x: string
  github: string
  facebook: string
}

export interface Workshop {
  id: string
  name: string
  company: string
  session_title: string
  description: string
  audiences: string
  points: string
  timeline: string
  category: string
  start_at: string
  time: string
  user: string
  profile?: Profile;
}
