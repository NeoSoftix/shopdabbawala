import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim:true,
        LowerCase: true
    },

    description :{
        type: String
    },

    image: {
        url:{
            type: String,
            default:""
        },
        public_id:{
            type: String,
            default: ""
        }
    },
}, {timestamps: true})

const Category = mongoose.model("Category", categorySchema)

export default Category
