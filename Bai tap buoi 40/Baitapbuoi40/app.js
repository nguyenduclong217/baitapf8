const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json()); // parse body bang json

//  API lấy danh sách users

app.get("/user", (req, res) => {
  // Request
  // console.log(req.query.q);
  const filePath = path.join(__dirname, "data", "user.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (req.query.q) {
    const q = req.query.q;
    const searcher = data.filter((users) => {
      return users.name.toLowerCase().includes(q);
    });
    res.send(searcher);
  } else {
    res.send(data);
  }
});

// API lấy thông tin một user
app.get("/user/:id", (req, res) => {
  const idSearch = Number(req.params.id);
  const filePath = path.join(__dirname, "data", "user.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const user = data.find((u) => u.id === idSearch);
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// API tạo mới user
app.post("/user", (req, res) => {
  const { name, email } = req.body;
  const filePath = path.join(__dirname, "data", "user.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const maxId = Math.max(...data.map((u) => u.id));
  const newId = maxId + 1;

  const newUser = {
    id: newId,
    name,
    email,
  };
  data.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(200).json(newUser);
});

// API cập nhật user
app.put("/user/:id", (req, res) => {
  const { name, email } = req.body;
  const idSearch = Number(req.params.id);
  const filePath = path.join(__dirname, "data", "user.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const user = data.find((u) => u.id === idSearch);
  // console.log(data[user]);
  if (user) {
    user.name = name;
    user.email = email;

    // ghi lai file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return res.status(200).json(user);
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// API xóa user
app.delete("/user/:id", (req, res) => {
  const idSearch = Number(req.params.id);
  const filePath = path.join(__dirname, "data", "user.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const user = data.find((u) => u.id === idSearch);
  if (user) {
    data.splice(user, 1);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return res.status(200).json({ message: "Deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.listen(3000, () => {
  console.log("Đang chạy với port 3000");
});
