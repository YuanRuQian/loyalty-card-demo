import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
    name: String,
    points: Number
})

export default mongoose.model('Customer', customerSchema)