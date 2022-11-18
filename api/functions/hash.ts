import bcrypt from "bcrypt"

const hash = async (string: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    const hs = await bcrypt.hash(string, salt )
    return hs
}

export default hash