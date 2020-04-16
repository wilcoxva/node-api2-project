const express = require("express")
const db = require("../data/db")

const router = express.Router()

router.post("/", (req, res) => {
        db.insert(req.body)
            .then((post) => {
                res.status(201).json(post)
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({
                    message: "Error adding the post",
                })
            })
})

router.post("/:id/comments", (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: "The post with the specified ID does not exist." })
    }
    
    if (!req.body) {
		return res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
    
    db.insertComment({...req.body, post_id: req.params.id} )
            .then((comment) => {
                res.status(201).json(comment)
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({
                    message: "Error adding the comment",
                })
            })
})

router.get("/", (req, res) => {
    db.find()
		.then((posts) => {
			res.status(200).json(posts)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error retrieving the posts",
			})
		})
})

router.get("/:id", (req, res) => {
    db.findById(req.params.id)
		.then((post) => {
			if (post) {
				res.status(200).json(post)
			} else {
				res.status(404).json({
					message: "Post not found",
				})
			}
		})
})

router.get("/:id/comments", (req, res) => {
    db.findPostComments(req.params.id)
        .then((post) => {
            if (post) {
                res.json(post)
            } else {
                res.status(404).json({
                    message: "Post was not found.",
                })
            }
        })
        .catch((error) => {
            console.log(error)
			res.status(500).json({
				message: "Could not get user post",
			})
        })
})

router.delete("/:id", (req, res) => {
	db.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The post has been nuked",
				})
			} else {
				res.status(404).json({
					message: "The post could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error removing the post",
			})
		})
})

router.put("/:id", (req, res) => {    
    if (!req.body.title || !req.body.contents) {
		return res.status(400).json({
			message: "Missing title or contents",
		})
    }
    
    db.update(req.params.id, req.body)
		.then((post) => {
			if (post) {
				res.status(200).json(post)
			} else {
				res.status(404).json({
					message: "The post could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error updating the post",
			})
		})
})

module.exports = router