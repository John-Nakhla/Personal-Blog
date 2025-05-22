const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET



const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    try {
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({message:'Unauthorized'});
    }
}


router.get('/admin', async (req, res) => {
    try {
        const local = {
            title: 'Admin',
            description: 'I am the admin of this blog'
        };
        res.render('admin/index', { local, layout: adminLayout })
    } catch (error) {

    }
})

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({userId: user._id},jwtSecret);
        res.cookie('token',token,{httpOnly:true});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        
}
});
router.get('/dashboard',authMiddleware,async (req,res)=>{

    try {
        const local={
            title: 'Dashboard',
            description: "My NodeJS Blog"
        }
        const data = await Post.find();
        res.render('admin/dashboard',{
            local,
            data,
            layout:adminLayout
        });
    } catch (error) {
        console.log(error);
        
    }
    
});
router.get('/add-post',authMiddleware,async (req,res)=>{

    try {
        const local={
            title: 'Add Post',
            description: "My NodeJS Blog"
        }
        res.render('admin/add-post',{
            local
        });
    } catch (error) {
        console.log(error);
        
    }
    
});

router.post('/add-post',authMiddleware,async (req,res)=>{

    try {
        
        try {
            const newPost = new Post({
                title: req.body.title,
                body:req.body.body
            });
           await Post.create(newPost) 
           res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
    
});


router.get('/edit-post/:id',authMiddleware,async (req,res)=>{

    try {
        const local={
            title: 'Edit post',
            description:'My NodeJS Blog'
        }
        const data = await Post.findOne({_id: req.params.id});
        res.render('admin/edit-post',{
            local,
            data,
            layout:adminLayout
        })
    } catch (error) {
        console.log(error);
        
    }
    
});

router.put('/edit-post/:id',authMiddleware,async (req,res)=>{

    try {
        await Post.findByIdAndUpdate(req.params.id,{
            title:req.body.title,
            body:req.body.body,
            updatedAt : Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.log(error);
        
    }
    
});
router.delete('/delete-post/:id',authMiddleware,async (req,res)=>{

    try {
        await Post.deleteOne({_id:req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        
    }
    
});
router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.redirect('/');
});


module.exports = router;