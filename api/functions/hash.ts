import bcrypt from 'bcrypt'

export const hash = async (string: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  const hs = await bcrypt.hash(string, salt)
  return hs
}

export const comparePassword = async (
  current: string,
  hashed: string
): Promise<boolean | null> => {
  return await bcrypt.compare(current, hashed)
}
