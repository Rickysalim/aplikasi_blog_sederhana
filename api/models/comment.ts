'use strict';

import { Model, QueryTypes } from 'sequelize';
import db from '.';
import { CommentAttributes } from '../@types/comment';

export = (sequelize: any, DataTypes: any) => {
    class Comment extends Model<CommentAttributes>
        implements CommentAttributes {
        declare id: number;
        declare post_id: number;
        declare person_id: number;
        declare comment: string;
        declare created_at: string;
        declare parent_id: number;

        static associate(models: any) {
            Comment.belongsTo(models.Post, {
                foreignKey: 'post_id'
            })
            Comment.belongsTo(models.Person, {
                foreignKey: 'person_id'
            })
            Comment.hasMany(models.Comment, {
                foreignKey: 'parent_id'
            })
        }

        static commentReplies = async (post_id: string) => {
            const comment = await sequelize.query(`
            SELECT
                c.id,
                c.post_id,
                c.person_id,
                p.image,
                p.fullname,
                c."comment",
                c.created_at,
                c.parent_id,
                replies
            FROM
                "comment" c
            LEFT JOIN 
            (SELECT
                parent_id,
                COALESCE(json_agg(row_to_json(
                (SELECT "column" FROM 
                (SELECT 
                replies.id, replies.post_id, replies.person_id, p.fullname, p.image,replies."comment", replies.created_at, replies.parent_id) 
                AS "column"))), '[]'::JSON) AS replies
            FROM
                "comment" AS replies
            LEFT JOIN person p ON  p.id = replies.person_id
            GROUP BY
                parent_id) 
                AS replies ON c.id = replies.parent_id
            LEFT JOIN person p ON  p.id = c.person_id
            LEFT JOIN post p2 ON p2.id = c.post_id 
            WHERE
                c.parent_id IS NULL
            AND 
                c.post_id = ?`, {
                type: QueryTypes.SELECT,
                model: db.Comment,
                mapToModel: true,
                replacements: [post_id]
            });

            const count = await this.count({
                where: {
                    post_id: post_id
                }
            })

            const response: any = {
                data: comment,
                count: count
            }

            return response;
        }

        

        static findOneComment = async (id: string) => {
            try {
                const response = await this.commentReplies(id)
                return response;
            } catch (error) {
                return error
            }
        }

        static createComment = async (body: any) => {
            try {
                const response: any = await this.create({ ...body })
                return response;
            } catch (error) {
                return error
            }
        }

        static deleteCommentParent = async (id: string, parent_id: string) => {
            try {
                await this.destroy({
                    where: {
                        parent_id: parent_id
                    }
                }).then(async () => {
                    const response: any = await this.destroy({
                        where: {
                            id: id
                        }
                    })
                    return response
                })
            } catch (error) {
                return error
            }
        }

        static deleteComment = async (id: string) => {
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

        static updateComment = async (body: object, id: string) => {
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
}
Comment.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Post",
            key: "id",
        }
    },
    person_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Person",
            key: "id",
        }
    },
    comment: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.STRING,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Comment",
            key: "id",
        }
    },
}, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comment',
    createdAt: false,
    updatedAt: false
})
return Comment
}