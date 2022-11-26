import { model, Schema } from 'mongoose'

interface IFavorite {
  items: object[]
  userId: Schema.Types.ObjectId
}

const favoriteSchema = new Schema<IFavorite>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: String,
      price: Number,
    },
  ],
})

export default model('Cart', favoriteSchema)
