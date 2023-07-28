///Requires the 
const { Schema, model } = require('mongoose')

//Crete Schema 
const blogModel = new Schema({
    blog_title: {
        type: String,
        required: true,
    },
    blog_content: {
        type: String,
        required: true,

    },
    blog_date: {
        type: Date,
        default: Date.now()
    },
    blog_user: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    blog_image: {
        type: String,
        required: true,
        default: 'blog.png',
    },
    blog_isactive: {
        type: Boolean,
        required: true,
        default: true,
    },

},
    {
        timestamps: true
    }

)

module.exports = model('Blogs', blogModel)
