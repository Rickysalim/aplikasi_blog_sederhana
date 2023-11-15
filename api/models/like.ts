'use strict';

import { Model } from 'sequelize';
import { LikeAttributes } from '../@types/like';
import { Op } from "sequelize";

export = (sequelize: any, DataTypes: any) => {
    class Like extends Model<LikeAttributes>
        implements LikeAttributes {
        declare id: number;
        declare person_id: number;
        declare post_id: number;
        declare created_at: string;
        static associate(models: any) {
            models.Like.belongsTo(models.Person, {
               foreignKey: "person_id"
            })
            models.Like.belongsTo(models.Post, {
                foreignKey: "post_id"
            })
        }

        static countLike = async(post_id: string) => {
             try {
                const like = await this.count({
                    where: {
                        post_id: post_id
                    }
                })
                return like;
             } catch (error) {
                return error
             }
        }

        static checkPersonLike = async (person_id: string, post_id: string) => {
            try {
                const checkPerson = await this.findOne({
                    where: {
                        [Op.and]: [
                            {person_id: person_id},
                            {post_id: post_id}
                        ]
                    }
                }) 
                if(checkPerson) {
                    return true
                } else {
                    return false
                }
            } catch (error) {
                return error
            }
        }

        static createLike = async (person_id: string, post_id: string) => {
            try {
                console.log(post_id)
                const checkPerson = await this.findOne({
                    where: {
                        [Op.and]: [
                            {person_id: person_id},
                            {post_id: post_id}
                        ]
                    }
                }) 
                const value: any = {
                    person_id: person_id,
                    post_id: post_id
                }
                if(!checkPerson) {
                   const result = await this.create({ ...value })
                   return result
                } else {
                    const result = await this.destroy({
                        where: {
                            id: checkPerson?.id
                        }
                    })
                    return result
                }
            } catch (error) {
                return error
            }
           
        }
    }
    Like.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        person_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Person",
                key: "id",
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Post",
                key: "id",
            }
        },
        created_at: {
            type: DataTypes.STRING,
        }
    }, {
        sequelize,
        modelName: 'Like',
        tableName: 'like',
        createdAt: false,
        updatedAt: false
    })
    return Like
}