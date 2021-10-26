const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Task = require('./task');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age : {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Invalid age')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password must not contain password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});


userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function(next) {
    console.log("In a middleware before save")
    user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
        console.log(user.password)
    }
    console.log("In a middleware before save")
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user) {
        throw new Error('Unable to Login')
    }
    const isAuthentic = await bcrypt.compare(password, user.password)
    console.log("isAuthentic")
    console.log(isAuthentic)
    if (!isAuthentic) {
        throw new Error('Invalid Credentials')
    }
    return user
}

userSchema.methods.generareAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'thisisarun')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User