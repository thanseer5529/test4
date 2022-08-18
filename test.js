const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.listen(5000, (err) => {
  if (!err) console.log("server connected to port 5000");
});
app.use(express.static(__dirname));
console.log(__dirname, "rfwerwerewrwerwe");
const multer = require("multer");
let upload = multer({});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-orgin", "*");
  res.header("Access-Control-Allow-Header", "Content-Type,Authorization");
  if (req.method === "OPTION") {
    res.header("Access-Control-Allow-Method", "GET,POST,PUT,PATCH,DELETE");
    return res.status(200).json();
  }
  next();
});

mongoose.connect("mongodb://localhost:27017/books", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true, //make this also true
});
db = mongoose.connection;
db.on("error", (err) => {
  console.log("connection lost", err);
});
db.once("open", () => {
  console.log("db connected to server");
});
const bookschema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    author: {
      type: String,

      required: [true, "author not be empty"],
    },
    year: {
      type: Date,
      required: [true, " date not be empty"],
    },
  },
  { collection: "book", versionKey: false }
);
const book = mongoose.model("books", bookschema);

app.get("/book", (req, res, next) => {
  const skip = req.query.skip;
  const limit = req.query.limit;
  book
    .find()
    .skip(skip)
    .limit(limit)
    .exec()
    .then((data) => {
      console.log(data);
      res.json({ err: false, data });
    })
    .catch((err) => {
      console.log(err);
      res.json({ err: true });
    });
});

app.post("/book", upload.none(), (req, res) => {
  const content = req.body;
  content._id = new mongoose.Types.ObjectId();
  const new_book = new book(content);
  new_book
    .save()
    .then((data) => {
      console.log(data);
      res.json({ err: false, data: { id: data._id } });
    })
    .catch((error) => {
      console.log(error);
      arr = Object.keys(error.errors);
      console.log(arr);
      res.json({ err: true, error });
    });
});

app.delete("/book/:id", upload.none(), (req, res) => {
  const id = req.params.id;
  book
    .findByIdAndDelete({ _id: id })
    .then((data) => {
      console.log(data);
      res.json({ err: false });
    })
    .catch((error) => {
      console.log(error);
      res.json({ err: true, error });
    });
});

app.put("/book/:id", upload.array("image"), (req, res) => {
  const id = req.params.id;
  const content = req.body;
  book
    .findByIdAndUpdate({ _id: id }, { $set: content })
    .then((data) => {
      console.log(data);
      res.json({ err: false, data: { id: data._id } });
    })
    .catch((error) => {
      console.log(error);
      res.json({ err: true, error });
    });
});
app.use((req, res, next) => {
  let error = new Error("not found");
  error.status = 404;
  next({ err: error, msg: "from thanu" });
});

app.use((err, req, res, next) => {
  let status = err.status ? err.status : 404;
  res.status(status).json({
    // error: err.message,
    // status: err.status,
    err,
  });
});
