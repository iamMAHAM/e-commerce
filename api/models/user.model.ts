import { Schema, model } from "mongoose";
import validator from "validator";

const uSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: [true, 'username already taken !'],
        minLength: [4, 'username : Minimum 4 caracteres.'],
        maxLength: [16, 'username: Maximum 16 caracteres.'],
        validate: {
            validator: (v: string) => validator.isAlpha(v, 'fr-FR'),
            message: 'username: Only letter are allowed'
        }
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,
        validate: {
            validator: (v: string) => validator.isEmail(v),
            message: 'invalid email address'
        }
    },
    password: {
        type: String,
        require: [true, 'password is required'],
        validate: {
            validator: (v: string) => validator.isStrongPassword(v),
            message: 'password is not strong'
        }
    },
    carts: {
        type: Array,
        require: false,
        default: []
    }
}, {
    timestamps: true
})

uSchema.pre('save', function (next: Function){
    const user = this
    if (!user.isModified('password')) return next()


})

export default model('User', uSchema)