const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storageDisk = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'uploads')
    },
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
})

const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'image/jpg'|| file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        cb(null,true)
    } else{
        cb(null,false)
    }
}

const upload = multer(
    {storage: storageDisk, 
    limits: {
    fileSize: 1024 * 1024 * 500
}, 
fileFilter: fileFilter})

const Animal = require('../models/animal');

// get all animals
router.post("/all", (req,res,next) => {
    Animal.find().select('_id name description animalImage')
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json({
            result
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

// get animal by animal id
router.post('/id/:animalId', (req,res,next) => {
    const id = req.params.animalId
    Animal.findById(id)
    .select('_id name description animalImage')
    .exec()
    .then(result => {
        console.log(result)
        if(result){
            res.status(200).json({
                _id: result._id,
                name: result.name,
                description: result.description,
                animalImage: result.animalImage
            })
        } else {
            res.status(404).json({
                message: "Not found"
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err})
    })
})



// create
router.post('/create', upload.single('animalImage'), (req,res,next) => {
    console.log(req.file)
    const newAnimal = new Animal({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        animalImage: req.file.path.replace("\\","/")
    })
    newAnimal
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Animal created',
            created: newAnimal
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err,
        })
    })
})

// create no image
router.post('/create/noImage', (req,res,next) => {
    const newAnimal = new Animal({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
    })
    newAnimal
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Animal created',
            created: newAnimal
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err,
        })
    })
})

//delete
router.post('/delete/:animalId', (req,res,next) => {
    const id = req.params.animalId
    Animal.findByIdAndRemove(id)
    .exec()
    .then(result => {
        res.status(200).json({
            message: "animal deleted"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})


//update
router.post('/update/:animalId', (req,res,next) => {
    const id = req.params.animalId
    Animal.findByIdAndUpdate(id , {$set: req.body} , {new: true})
    .exec()
    .then(result => {
        console.log(result)
        res.status(200).json(
            result
            )
        })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router;
