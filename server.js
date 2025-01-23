import express from "express"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// In-memory data store
let projects = [
  {
    id: 1,
    name: "BlogWise",
    description: "blogWise a blog website, is a platform where you share insights, ideas, and valuable content on various topics. It is designed to engage readers with well-structured articles, offering a user-friendly experience for exploring and learning.",
    start_date: "2024-03-04",
    end_date: "2024-04-30",
  },
  {
    id: 2,
    name: "Simon Game",
    description: "Simon Game website is an interactive memory-based game where players test their ability to recall and repeat sequences of colors and sounds. It offers an engaging and fun challenge that progressively increases in difficulty, making it perfect for players of all ages.",
    start_date: "2024-05-02",
    end_date: "2024-06-01",
  },
  {
    id: 3,
    name: "Registration website",
    description: "Registration website features a complete user authentication system with sign-up and sign-in functionality. It includes a fully developed backend to securely handle user data, ensuring smooth account creation, login, and data management processes. The platform is designed with a focus on security and user experience.",
    start_date: "2024-05-12",
    end_date: "2024-06-20",
  },
  {
    id: 4,
    name: "Drums",
    description: "Drums Website is an interactive platform where users can explore and play a variety of drum sounds with just a click or keypress. Whether you're a music enthusiast or just looking to have some fun, the website offers an engaging and immersive drumming experience. With an intuitive interface and responsive controls, it’s the perfect place to unleash your inner drummer.",
    start_date: "2024-07-01",
    end_date: "2024-07-28",
  },
  {
    id: 5,
    name: "My Portfolio",
    description: "My portfolio website is a showcase of my skills and projects designed to provide a comprehensive view of my work. It highlights my expertise, creative approach, and professional journey, offering an engaging way for visitors to explore my accomplishments and connect with me.",
    start_date: "2024-08-11",
    end_date: "2024-09-30",
  },
]


app.get("/", (req, res) => {
  res.render("index", { projects, error: null })
})

// New project 
app.get("/new", (req, res) => {
  res.render("modify", {
    heading: "New Project",
    submit: "Create Project",
    project: null,
  })
})

// Edit project
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



