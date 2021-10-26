const mongoose = require('../src/db/mongoose')
const Task = require('../src/model/task')

// Task.findByIdAndRemove('601bf6a303e48fde8ba8818a').then( (task) => {
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then((result) => {
//     console.log(result)
// })


var deleteTaskAndCount = async(id) => {
    var deleted = await Task.deleteOne({_id: id})
    var count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('601c18d2afeb2d43939db700').then( (count) => {
    console.log(count)
}).catch((e)=>{
    console.log(e)
})