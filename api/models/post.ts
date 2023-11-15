'use strict';

import { Model, Op } from 'sequelize';
import { PostAttributes } from '../@types/post';
import { cloudinary } from '../utils/cloudinary';

export = (sequelize: any, DataTypes: any) => {
    class Post extends Model<PostAttributes> 
    implements PostAttributes {
        declare id: number;
        declare person_id: number;
        declare title: string;
        declare content: string;
        declare created_at: string;
        declare image: string;
        declare description: string;
        static associate(models: any) {
             models.Post.belongsTo(models.Person, {
                foreignKey: "person_id"
             })
        }


        static findAndCountAllPost = async (offset: any, limit: any, search: any) => {
            try {
                const { count, rows } = await this.findAndCountAll({
                    order: [
                        ["created_at", "DESC"]
                    ],
                    include: [
                        {
                            model: sequelize.models.Person,
                            as: 'Person',
                            attributes: ['fullname']
                        }
                    ],
                    where: {
                        title: {
                            [Op.iLike]: `%${search}%`,
                        },
                    },
                    attributes: ['id', 'person_id', 'title', 'created_at', 'image', 'description'],
                    offset: offset,
                    limit: limit,
                })
                const response: any = {
                    data: rows,
                    count: count
                }
                return response
            } catch (error) {
                return error
            }
        }
        
        static findAndCountOnePost = async (title: string) => {
            try {
                const rows = await this.findOne({
                    include: [
                        {
                            model: sequelize.models.Person,
                            as: 'Person',
                            attributes: ['fullname']
                        },
                    ],
                    where: {
                        title: {
                            [Op.iLike]: `%${title}%`,
                        },
                    },
                })
                if (!rows) {
                    return {
                        data: null
                    }
                }
                if(rows) {
                    const response: any = {
                        data: rows
                    }
                    return response
                }
            } catch (error) {
                return error
            }
        }
        
        static createPost = async (body: any) => {
            try {
                const res = await cloudinary.v2.uploader.upload(body?.image?.path, {
                    upload_preset: 'dev'
                })
                const data: any = {
                    person_id: body?.person_id,
                    title: body?.title,
                    content: body?.content,
                    created_at: body?.created_at,
                    image: res.url,
                    description: body?.description
                }
                const response: any = await this.create({ ...data })
                return response
            } catch (error) {
                return error
            }
        }
        
        static updatePost = async (body: object, id: string | number) => {
            try {
                const response: any = await this.update({ ...body }, {
                    where: {
                        id: id
                    }
                })
                return response
            } catch (error) {
                return error
            }
        }
        
        static destroyPost = async (id: string | number) => {
            try {
                const response: any = await this.destroy({
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
    Post.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        person_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Person",
                key: "id",
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Post',
        tableName: 'post',
        createdAt: false,
        updatedAt: false
    })
    return Post
}