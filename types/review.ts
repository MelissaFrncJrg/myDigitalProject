export interface Review {
  ID_review: number
  rating: number
  comment?: string
  likes?: any[]
  author?: {
    id?: number
    profile?: {
      username?: string
    }
  }
}