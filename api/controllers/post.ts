import { Request, Response } from 'express';
import { GetPublicKeyOrSecret, Secret } from 'jsonwebtoken';
import db from '../models';
import jwt from '../utils/jwt';

const findAllPost = async (req: Request, res: Response) => {
    try {
        const { offset, limit, search } = req.query
        const result = await db.Post.findAndCountAllPost(offset, limit, search)
        if (result === null) {
            return res.status(404).json(result)
        }
        return res.status(200).json(result)
    } catch (error) {
        console.info(error)
    }
}

const findOnePost = async (req: Request, res: Response) => {
    try {
        const { title } = req.params
        console.info(title)
        const result = await db.Post.findAndCountOnePost(title);
        if (result === null) {
            return res.status(404).json(result)
        }
        return res.status(200).json(result)
    } catch (error) {
        console.info(error)
    }
}

const createPost = async  (req: Request, res: Response) => {
    try {
        const token = <string>req?.headers['authorization']?.split("Bearer ")[1]
        const secretKey = <Secret | GetPublicKeyOrSecret>process.env.SECRET_KEY || '';
        const user: any = jwt.decodedToken(token, secretKey)
        console.log(req.body)
        const data = {
             person_id: user?.id,
             title: req?.body?.title,
             content: req?.body?.content,
             image: req?.body?.image,
             description: req?.body?.description
        }
        const response: any = await db.Post.createPost(data)
        if(response?.errors) {
            return res.status(400).json({
                status: 400,
                message: response?.errors[0].message
            });
        } else {
            return res.status(200).json(response);
        }
    } catch (error) {
        console.info(error)
        return res.status(500).json(error)
    }
}

const updatePost = async (req:Request, res: Response) => {
    try {
        const response: any = await db.Post.updatePost(req.body,req.params.id)
        if(response?.errors) {
            return res.status(400).json({
                status: 400,
                message: response?.errors[0].message
            });
        } else {
            return res.status(200).json(response);
        }
    } catch(error) {
        console.info(error)
    }
}

const deletePost = async (req: Request, res: Response) => {
    try {
        const response: any = await db.Post.destroyPost(req.params.id)
        if(response?.errors) {
            return res.status(400).json({
                status: 400,
                message: response?.errors[0].message
            });
        } else {
            return res.status(200).json(response);
        }
    } catch(error) {
        console.info(error)
    }
}




export default { findAllPost, findOnePost, createPost, updatePost, deletePost }

