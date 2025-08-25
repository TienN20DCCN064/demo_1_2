const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// 👇 đặt ở trên cùng App.js
// Bảng người dùng (chỉ thông tin cá nhân)
let users = [
  { id: 1, fullName: 'Peter Mackenzie', email: 'peter@example.com', userName: 'pmackenzie', password: 'admin123', roleId: 'Admin', phone: '123456789' },
  { id: 2, fullName: 'Cind Zhang', email: 'cindy@example.com', userName: 'czhang', password: 'test123', roleId: 'Test', phone: '987654321' },
  { id: 3, fullName: 'Ted Smith', email: 'ted@example.com', userName: 'tsmith', password: 'test456', roleId: 'Test', phone: '456789123' },
  { id: 4, fullName: 'Susan Fernbrook', email: 'susan@example.com', userName: 'sfern', password: 'test789', roleId: 'Test', phone: '321654987' },
  { id: 5, fullName: 'Emily Kim', email: 'emily@example.com', userName: 'ekim', password: 'admin456', roleId: 'Admin', phone: '654321789' },
  { id: 6, fullName: 'Peter Zhang', email: 'pzhang@example.com', userName: 'pzhang', password: 'user123', roleId: 'User', phone: '789456123' },
  { id: 7, fullName: 'Cindy Smith', email: 'csmith@example.com', userName: 'csmith', password: 'user456', roleId: 'User', phone: '321654987' },
  { id: 8, fullName: 'Ted Fernbrook', email: 'tedf@example.com', userName: 'tfern', password: 'test999', roleId: 'Test', phone: '654321789' },
  { id: 9, fullName: 'Susan Kim', email: 'susan.k@example.com', userName: 'skim', password: 'user789', roleId: 'User', phone: '789456123' },
  { id: 10, fullName: 'Emily Mackenzie', email: 'emac@example.com', userName: 'emac', password: 'admin789', roleId: 'Admin', phone: '321654987' },
];

// Bảng quyền
let roles = [
  { id: "Admin", name: "ROLE ADMIN" },
  { id: "Test", name: "ROLE TEST" },
  { id: "User", name: "ROLE USER" }
];

// ================= USERS ===================

// Lấy toàn bộ users
app.get('/api/users', (req, res) => {
  res.json({
    data: users,
    offset: 0,
    limit: users.length,
    total: users.length
  });
});

// ================= USERS ===================

// Lấy toàn bộ users
app.get('/api/users', (req, res) => {
  res.json({
    data: users,
    offset: 0,
    limit: users.length,
    total: users.length
  });
});

// Lấy 1 user theo id
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { fullName, email, userName, password, roleId, phone } = req.body;

  // Bỏ email ra khỏi validate
  if (!fullName || !userName || !password || !roleId || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    fullName,
    email: email || "",  // nếu không có email, để rỗng
    userName,
    password,
    roleId,
    phone
  };
  users.push(newUser);
  res.status(201).json(newUser);
});


app.put('/api/users/:id', (req, res) => {
  const { fullName, email, userName, password, roleId, phone } = req.body;
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.fullName = fullName ?? user.fullName;
  // Cho phép email rỗng, nếu không gửi thì giữ nguyên
  if (email !== undefined) user.email = email;
  user.userName = userName ?? user.userName;
  user.password = password ?? user.password;
  user.roleId = roleId ?? user.roleId;
  user.phone = phone ?? user.phone;

  res.json(user);
});


// Xoá user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const deletedUser = users.splice(index, 1);
  res.json(deletedUser[0]);
});



// ================= ROLES ===================

app.get('/api/roles', (req, res) => {
  res.json({ data: roles });
});

app.get('/api/roles/:id', (req, res) => {
  const role = roles.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });
  res.json(role);
});

app.post('/api/roles', (req, res) => {
  const { id, name } = req.body;
  if (roles.find(r => r.id === id)) {
    return res.status(400).json({ error: 'Role already exists' });
  }
  const newRole = { id, name };
  roles.push(newRole);
  res.status(201).json(newRole);
});

app.put('/api/roles/:id', (req, res) => {
  const role = roles.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });

  role.name = req.body.name ?? role.name;
  res.json(role);
});

app.delete('/api/roles/:id', (req, res) => {
  const index = roles.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Role not found' });

  const deletedRole = roles.splice(index, 1);
  res.json(deletedRole[0]);
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
