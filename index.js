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

