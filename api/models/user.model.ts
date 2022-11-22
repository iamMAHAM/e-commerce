import { Schema, model } from "mongoose";
import validator from "validator";
import { comparePassword, hash } from "../functions/hash";

export interface iUser {
    fullname: string,
    username: string,
    email: string,
    password: string,
    birthday: Date,
    carts?: object[]
}

interface iUserMethods {
    validatePassword(password: string): Promise<Boolean>
}

const uSchema = new Schema<iUser, {}, iUserMethods>({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        minLength: [4, 'Minimum 4 caracteres.'],
        maxLength: [16, 'Maximum 16 caracteres.'],
        validate: {
            validator: (v: string) => validator.isAlpha(v, 'fr-FR'),
            message: 'Only letter are allowed'
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
    birthday: {
        type: Date,
        // required: [true, 'missing birthday date']
    },
    carts: {
        type: [Object],
        require: false,
    }
}, {
    timestamps: true
})

uSchema.pre('save', async function (next: Function){
    try{
        const user = this
        if (!user.isModified('password')) return next()
        this.password = await hash(this.password!)
        return next()
    } catch(e: unknown){
        return next(e)
    }
})

uSchema.methods.validatePassword = async function (password: string): Promise<Boolean>{
    const isValid = await comparePassword(password, this.password)
    return isValid
        ? true
        : false
}

export default model('User', uSchema)