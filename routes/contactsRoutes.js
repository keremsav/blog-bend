let express = require('express');
let router = express.Router();
let Contact = require('../Models/Contact');
const User = require("../Models/User");

//All Contacts Messages
router.get('/contact', async (req,res) => {
    try {
        let email = req.query.email;
        if(!email) {
            let contact = await Contact.find();
            res.status(201).send(contact);
        } else {
            let contact = await Contact.find({email: { $regex: email, $options: 'i' }},{},{lean:true})
            res.status(200).json(contact);
        }


    }
    catch (err) {
        res.status(500).json({error : 'There is a problem when getting contact messages.'})
    }
})

//Get Single Contact Messsage

router.get('/contact/:id',async (req,res) => {
    try {
        let {contactId} = req.params.id;
        let contactMessage = await Contact.findById({contactId});
        res.status(201).send(contactMessage);
    } catch (err) {
        res.status(500).json({error : 'Can not get single contact message.'})
    }
})
//Create Contact Message
router.post('/contact',async (req,res) => {
    try {
        let {name,email,subject,message} = req.body;
        let contact = new Contact({name,email,subject,message});
        await contact.save();
        res.status(201).send(contact);

    } catch (err) {
        res.status(500).json({error : 'Contact message can not create.'})
    }
})
router.delete('/contact/:id', async (req,res) => {
    try {
        let id = req.params.id;
        await Contact.findByIdAndDelete(id);
        res.status(201).json({message : 'Contact Deleted.'});
    } catch (err) {
        res.status(500).json({error : 'Can not delete contact message.'})

    }
})


module.exports = router;

