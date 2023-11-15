'use strict';

import { Model } from 'sequelize';
import { PersonAttributes } from '../@types/person';
import bcrypt from '../utils/bcrypt';
import jwt from '../utils/jwt';
import { cloudinary } from '../utils/cloudinary';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config()

export = (sequelize: any, DataTypes: any) => {
    class Person extends Model<PersonAttributes>
        implements PersonAttributes {
        declare image: string;
        declare id: number;
        declare fullname: string;
        declare phone_number: string;
        declare email: string;
        declare password: string;
        declare created_at: string;
        static associate(models: any) {}
        static isAuthenticated = async (email: string, password: string) => {
            try {
                const user = await this.findOne({
                    where: {
                        email: email
                    }
                })


                const checkPassword = await bcrypt.decryptPassword(password, user?.password)

                const response: any = {
                    token: ''
                }

                if (user?.email == email && checkPassword) {
                    const token = jwt.createSession(user?.dataValues, process.env.SECRET_KEY)
                    const response: any = {
                        token: token
                    }
                    return response
                }

                return response

            } catch (error) {
                return error
            }
        }

        static personProfile = async (user: any) => {
            const findUser = await this.findOne({
                where: {
                    id: user?.id
                }
            })
            if (!findUser) {
                return {};
            }
            return findUser
        }

        static createPersonWithGoogle = async (body: any) => {
            try {
                const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
                const ticket = await client.verifyIdToken({
                    idToken: body?.credential,
                    audience: process.env.GOOGLE_CLIENT_ID
                })
                const payload = ticket.getPayload()
                const user = await this.findOne({
                    where: { email: payload?.email }
                })
                if(user) {
                    const token = jwt.createSession(user?.dataValues, process.env.SECRET_KEY)
                    const response: any = {
                        token: token
                    }
                    return response
                } else {
                    const data: any = {
                         email: payload?.email,
                         image: payload?.picture,
                         fullname: payload?.name,
                         password: '',
                         phone_number: ''
                    }
                    const response: any = await this.create({ ...data })
                    const user = await this.findOne({
                        where: { email: payload?.email }
                    })
                    if(response) {
                        const token = jwt.createSession(user?.dataValues, process.env.SECRET_KEY)
                        const tokenResponse: any = {
                            token: token
                        }
                        return  tokenResponse
                    }
                }
            } catch (error) {
                console.log(error)
                return error
            }
        }

        static createPerson = async (body: any) => {
            try {   
                const res = await cloudinary.v2.uploader.upload(body?.image?.path, {
                    upload_preset: 'dev'
                })
                const data: any = {
                    fullname: body?.fullname,
                    phone_number: body?.phone_number,
                    image: res.url,
                    email: body?.email,
                    password: await bcrypt.hashPassword(body?.password)
                }
                const response: any = await this.create({ ...data })
                return response
            } catch (error) {
                return error
            }
        }

        static updatePerson = async (body: any, id: string) => {
            try {
                const res = await cloudinary.v2.uploader.upload(body?.image?.path, {
                    upload_preset: 'dev'
                })
                const data: any = {
                   fullname: body?.fullname,
                   image: res.url
                }
                const response: any = await this.update({ ...data },{
                    where: {
                        id: id
                    }
                })
                return response
            } catch (error) {
                return error
            }
        }

    }
    Person.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Person',
        tableName: 'person',
        createdAt: false,
        updatedAt: false
    });
    return Person
}
