import bcrypt from "bcrypt";

const hashPassword = (password: string) => {
    const isValid = bcrypt.hash(password, 10)
    return isValid
}

const decryptPassword = (password: string, encryptPassword: any) => {
    const isValid = bcrypt.compare(password, encryptPassword)
    return isValid
}

export default { decryptPassword, hashPassword}