import { model, Schema } from 'mongoose'

interface IProduct {
  title: string
  category: Schema.Types.ObjectId
  description: string
  price: number
}

const pSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
})

export default model('Product', pSchema)
