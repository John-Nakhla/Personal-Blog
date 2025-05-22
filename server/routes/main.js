const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const local = {
    title: 'NodeJS Blog',
    description: 'My first Node project'
}
router.get('', async (req, res) => {
    try {
        let perPage = 10;
        let page = parseInt(req.query.page) || 1;
        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * parseInt(page) - perPage)
            .limit(perPage)
            .exec();
        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        res.render('index',
            {
                local,
                data,
                currentPage: page,
                nextPage: hasNextPage ? nextPage : null
            });
    } catch (error) {
        console.log(error);

    }
});

router.get('/posts/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const data = await Post.findById({ _id: id });
        res.render('post', { local, data });
    } catch (error) {

    }
})
router.post('/search',async(req,res)=>{
    try {
        let searchTerm = req.body.searchTerm;
        const data = await Post.find({
            $or: [
                {title: {$regex:new RegExp(searchTerm)}},
                {body: {$regex:new RegExp(searchTerm)}}
            ]
        });
        res.render("search",{
            data,
            local
        });
    } catch (error) {
        console.log(error);
        
    }
})

router.get('/about', (req, res) => {
    res.render('about', local);
});


module.exports = router;





// function insertPostData(){
//     Post.insertMany([
//         {
//             title:"Building a blog4",
//             body:"This is the body text"
//         },
//         {
//             title:"Building a blog5",
//             body:"This is the body text"
//         },
//         {
//             title:"Building a blog6",
//             body:"This is the body text"
//         },
//         {
//             title:"Building a blog7",
//             body:"This is the body text"
//         },{
//             title:"Building a blog8",
//             body:"This is the body text"
//         },
//         {
//             title:"Building a blog9",
//             body:"This is the body text"
//         },
//         {
//             title:"Building a blog10",
//             body:"This is the body text"
//         },{
//             title:"Building a blog11",
//             body:"This is the body text"
//         },
//         {
//             title:"Building a blog12",
//             body:"This is the body text"
//         },
//         {
//             title:"Building a blog13",
//             body:"This is the body text"
//         },
//         {
//             title:"Building a blog14",
//             body:"This is the body text"
//         },
//         {
//             title:"Building a blog15",
//             body:"This is the body text"
//         },
//         {
//             title:"Building a blog16",
//             body:"This is the body text"
//         }
//     ])
// }
// insertPostData();
