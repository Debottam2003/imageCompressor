import fs from "fs/promises";
import express from "express";
import sharp from "sharp";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import multer from "multer";
import type { Request, Response, NextFunction } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function read() {
  let data = await fs.readFile("./package.json");
  console.log(data);
  // console.log(String(data));
  console.log(data.toString());
  for (let i of data) {
    console.log(i, " : ", String.fromCharCode(i));
  }
}
// read();

const app = express();
app.use(cors());

// app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// "If req.file exists (i.e., is not null or undefined), then access .buffer.
// Otherwise, return undefined instead of throwing an error."
app.post("/compress", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (req.file?.buffer) {
      // The buffer size will be the file size of the uploaded image (byte slice)
      // Each byte is consist of 8 bits and are decimal numbers 0-255 but in console printed as hexadecimal
      // each character is represented using 1 byte
      console.log(req.file?.buffer);
      let bufferData = req.file?.buffer;
      console.log(req.file);

      if(req.file.mimetype == "image/png"){
        bufferData = await sharp(bufferData).png({quality: 50}).toBuffer();
      } else if (req.file.mimetype == "image/jpeg") {
        bufferData = await sharp(bufferData).jpeg({quality: 50}).toBuffer();
      }
      await fs.writeFile(`./public/images/${req.file.originalname}`, bufferData);
      res.status(200).json({
        message: "Image Compressed Successfully",
      });

    } else {
      res.status(500).json({
        message: "Error Working on the Image",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}); 

// custom interface for type safety
interface ErrorWithStatus extends Error {
  status?: number;
}

//   try {
//     throw new Error("Oops!");
//   } catch (err) {
//     next(err); // express passes the error to your error handler
//   }

// If Express sees an error passed to next(err) or an uncaught synchronous error,
// it skips all remaining regular middleware and jumps to the first error-handling 
// middleware it finds — which has this special signature: (err, req, res, next)

// Error Handler
app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  if(err) {
  console.error(err.stack); // Log to server
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!"
  });
  }
});

// Listening to the port and the socket connection has build from there
app.listen(3333, () => {
  console.log("the server is running on port: 3333");
});
