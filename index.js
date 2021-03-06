const express = require("express")
const postsRouter = require("./posts/posts-router")

const server = express()

server.use(express.json())
server.use("/api/posts", postsRouter)

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})