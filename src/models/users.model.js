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
  user_email: {
    type: String,
    required: true,

  },
  user_password: {
    type: String,
    required: true,

  },
  user_job: {
    type: String,
    required: true,

  },

  user_location_region: {
    type: String,
    required: true,

  },
  user_location_country: {
    type: String,
    required: true,
  },
  user_address: {
    type: String,
    required: true,

  },

  user_description: {
    type: String,
    required: true,
  },
  user_born: {
    type: Date,
    required: true,
  },

  user_role: {
    //Enum for user_role "user", "admin", "provider"
    type: String,
    required: true,
    enum: ['user', 'admin', 'provider'],
  },
  user_image: {
    type: String,
    required: true,
    default: 'user.png',
  },

  user_contact: {
    type: String,
    required: true,
  },
  user_payment: {
    type: Number,
    required: true,
    default: 10000,
  },
  user_subscription: {
    type: Schema.Types.ObjectId,
    ref: "SubscriptionsForEvery",
    default: null,

  },
  user_last_login_date: {
    type: Date,
    required: true,
    default: Date.now,
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
