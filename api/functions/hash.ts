import bcrypt from "bcrypt"

export const hash = async (string: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    const hs = await bcrypt.hash(string, salt )
    return hs
}

export const comparePassword = (current: string, hashed: string, next:Function) => {
    bcrypt.compare(current, hashed, (err, isMatch) =>{
        if (err) return next(err)
        next(null, isMatch)
    })
}
