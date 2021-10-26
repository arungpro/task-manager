const express = require('express')
const Task = require('../model/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        var result = await task.save()
        res.status(201).send(result)
    } catch(error) {
        res.status(400).send(error)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        var user = await req.user.populate('tasks').execPopulate()
        res.send(user.tasks)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        var result = await Task.findOne({_id, owner: req.user._id})
        if(!result) {
            return res.status(404).send()
        }
        res.send(result)
    } catch(error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['completed', 'description']
    const updates = Object.keys(req.body)

    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidUpdate) {
        return res.status(400).send({ error: "Invalid update" })
    }
    try {
        const task = await Task.findById(req.params.id)
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task) {
            return res.status(404).send()
        }
        return res.send(task)
    } catch(error) {
        return res.status(500).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        return res.send(task)
    } catch(error) {
        return res.status(500).send(error)
    }
})

module.exports = router