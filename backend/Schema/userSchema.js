import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    url: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Url' 
    }],
    tabs: {
        type: Array,
        default: ['youtube', 'instagram', 'articles'],
        required: true // Ensures that tabs are not empty
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
