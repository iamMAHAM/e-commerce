import jwt, { JwtPayload } from "jsonwebtoken"

export const encode = (data: object, expire?: boolean): string => {
    const pass = process.env.JWTPASSWORD
    if (!pass) throw new Error('env JWTPASSWORD is required')
    const expiration = expire
        ? { expiresIn: 3600}
        : {}
    const signed = jwt.sign(data, pass, expiration)
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
    return encode({ur: Math.random()}, true)
}