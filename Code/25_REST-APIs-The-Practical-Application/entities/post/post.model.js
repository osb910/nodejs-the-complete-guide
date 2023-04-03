import {Schema, model} from 'mongoose';

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    creator: {
        name: {
            type: String,
            required: true,
        },
        // type: Schema.Types.ObjectId,
        // ref: 'User',
        // required: true,
    }
}, {timestamps: true});

const Post = model('Post', PostSchema);

export default Post;
