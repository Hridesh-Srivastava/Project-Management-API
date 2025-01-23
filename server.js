// import express from "express"
// import bodyParser from "body-parser"
// import axios from "axios"

// const app = express()
// const port = 3000
// const API_URL = "http://localhost:4000"

// app.use(express.static("public"))
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
// app.set("view engine", "ejs")

// // Route to render the main page
// app.get("/", async (req, res) => {
//   try {
//     const response = await axios.get(`${API_URL}/projects`)
//     res.render("index.ejs", { projects: response.data })
//   } catch (error) {
//     console.error("Error fetching projects:", error)
//     res.status(500).render("error.ejs", {
//       message: "Error fetching projects",
//       details: error.message,
//     })
//   }
// })

// // Route to render the new project page
// app.get("/new", (req, res) => {
//   res.render("modify.ejs", {
//     heading: "New Project",
//     submit: "Create Project",
//     project: null,
//   })
// })

// // Route to render the edit page
// app.get("/edit/:id", async (req, res) => {
//   try {
//     const response = await axios.get(`${API_URL}/projects/${req.params.id}`)
//     res.render("modify.ejs", {
//       heading: "Edit Project",
//       submit: "Update Project",
//       project: response.data,
//     })
//   } catch (error) {
//     console.error("Error fetching project:", error)
//     res.render("error.ejs", {
//       message: "Error fetching project",
//       details: error.message,
//     })
//   }
// })

// // Create a new project
// app.post("/api/projects", async (req, res) => {
//   try {
//     await axios.post(`${API_URL}/projects`, req.body)
//     res.redirect("/")
//   } catch (error) {
//     console.error("Error creating project:", error)
//     res.render("error.ejs", {
//       message: "Error creating project",
//       details: error.message,
//     })
//   }
// })

// // Update a project
// app.post("/api/projects/:id", async (req, res) => {
//   try {
//     await axios.patch(`${API_URL}/projects/${req.params.id}`, req.body)
//     res.redirect("/")
//   } catch (error) {
//     console.error("Error updating project:", error)
//     res.render("error.ejs", {
//       message: "Error updating project",
//       details: error.message,
//     })
//   }
// })

// // Delete a project
// app.get("/api/projects/delete/:id", async (req, res) => {
//   try {
//     await axios.delete(`${API_URL}/projects/${req.params.id}`)
//     res.redirect("/")
//   } catch (error) {
//     console.error("Error deleting project:", error)
//     res.render("error.ejs", {
//       message: "Error deleting project",
//       details: error.message,
//     })
//   }
// })

// app.listen(port, () => {
//   console.log(`Frontend server is running on http://localhost:${port}`)
// })




import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

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

// Main page
app.get("/", (req, res) => {
  res.render("index", { projects, error: null })
})

// New project form
app.get("/new", (req, res) => {
  res.render("modify", {
    heading: "New Project",
    submit: "Create Project",
    project: null,
  })
})

// Edit project form
app.get("/edit/:id", (req, res) => {
  const project = projects.find((p) => p.id === Number.parseInt(req.params.id))
  if (project) {
    res.render("modify", {
      heading: "Edit Project",
      submit: "Update Project",
      project,
    })
  } else {
    res.render("error", {
      message: "Project not found",
      details: "The requested project does not exist.",
    })
  }
})

// Create project
app.post("/api/projects", (req, res) => {
  try {
    const { name, description, start_date, end_date } = req.body
    if (!name || !description || !start_date || !end_date) {
      throw new Error("All fields are required")
    }

    const newProject = {
      id: projects.length + 1,
      name,
      description,
      start_date,
      end_date,
    }

    projects.push(newProject)
    res.redirect("/")
  } catch (error) {
    res.render("error", {
      message: "Error creating project",
      details: error.message,
    })
  }
})

// Update project
app.post("/api/projects/:id", (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const index = projects.findIndex((p) => p.id === id)

    if (index === -1) {
      throw new Error("Project not found")
    }

    const { name, description, start_date, end_date } = req.body
    if (!name || !description || !start_date || !end_date) {
      throw new Error("All fields are required")
    }

    projects[index] = {
      ...projects[index],
      name,
      description,
      start_date,
      end_date,
    }

    res.redirect("/")
  } catch (error) {
    res.render("error", {
      message: "Error updating project",
      details: error.message,
    })
  }
})

// Delete project
app.get("/api/projects/delete/:id", (req, res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const initialLength = projects.length
    projects = projects.filter((p) => p.id !== id)

    if (projects.length === initialLength) {
      throw new Error("Project not found")
    }

    res.redirect("/")
  } catch (error) {
    res.render("error", {
      message: "Error deleting project",
      details: error.message,
    })
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

export default app

