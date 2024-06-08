import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false
    },
    avatarImage: {
        type: String,
        default: ""
    },
    sentRequests: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
            sentAt: { type: Date, default: Date.now }
        }
    ],
    receivedRequests: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
            receivedAt: { type: Date, default: Date.now }
        }
    ],
    contacts: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
            addedAt: { type: Date, default: Date.now }
        }
    ]
});

export default mongoose.model("Users", userSchema);
