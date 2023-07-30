const multer = require('multer')
const Post = require('../models/postModel')

module.exports = {
    home: (req, res)=>{ 
        let {size, page} = req.query;
        let query = Post.find()
        if (size && page) { 
            size = +size;  page = +page;
            query.skip(size*(page-1)).limit(size)
        }
        let fetch;
        query.then(result => {fetch = result;  return Post.count()})
            .then(count => res.status(200).json({max: count, posts: fetch}))
            .catch(err => res.status(500).json({message: 'Fetching posts failed'}))
    },
    getPost: (req, res)=>{ 
        Post.findOne({_id:req.params.id}).then(result =>{
            if (result) res.status(200).json({post: result})
            else res.status(404).json()
        }).catch(err => res.status(500).json({message: 'Fetching a post failed'}))
    },
    addPost: (req, res)=>{ 
        let path = req.protocol+'://'+req.get('host')+'/images/'
        let {title, desc} = req.body
        new Post({title, desc, imagePath: path+req.file.filename, creator: req.userData.id})
            .save().then(result =>{ res.status(201).json({post: result}) })
            .catch(err => res.status(500).json({message: 'Creating a post failed'}))
    },
    editPost: (req, res)=>{
        let imagePath = req.body.imagePath
        if (req.file) imagePath = req.protocol+'://'+req.get('host')
            +'/images/'+req.file.filename
        let po = new Post({_id:req.params.id, title: req.body.title, 
            desc: req.body.desc, imagePath: imagePath, creator: req.userData.id})
        Post.updateOne({_id:req.params.id, creator: req.userData.id}, po).then(result =>{
            if (result.matchedCount == 0) res.status(401).json({message: 'Unauthorized'})
            res.status(201).json({message: 'Done', post: result})
        }).catch(err => res.status(500).json({message: 'Updating a post failed'}))
    },
    deletePost: (req, res)=>{
        Post.deleteOne({_id: req.params.id, creator: req.userData.id}).then(result => {
            if (result.deletedCount == 0) res.status(401).json({message: 'Unauthorized'})
            res.status(200).json({message: 'Done'})
        }).catch(err => res.status(500).json({message: 'Deleting a post failed'}))
    }
}