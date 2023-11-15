import { Request, Response } from 'express';
import { GetPublicKeyOrSecret, Secret } from 'jsonwebtoken';
import jwt from '../utils/jwt';
import db from '../models';
import dotenv from 'dotenv';
dotenv.config();

const findPerson = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        const result = await db.Person.isAuthenticated(email, password)
        if(!result.token) {
            return res.status(401).json({
                status: 401,
                message: 'failed to login'
            }) 
        }
        return res.status(200).json(result)
    } catch (error) {
        console.info(error)
    }
}

const profilePerson = async (req: Request, res: Response) => {
    try {
        const token = <string>req?.headers['authorization']?.split("Bearer ")[1];
        const secretKey = <Secret | GetPublicKeyOrSecret>process.env.SECRET_KEY || '';
        const user = jwt.decodedToken(token, secretKey);
        const findUser = await db.Person.personProfile(user);
        return res.status(200).json(findUser)
    } catch (error: any) {
        if(error) {
            return res.status(404).json({
                status: 404,
                message: error?.message
            })
        }
    }
}

const createPersonWithGoogle = async (req: Request, res: Response) => {
    try {
        const result = await db.Person.createPersonWithGoogle(req.body)
        return res.status(200).json(result);
    } catch (error) {
        console.info('ini', error)
    }
}

const createPerson = async (req: Request, res: Response) => {
    try {
        const result = await db.Person.createPerson(req.body)
        return res.status(200).json(result);
    } catch (error) {
        console.info(error)
    }
}

const updatePerson = async (req: Request, res: Response) => {
    try {
        const token = <string>req?.headers['authorization']?.split("Bearer ")[1]
        const secretKey = <Secret | GetPublicKeyOrSecret>process.env.SECRET_KEY || '';
        const user: any = jwt.decodedToken(token, secretKey)
        const findUser = await db.Person.personProfile(user)
        const result = await db.Person.updatePerson(req.body, findUser?.id)
        return res.status(200).json(result);
    } catch (error) {
        console.info(error)
    }
}

export default {findPerson, createPerson, profilePerson, updatePerson, createPersonWithGoogle}