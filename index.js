const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/initiate", (req, res) => {
  fs.readFile(
    path.join(__dirname, "data.json"),
    {
      encoding: "utf-8",
    },
    (err, data) => {
      if (err) {
        res.status(500).json({ message: err });
      }
      res.status(200).json({ ...JSON.parse(data) });
    }
  );
});

app.post("/data", (req, res) => {
  let { team, score } = req.body;
  if (!team || team.trim().length === 0) {
    res.status(400).json({ message: "Provide a team" });
  }
  if (!score || score.trim().length === 0) {
    res.status(400).json({ message: "Provide a score" });
  }
  team = team.trim();
  score = +score.trim();
  fs.readFile(
    path.join(__dirname, "data.json"),
    {
      encoding: "utf-8",
    },
    (err, data) => {
      if (err) {
        res.status(500).json({ message: err.message });
      }

      let final;
      switch (team.toString()) {
        case "blue":
          final = { ...JSON.parse(data), blue: score };
          break;
        case "red":
          final = { ...JSON.parse(data), red: score };
          break;
        default:
          final = { ...JSON.parse(data) };
          break;
      }
      fs.writeFile(
        path.join(__dirname, "data.json"),
        JSON.stringify(final),
        (err) => {
          if (err) {
            res.status(500).json(err.message);
          } else {
            res.status(400).json(final);
          }
        }
      );
    }
  );
});

app.listen(5000, console.log("listening"));
