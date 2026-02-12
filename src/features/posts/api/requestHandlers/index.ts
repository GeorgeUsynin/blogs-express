import { getAllPostsHandler } from './getAllPostsHandler';
import { getPostByIdHandler } from './getPostByIdHandler';
import { createPostHandler } from './createPostHandler';
import { updatePostByIdHandler } from './updatePostByIdHandler';
import { deletePostByIdHandler } from './deletePostByIdHandler';
import { getAllCommentsByPostIdHandler } from './getAllCommentsByPostIdHandler';
import { createCommentByPostIdHandler } from './createCommentByPostIdHandler';

export {
    getAllPostsHandler,
    getAllCommentsByPostIdHandler,
    getPostByIdHandler,
    createCommentByPostIdHandler,
    createPostHandler,
    updatePostByIdHandler,
    deletePostByIdHandler,
};
