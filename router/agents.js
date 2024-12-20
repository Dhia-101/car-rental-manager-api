const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const { Agent, validateAgent } = require('../models/agent');
const { Base } = require('../models/base');

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');


router.get('/', async (req, res) => {
    res.send(await Agent.find());
});

router.get('/:id', async (req, res) => {

    let result = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!result) return res.status(400).send('Invalid id provided.');

    result = await Agent.findById(req.params.id);
    if (!result) return res.status(404).send('no agent with the given id was found.');

    res.send(await Agent.findById(req.params.id));
});

router.post('/', async (req, res) => {
    const { error } = validateAgent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const base = await Base.findById(req.body.ID_Base);
    if (!base) return res.status(400).send('invalid base id.');

    let agent = await Agent.findOne({ email: req.body.email });
    if (agent) return res.status(400).send('agent already registred.');

    agent = new Agent({
        ID_Base: {
            _id: base._id,
            B_Name: base.B_Name
        },
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        phone: req.body.phone,
        email: req.body.email,
        salary: req.body.salary
    });
    const salt = await bcrypt.genSalt(10);
    agent.password = await bcrypt.hash(req.body.password, salt);
    const token = agent.generateAuthToken();


    res.header('x-auth-token', token).send(await agent.save());
});

router.put('/:id', async (req, res) => {

    const result = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!result) return res.status(400).send('Invalid id provided.');
	
	const base = await Base.findById(req.body.ID_Base);
    if (!base) return res.status(400).send('invalid base id.');

    let agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).send('agent not found!');

	
	const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    agent = await Agent.findByIdAndUpdate(req.params.id,
        {
            ID_Base: { _id: base._id, B_Name: base.B_Name },
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            phone: req.body.phone,
            email: req.body.email,
            salary: req.body.salary,
            password: password
        }, {
        new: true
    });
    res.send(await agent.save());

});

router.delete('/:id', async (req, res) => {

    let result = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!result) return res.status(400).send('Invalid id provided.');

    let agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).send('agent not found!');

    result = await Agent.findByIdAndDelete(agent._id);
    res.send(result);
});

module.exports = router;