export interface ProfileResult {
  results: Profile[]
}

export interface Profile {
  objectId: string
  socials?: string[]
  name: string
  organization?: string
  title?: string
  email?: string
  profile?: string
  lang: string
	image_url?: string
  user: User
  createdAt: string
  updatedAt: string
  image_file?: ImageFile
  slug: string
  ACL: Acl
}

export interface User {
  __type: string
  className: string
  objectId: string
}

export interface ImageFile {
  __type: string
  name: string
  url: string
}

export interface Acl {
	[key: string]: {
		read?: boolean;
		write?: boolean;
	}
}
