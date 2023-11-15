import { Request, Response } from 'express';
import db from '../models';

const findOneComment = async (req: Request, res: Response) => {
    try {
        const response: any = await db.Comment.findOneComment(req.params.id)
        if(response?.errors) {
            return res.status(400).json({
                status: 400,
                message: response?.errors[0].message
            });
        } else {
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error)
        console.info(error)
    }
}

const createComment = async (req: Request, res: Response) => {
    try {
        const response: any = await db.Comment.createComment(req.body)
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
    }
}



const deleteComment = async (req: Request, res: Response) => {
    try {
        const response: any = await db.Comment.deleteComment(req.params.id)
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
    }
}

const deleteCommentParent = async (req: Request, res: Response) => {
    try {
        const response: any = await db.Comment.deleteCommentParent(req.params.id, req.params.parent_id)
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
    }
}

const updateComment = async(req: Request, res: Response) => {
    try {
        const response: any = await db.Comment.updateComment(req.body,req.params.id)
        if(response?.errors) {
            return res.status(400).json({
                status: 400,
                message: response?.errors[0].message
            });
        } else {
            return res.status(200).json(response);
        }
    } catch (error) {
        
    }
}

export default { createComment, deleteComment, updateComment, findOneComment, deleteCommentParent }