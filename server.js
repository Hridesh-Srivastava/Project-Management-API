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
import axios from "axios"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import methodOverride from "method-override"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const API_URL = process.env.API_URL || "http://localhost:4000"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Enhanced middleware setup
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      const method = req.body._method
      delete req.body._method
      return method
    }
  }),
)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// Configure axios defaults
axios.defaults.baseURL = API_URL
axios.defaults.validateStatus = (status) => status < 500

// Main page route
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`/api/projects`)
    res.render("index", {
      projects: response.data,
      error: null,
    })
  } catch (error) {
    console.error("Error fetching projects:", error.response?.data || error.message)
    res.render("index", {
      projects: [],
      error: {
        message: "Failed to fetch projects",
        details: error.response?.data?.message || error.message,
      },
    })
  }
})

// New project page route
app.get("/new", (req, res) => {
  res.render("modify", {
    heading: "New Project",
    submit: "Create Project",
    project: null,
  })
})

// Edit project page route
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`/api/projects/${req.params.id}`)
    res.render("modify", {
      heading: "Edit Project",
      submit: "Update Project",
      project: response.data,
    })
  } catch (error) {
    console.error("Error fetching project:", error.response?.data || error.message)
    res.render("error", {
      message: "Failed to fetch project",
      details: error.response?.data?.message || error.message,
    })
  }
})

// Create new project route
app.post("/api/projects", async (req, res) => {
  try {
    await axios.post(`/api/projects`, req.body)
    res.redirect("/")
  } catch (error) {
    console.error("Error creating project:", error.response?.data || error.message)
    res.render("error", {
      message: "Failed to create project",
      details: error.response?.data?.message || error.message,
    })
  }
})

// Update/Delete project route
app.post("/api/projects/:id", async (req, res) => {
  try {
    if (req.body._method === "PATCH") {
      await axios.patch(`/api/projects/${req.params.id}`, req.body)
    } else if (req.body._method === "DELETE") {
      await axios.delete(`/api/projects/${req.params.id}`)
    }
    res.redirect("/")
  } catch (error) {
    console.error("Error updating/deleting project:", error.response?.data || error.message)
    res.render("error", {
      message: `Failed to ${req.body._method === "DELETE" ? "delete" : "update"} project`,
      details: error.response?.data?.message || error.message,
    })
  }
})

// Handle direct delete requests (for backward compatibility)
app.get("/api/projects/delete/:id", async (req, res) => {
  try {
    await axios.delete(`/api/projects/${req.params.id}`)
    res.redirect("/")
  } catch (error) {
    console.error("Error deleting project:", error.response?.data || error.message)
    res.render("error", {
      message: "Failed to delete project",
      details: error.response?.data?.message || error.message,
    })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    message: "Page Not Found",
    details: "The requested page does not exist.",
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("error", {
    message: "Something went wrong!",
    details: err.message,
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
  console.log(`API URL: ${API_URL}`)
})