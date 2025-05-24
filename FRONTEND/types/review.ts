export interface Review {
  ID_review: number
  rating: number
  comment?: string
  likes?: any[]
  author?: {
    profile?: {
      username?: string
    }
  }
}