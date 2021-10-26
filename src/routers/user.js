const express = require('express')
const User = require('../model/user')
const auth = require('../middleware/auth')
const router = new express.Router()



router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generareAuthToken()
        return res.send({ user, token })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generareAuthToken()
        res.status(201).send({user: user, token: token})
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req
        })
        await req.user.save()
        res.send()
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.get('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [ ]
        await req.user.save()
        res.send()
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperations = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperations) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        updates.forEach(update => {
            req.user[update] = req.body[update]
        });
        await req.user.save()
        return res.send(user)
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove(req.user._id)
        return res.send(req.user)
    } catch(error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

module.exports = router