import { Request, Response } from 'express';
import { Secret, GetPublicKeyOrSecret } from 'jsonwebtoken';
import db from '../models';
import jwt from '../utils/jwt';

const countLike = async (req: Request, res: Response) => {
    try {
        const result = await db.Like.countLike(req.params.post_id)
        return res.status(200).json({
            like: result
        })
    } catch (error) {
        console.info(error)
    }
}

const checkPersonLike = async (req: Request, res: Response) => {
    try {
        const token = <string>req?.headers['authorization']?.split("Bearer ")[1]
        const secretKey = <Secret | GetPublicKeyOrSecret>process.env.SECRET_KEY || '';
        const user: any = jwt.decodedToken(token, secretKey)
        const result = await db.Like.checkPersonLike(user?.id, req.params.post_id)
        return res.status(200).json({
            is_like: result
        });
    } catch (error) {
        console.info(error)
    }
}

const createLike = async (req: Request, res: Response) => {
    try {
        const token = <string>req?.headers['authorization']?.split("Bearer ")[1]
        const secretKey = <Secret | GetPublicKeyOrSecret>process.env.SECRET_KEY || '';
        const user: any = jwt.decodedToken(token, secretKey)
        const result = await db.Like.createLike(user?.id, req.body.post_id)
        console.log(result)
        return res.status(200).json(result);
    } catch (error) {
        console.info(error)
    }
}

export default { createLike, checkPersonLike, countLike }
