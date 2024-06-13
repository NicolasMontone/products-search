import { ObjectId } from 'mongodb'

export type Product = {
  _id: ObjectId
  title: string
  description: string
  price: number
  embedding: number[]
  image: string
  url: string
}
