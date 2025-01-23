import express from "express"
import cors from "cors"
import bodyParser from "body-parser"

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// In-memory data store
let projects = [
  {
    id: 1,
    name: "Sample Project",
    description: "This is a sample project",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
  },
]

// Get all projects
app.get("/api/projects", (req, res) => {
  res.json(projects)
})

// Get a single project
app.get("/api/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === Number.parseInt(req.params.id))
  if (!project) {
    return res.status(404).json({ message: "Project not found" })
  }
  res.json(project)
})

//new project
app.post("/api/projects", (req, res) => {
  try {
    const { name, description, start_date, end_date } = req.body

    // Validate required fields
    if (!name || !description || !start_date || !end_date) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const newProject = {
      id: projects.length + 1,
      name,
      description,
      start_date,
      end_date,
    }

    projects.push(newProject)
    res.status(201).json(newProject)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update project
app.put("/api/projects/:id", (req, res) => {
  try {
    const { name, description, start_date, end_date } = req.body
    const id = Number.parseInt(req.params.id)

    // Validate required fields
    if (!name || !description || !start_date || !end_date) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const index = projects.findIndex((p) => p.id === id)
    if (index === -1) {
      return res.status(404).json({ message: "Project not found" })
    }

    projects[index] = {
      ...projects[index],
      name,
      description,
      start_date,
      end_date,
    }

    res.json(projects[index])
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete project
app.delete("/api/projects/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const initialLength = projects.length
  projects = projects.filter((p) => p.id !== id)

  if (projects.length === initialLength) {
    return res.status(404).json({ message: "Project not found" })
  }

  res.status(204).send()
})

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`)
})

export default app

