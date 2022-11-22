import jwt, { JwtPayload } from "jsonwebtoken"

export const encode = (data: object): string =>{
    const pass = process.env.JWTPASSWORD
    if (!pass) throw new Error('env JWTPASSWORD is required')
    const signed = jwt.sign(data, pass)
    return signed
}

export const decode = (data: string) : JwtPayload | Boolean | string => {
    const pass = process.env.JWTPASSWORD
    if (!pass) throw new Error('env JWTPASSWORD is required')
    try {
        return jwt.verify(data, pass)
    } catch (e){
        return false
    }
}

export const accessToken = (): string => {
    return encode({ur: Math.random()})
}