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
  { id: 1, fullName: 'Peter Mackenzie', email: 'peter@example.com', userName: 'pmackenzie', password: 'admin123', roleId: 'Admin', phone: '123456789', image: '/images/images_api/img1.jpg' },
  { id: 2, fullName: 'Cind Zhang', email: 'cindy@example.com', userName: 'czhang', password: 'test123', roleId: 'Test', phone: '987654321', image: '' },
  { id: 3, fullName: 'Ted Smith', email: 'ted@example.com', userName: 'tsmith', password: 'test456', roleId: 'Test', phone: '456789123', image: '/images/images_api/cms.png' },
  { id: 4, fullName: 'Susan Fernbrook', email: 'susan@example.com', userName: 'sfern', password: 'test789', roleId: 'Test', phone: '321654987', image: '/images/images_api/img1.jpg' },
  { id: 5, fullName: 'Emily Kim', email: 'emily@example.com', userName: 'ekim', password: 'admin456', roleId: 'Admin', phone: '654321789', image: '/images/images_api/cms.png' },
  { id: 6, fullName: 'Peter Zhang', email: 'pzhang@example.com', userName: 'pzhang', password: 'user123', roleId: 'User', phone: '789456123', image: '/images/images_api/cms.png' },
  { id: 7, fullName: 'Cindy Smith', email: 'csmith@example.com', userName: 'csmith', password: 'user456', roleId: 'User', phone: '321654987', image: '/images/images_api/img1.jpg' },
  { id: 8, fullName: 'Ted Fernbrook', email: 'tedf@example.com', userName: 'tfern', password: 'test999', roleId: 'Test', phone: '654321789', image: '/images/images_api/cms.png' },
  { id: 9, fullName: 'Susan Kim', email: 'susan.k@example.com', userName: 'skim', password: 'user789', roleId: 'User', phone: '789456123', image: '/images/images_api/cms.png' },
  { id: 10, fullName: 'Emily Mackenzie', email: 'emac@example.com', userName: 'emac', password: 'admin789', roleId: 'Admin', phone: '321654987', image: '/images/images_api/cms.png' },
];

// Bảng quyền
let roles = [
  { id: "Admin", name: "ROLE ADMIN" },
  { id: "Test", name: "ROLE TEST" },
  { id: "User", name: "ROLE USER" }
];
// Hàm sắp xếp người dùng theo fullName
function sortUsers(usersArray) {
  // Clone mảng để không mutate dữ liệu gốc
  const sortedUsers = [...usersArray].sort((a, b) => {
    const nameA = (a.fullName || "").trim().toLowerCase();
    const nameB = (b.fullName || "").trim().toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Thêm index (STT)
  const usersWithIndex = sortedUsers.map((user, index) => ({
    ...user,
    index: index + 1
  }));

  return usersWithIndex;
}

// ================= USERS ===================
// Lấy users theo phân trang
app.get('/api/users/paging', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  // 1️⃣ Sắp xếp trước
  const sortedUsers = sortUsers(users);

  // 2️⃣ Tính chỉ số phân trang
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 3️⃣ Lấy danh sách phân trang
  const pagedUsers = sortedUsers.slice(startIndex, endIndex);

  res.json({
    data: pagedUsers,
    page: page,
    pageSize: pageSize,
    total: users.length,
    totalPages: Math.ceil(users.length / pageSize)
  });
});


// Lấy toàn bộ users nhưng giả lập trả về rỗng
app.get('/api/users', (req, res) => {
  res.json({
    data: [],   // 👈 trả về rỗng
    offset: 0,
    limit: 0,
    total: 0
  });
});

// ================= USERS ===================

// Lấy toàn bộ users
// app.get('/api/users', (req, res) => {
//   res.json({
//     data: users,
//     offset: 0,
//     limit: users.length,
//     total: users.length
//   });
// });

// Lấy 1 user theo id
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { fullName, email, userName, password, roleId, phone, image } = req.body;

  // Bỏ email ra khỏi validate
  if (!fullName || !userName || !password || !roleId || !phone || !image) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    fullName,
    email: email || "",  // nếu không có email, để rỗng
    userName,
    password,
    roleId,
    phone,
    image: image || ""
  };
  users.push(newUser);
  res.status(201).json(newUser);
});


app.put('/api/users/:id', (req, res) => {
  const { fullName, email, userName, password, roleId, phone, image } = req.body;
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.fullName = fullName ?? user.fullName;
  // Cho phép email và image rỗng, nếu không gửi thì giữ nguyên
  if (email !== undefined) user.email = email;
  user.userName = userName ?? user.userName;
  user.password = password ?? user.password;
  user.roleId = roleId ?? user.roleId;
  user.phone = phone ?? user.phone;
  user.image = image ?? user.image;


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
// phân trang

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
