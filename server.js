const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const csv = require("csv-parser");
const csvParser = require("csv-parser");

const app = express();
app.use(bodyParser.json());
// Define the directory where your static files (HTML, CSS, JS) are located
const staticFilesDir = path.join(__dirname, "public");

// Serve static files from the 'public' directory
app.use(express.static(staticFilesDir));

// define uploads to serve the files on server
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/" + file.fieldname);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

// GET route for fetching model images
app.get("/images", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");
  const folders = ["Modelimage"];
  folders.forEach((folder) => {
    const folderPath = path.join(uploadsDir, folder);
    const files = fs.readdirSync(folderPath);
    const imageUrls = files.map((file) => `/uploads/${folder}`);
    modelimages = imageUrls;
  });
  const modelfolderpathglobal = JSON.stringify(modelimages);

  //console.log("modelfolderpath", modelfolderpathglobal);

  res.json(modelfolderpathglobal);
});

// GET route for fetching cloth images
app.get("/Clothimages", (req, res) => {
  const clothdir = path.join(__dirname, "uploads");
  const clothfolder = ["Clothimage"];
  clothfolder.forEach((clothfolder) => {
    const colthpath = path.join(clothdir, clothfolder);
    const files = fs.readdirSync(colthpath);
    const clothimageUrl = files.map((file) => `/uploads/${clothfolder}`);
    clothimages = clothimageUrl;
  });
  const clothfolderpathglobal = JSON.stringify(clothimages);
  // console.log("clothfolderpathglobal", clothfolderpathglobal);
  res.json(clothfolderpathglobal);
});

// GET route for fetching REsult images
app.get("/Resultimages", (req, res) => {
  const resultdir = path.join(__dirname, "uploads");
  const resultfolder = ["Resultimage"];
  resultfolder.forEach((resultfolder) => {
    const resultpath = path.join(resultdir, resultfolder);
    const files = fs.readdirSync(resultpath);
    const resultimgUrl = files.map((file) => `/uploads/${resultfolder}`);
    resultimages = resultimgUrl;
  });
  const resultfolderpathglobal = JSON.stringify(resultimages);
  // console.log("resultfolderpathglobal", resultfolderpathglobal);
  res.json(resultfolderpathglobal);
});

// GET route for fetching CSV data
app.get("/csv", (req, res) => {
  // const { filePath } = req.params;

  const filePath = "uploads/csvFile/test_unpairs-FD1.csv";

  if (!filePath) {
    return res.status(400).json({ message: "filepath is required" });
  }
  const jsonData = [];
  fs.createReadStream(filePath, {
    encoding: "utf8",
  })
    .pipe(csvParser())
    .on("data", (data) => {
      // console.log("data", data);
      // jsonData.push(data);
      const rowValues = Object.values(data);
      jsonData.push(rowValues);
      // console.log("rowValues", rowValues);
    })
    .on("end", () => {
      // Convert JavaScript object to JSON string
      const jsonDataString = JSON.stringify(jsonData);
      // console.log(jsonDataString);
      res.json(jsonDataString);
    });
});

// POST route for handling form submission and fetching image data
app.post(
  "/upload/allFiles",
  upload.fields([
    { name: "ModelImage" },
    { name: "Clothimage" },
    { name: "Resultimage" },
    { name: "csvFile" },
  ]),
  (req, res) => {
    res.redirect("/");
  }
);

//listen the port on 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
