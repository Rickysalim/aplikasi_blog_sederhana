import { Request, Response, NextFunction } from 'express';
import jwt from '../utils/jwt';

const checkToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = <string>req.headers["authorization"]?.split("Bearer ")[1]
        const jwtPayload = <any>jwt.jwtVerify(token, process.env.SECRET_KEY || '');
        if(jwtPayload) {
            return next()
        }       
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: "unauthorized"
        })
    }
}

export default { checkToken }