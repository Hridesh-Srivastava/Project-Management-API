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
import bodyParser from "body-parser"

const app = express()
const port = 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set("view engine", "ejs")

// In-memory data store
let projects = [
  {
    id: 1,
    name: "Sample Project",
    description: "This is a sample project",
    start_date: new Date("2025-01-01"),
    end_date: new Date("2025-12-31"),
  },
]

// Route to render the main page
app.get("/", (req, res) => {
  res.render("index.ejs", { projects: projects, error: null })
})

// Route to render the new project page
app.get("/new", (req, res) => {
  res.render("modify.ejs", {
    heading: "New Project",
    submit: "Create Project",
    project: null,
  })
})

// Route to render the edit page
app.get("/edit/:id", (req, res) => {
  const project = projects.find((p) => p.id === Number.parseInt(req.params.id))
  if (project) {
    res.render("modify.ejs", {
      heading: "Edit Project",
      submit: "Update Project",
      project: project,
    })
  } else {
    res.render("error.ejs", {
      message: "Project not found",
      details: "The requested project does not exist.",
    })
  }
})

// Create a new project
app.post("/api/projects", (req, res) => {
  const newProject = {
    id: projects.length + 1,
    name: req.body.name,
    description: req.body.description,
    start_date: new Date(req.body.start_date),
    end_date: new Date(req.body.end_date),
  }
  projects.push(newProject)
  res.redirect("/")
})

// Update a project
app.post("/api/projects/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const index = projects.findIndex((p) => p.id === id)
  if (index !== -1) {
    projects[index] = {
      ...projects[index],
      name: req.body.name,
      description: req.body.description,
      start_date: new Date(req.body.start_date),
      end_date: new Date(req.body.end_date),
    }
    res.redirect("/")
  } else {
    res.render("error.ejs", {
      message: "Error updating project",
      details: "The requested project does not exist.",
    })
  }
})

// Delete a project
app.get("/api/projects/delete/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  projects = projects.filter((p) => p.id !== id)
  res.redirect("/")
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})



