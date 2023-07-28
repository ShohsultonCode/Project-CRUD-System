///Requires the 
const { Schema, model } = require('mongoose')

//Crete Schema 
const usersModel = new Schema({
  user_first_name: {
    type: String,
    required: true,
  },
  user_last_name: {
    type: String,
    required: true,

  },
  user_username: {
    type: String,
    required: true,

  },
  user_password: {
    type: String,
    required: true,

  },
  user_image: {
    type: String,
    required: true,
    default: 'user.png',
  },
  user_role: {
    //Enum for user_role "user", "admin", "provider"
    type: String,
    required: true,
    enum: ['user', 'admin'],
  },

  user_isactive: {
    type: Boolean,
    required: true,
    default: true,
  },

},
  {
    timestamps: true
  }

)

module.exports = model('Users', usersModel)
