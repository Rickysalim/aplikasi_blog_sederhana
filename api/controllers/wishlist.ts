import { Request, Response } from 'express';
import { GetPublicKeyOrSecret, Secret } from 'jsonwebtoken';
import db from '../models';
import jwt from '../utils/jwt';

const deleteWishList = async (req: Request, res: Response) => {
    try {
        const result = await db.WishList.deleteWishList(req.params.id);
        if (result === null) {
            return res.status(404).json(result)
        }
        return res.status(200).json(result)
    } catch (error) {
        console.info(error)
    }
}

const createWishList = async (req: Request, res: Response) => {
    try {
        const result = await db.WishList.createWishList(req.body);
        if (!result) {
            return res.status(400).json({
                status: 400,
                message: "Wishlist already available"
            })
        }
        return res.status(200).json(result)
    } catch (error) {
        console.info(error)
    }
}

const getWishList = async (req: Request, res: Response) => {
    try {
        const { offset, limit, search } = req.query
        const token = <string>req?.headers['authorization']?.split("Bearer ")[1]
        const secretKey = <Secret | GetPublicKeyOrSecret>process.env.SECRET_KEY || '';
        const user: any = jwt.decodedToken(token, secretKey)
        const result = await db.WishList.findAllWishListByPerson(user?.id, offset, limit, search);
        if (result === null) {
            return res.status(404).json(result)
        }
        return res.status(200).json(result)
    } catch (error) {
        console.info(error)
    }
}

export default { getWishList, createWishList, deleteWishList }