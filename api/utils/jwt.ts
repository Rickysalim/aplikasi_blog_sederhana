import jwt, { GetPublicKeyOrSecret, Secret } from 'jsonwebtoken';

const createSession = (payload: any, config: any) => {
    const token = jwt.sign(payload, config, { expiresIn: '24h' })
    return token;
}

const decodedToken = (token: string, secretKey: Secret | GetPublicKeyOrSecret) => {
    const decoded = jwt.verify(token, secretKey)
    return decoded;
}

const jwtVerify = (token: string, secretKey: Secret | GetPublicKeyOrSecret) => {
    const verify = jwt.verify(token, secretKey)
    return verify;
}

export default { createSession, decodedToken,  jwtVerify }