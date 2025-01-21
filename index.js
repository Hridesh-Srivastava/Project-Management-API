import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

const app = express()
const port = 4000

// In-memory data store
const projects = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "Building a scalable e-commerce solution",
    start_date: "2023-01-01",
    end_date: "2023-12-31",
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Creating a cross-platform mobile application",
    start_date: "2023-03-15",
    end_date: "2023-09-30",
  },
]

let lastId = 2

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

//CHALLENGE 1: GET All projects
app.get("/projects", (req, res) => {
  res.json(projects)
})

//CHALLENGE 2: GET a specific project by id
app.get("/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === Number.parseInt(req.params.id))
  if (!project) return res.status(404).json({ message: "Project not found" })
  res.json(project)
})

//CHALLENGE 3: POST a new project
app.post("/projects", (req, res) => {
  const newId = (lastId += 1)
  const project = {
    id: newId,
    name: req.body.name,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
  }
  lastId = newId
  projects.push(project)
  res.status(201).json(project)
})

//CHALLENGE 4: PATCH a project when you just want to update one parameter
app.patch("/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === Number.parseInt(req.params.id))
  if (!project) return res.status(404).json({ message: "Project not found" })

  if (req.body.name) project.name = req.body.name
  if (req.body.description) project.description = req.body.description
  if (req.body.start_date) project.start_date = req.body.start_date
  if (req.body.end_date) project.end_date = req.body.end_date

  res.json(project)
})

//CHALLENGE 5: DELETE a specific project by providing the project id.
app.delete("/projects/:id", (req, res) => {
  const index = projects.findIndex((p) => p.id === Number.parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ message: "Project not found" })

  projects.splice(index, 1)
  res.json({ message: "Project deleted" })
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`)
})

