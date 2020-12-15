const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const User = mongoose.model("User", {
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        validate(val) {
            if(val < 0){
                throw new Error("Age can't be less")
            }
        }
    }
})

const me = new User({
    name: 'Ashu',
    age: -1
})

me.save().then((me) => {
    console.log(me)
}).catch((e) => {
    console.log(e)
})

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean
    }
})

const t1 = new Task({
    description: "Get plan your holidays",
    completed: false
})

// t1.save().then((t1) => {
//     console.log(t1)
// }).catch((e) => {
//     console.log(e)
// })
