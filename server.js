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




import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const API_URL = process.env.API_URL || "http://localhost:4000";

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Route to render the main page with projects list
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/projects`);
    res.render("index", { projects: response.data });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).render("error", {
      message: "Failed to fetch projects",
      details: error.message,
    });
  }
});

// Route to render the 'New Project' page
app.get("/new", (req, res) => {
  res.render("modify", {
    heading: "New Project",
    submit: "Create Project",
    project: null,
  });
});

// Route to render the 'Edit Project' page
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${req.params.id}`);
    res.render("modify", {
      heading: "Edit Project",
      submit: "Update Project",
      project: response.data,
    });
  } catch (error) {
    console.error("Error fetching project:", error.message);
    res.status(500).render("error", {
      message: "Failed to fetch project details",
      details: error.message,
    });
  }
});

// Handle project creation
app.post("/api/projects", async (req, res) => {
  try {
    await axios.post(`${API_URL}/projects`, req.body);
    res.redirect("/");
  } catch (error) {
    console.error("Error creating project:", error.message);
    res.status(500).render("error", {
      message: "Failed to create project",
      details: error.message,
    });
  }
});

// Handle project updates
app.post("/api/projects/:id", async (req, res) => {
  try {
    await axios.patch(`${API_URL}/projects/${req.params.id}`, req.body);
    res.redirect("/");
  } catch (error) {
    console.error("Error updating project:", error.message);
    res.status(500).render("error", {
      message: "Failed to update project",
      details: error.message,
    });
  }
});

// Handle project deletion
app.get("/api/projects/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/projects/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res.status(500).render("error", {
      message: "Failed to delete project",
      details: error.message,
    });
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render("error", {
    message: "Page Not Found",
    details: "The page you are looking for does not exist.",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
