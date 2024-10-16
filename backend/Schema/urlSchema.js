import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    tab: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Url = mongoose.model('Url', urlSchema);
export default Url;
