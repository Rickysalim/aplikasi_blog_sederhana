'use strict';

import { Model } from 'sequelize';
import { WishListAttributes } from '../@types/wishlist';
import { Op } from 'sequelize';

export = (sequelize: any, DataTypes: any) => {
    class WishList extends Model<WishListAttributes>
        implements WishListAttributes {
        declare id: number;
        declare person_id: number;
        declare post_id: number;
        declare created_at: string;

        static associate(models: any) {
            models.WishList.belongsTo(models.Person, {
                foreignKey: "person_id"
            })
            models.WishList.belongsTo(models.Post, {
                foreignKey: "post_id"
            })
        }

        static deleteWishList = async (id: string) => {
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

        static createWishList = async (body: any) => {
            try {
                const checkWishList: any = await this.findOne({
                    where: {
                        [Op.and]: [
                            {person_id: body?.person_id},
                            {post_id: body?.post_id}
                        ]
                    }
                })
                if(checkWishList) {
                    return false
                }
                const response: any = await this.create({ ...body })
                return response
            } catch (error) {
                return error
            }
        }

        static findAllWishListByPerson = async (person_id: string, offset: any, limit: any, search: any) => {
            try {
                const { count, rows } = await this.findAndCountAll({
                    include: [
                        {
                            model: sequelize.models.Person,
                            as: 'Person',
                            attributes: ['fullname']
                        },
                        {
                            model: sequelize.models.Post,
                            as: 'Post',
                            attributes: ['id','title','content','created_at','image','description'],
                            where: {
                                title: {
                                    [Op.iLike]: `%${search}%`,
                                }
                            },
                            include: [
                                {
                                    model: sequelize.models.Person,
                                    as: 'Person',
                                    attributes: ['fullname']
                                }
                            ]
                        }
                    ],
                    where: {
                        person_id: person_id
                    },
                    offset: offset,
                    limit: limit,
                })
                const response: any = {
                    data: rows,
                    count: count
                }
                return response;
            } catch (error) {
                return error;
            }
        }

    }
    WishList.init({
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
        modelName: 'WishList',
        tableName: 'wishlist',
        createdAt: false,
        updatedAt: false
    })
    return WishList
}