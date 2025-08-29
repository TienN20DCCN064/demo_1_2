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
  {
    id: "Admin",
    name: "ROLE ADMIN",
    mo_ta: "Quyền cao nhất, có thể quản lý người dùng và quyền",
    permissions: {
      GET_LIST_SUBJECT_HISTORY: 1,
      GET_SUBJECT_HISTORY: 1,
      DELETE_GROUP: 1,
      DELETE_GROUP_PERMISSION: 1,
      UPDATE_LECTURE_CONTENT: 1,
      GET_LECTURE_CONTENT: 1,
      GET_LECTURE_CONTENT_BY_ID: 1,
      DELETE_LECTURE_CONTENT: 1,
      CREATE_LECTURE_CONTENT: 1,
      GET_LIST_LECTURE_CONTENT: 1,
      UPLOAD_VIDEO: 1,
      UPLOAD_FILE: 1,
      CREATE_ACCOUNT_BOOK: 1,
      DELETE_ACCOUNT_BOOK: 1,
      GET_ACCOUNT_BOOK: 1,
      GET_LIST_ACCOUNT_BOOK: 1,
      SYNC_BOOK_PERMISSION: 1,
      DELETE_BOOK_PERMISSION: 1,
      GET_BOOK_PERMISSION: 1,
      GET_LIST_BOOK_PERMISSION: 1,
      LIST_ACCOUNT_GROUP: 1,
      GET_ACCOUNT_GROUP: 1,
      DELETE_ACCOUNT_GROUP: 1,
      LIST_CATEGORY: 1,
      GET_CATEGORY: 1,
      UPDATE_CATEGORY: 1,
      CREATE_CATEGORY: 1,
      DELETE_CATEGORY: 1,
      GET_LECTURE_BY_SUBJECT: 1,
      GET_LIST_LECTURE: 1,
      UPDATE_LECTURE: 1,
      CREATE_LECTURE: 1,
      DELETE_LECTURE: 1,
      UPDATE_SORT_LECTURE: 1,
      DELETE_PUBLISHER: 1,
      GET_PUBLISHER: 1,
      CREATE_PUBLISHER: 1,
      GET_LIST_PUBLISHER: 1,
      DELETE_READER: 1,
      GET_READER: 1,
      CREATE_READER: 1,
      GET_LIST_READER: 1,
      UPDATE_READER: 1,
      CREATE_SETTING: 1,
      GET_SETTING: 1,
      GET_LIST_SETTING: 1,
      UPDATE_SETTING: 1,
      CREATE_PERMISSION: 1,
      LIST_PERMISSION: 1,
      UPDATE_GROUP_PERMISSION: 1,
      GET_GROUP_PERMISSION: 1,
      CREATE_GROUP_PERMISSION: 1,
      GET_LIST_GROUP_PERMISSION: 1,
      UPDATE_ADMIN_ACCOUNT: 1,
      CREATE_ADMIN_ACCOUNT: 1,
      DELETE_ACCOUNT: 1,
      GET_ACCOUNT: 1,
      GET_LIST_ACCOUNT: 1,
    },
  },
  {
    id: "Test",
    name: "ROLE TEST",
    mo_ta: "Quyền kiểm tra, có thể xem và kiểm tra nội dung",
    permissions: {
      GET_LIST_SUBJECT_HISTORY: 0,
      GET_SUBJECT_HISTORY: 0,
      DELETE_GROUP: 0,
      DELETE_GROUP_PERMISSION: 0,
      UPDATE_LECTURE_CONTENT: 0,
      GET_LECTURE_CONTENT: 1,
      GET_LECTURE_CONTENT_BY_ID: 1,
      DELETE_LECTURE_CONTENT: 1,
      CREATE_LECTURE_CONTENT: 1,
      GET_LIST_LECTURE_CONTENT: 1,
      UPLOAD_VIDEO: 1,
      UPLOAD_FILE: 1,
      CREATE_ACCOUNT_BOOK: 1,
      DELETE_ACCOUNT_BOOK: 1,
      GET_ACCOUNT_BOOK: 1,
      GET_LIST_ACCOUNT_BOOK: 1,
      SYNC_BOOK_PERMISSION: 1,
      DELETE_BOOK_PERMISSION: 1,
      GET_BOOK_PERMISSION: 1,
      GET_LIST_BOOK_PERMISSION: 1,
      LIST_ACCOUNT_GROUP: 1,
      GET_ACCOUNT_GROUP: 1,
      DELETE_ACCOUNT_GROUP: 1,
      LIST_CATEGORY: 1,
      GET_CATEGORY: 1,
      UPDATE_CATEGORY: 1,
      CREATE_CATEGORY: 1,
      DELETE_CATEGORY: 1,
      GET_LECTURE_BY_SUBJECT: 1,
      GET_LIST_LECTURE: 1,
      UPDATE_LECTURE: 1,
      CREATE_LECTURE: 1,
      DELETE_LECTURE: 1,
      UPDATE_SORT_LECTURE: 1,
      DELETE_PUBLISHER: 1,
      GET_PUBLISHER: 1,
      CREATE_PUBLISHER: 1,
      GET_LIST_PUBLISHER: 1,
      DELETE_READER: 1,
      GET_READER: 1,
      CREATE_READER: 1,
      GET_LIST_READER: 1,
      UPDATE_READER: 1,
      CREATE_SETTING: 1,
      GET_SETTING: 1,
      GET_LIST_SETTING: 1,
      UPDATE_SETTING: 1,
      CREATE_PERMISSION: 1,
      LIST_PERMISSION: 1,
      UPDATE_GROUP_PERMISSION: 1,
      GET_GROUP_PERMISSION: 1,
      CREATE_GROUP_PERMISSION: 1,
      GET_LIST_GROUP_PERMISSION: 1,
      UPDATE_ADMIN_ACCOUNT: 1,
      CREATE_ADMIN_ACCOUNT: 0,
      DELETE_ACCOUNT: 0,
      GET_ACCOUNT: 1,
      GET_LIST_ACCOUNT: 1,
    },
  },
  {
    id: "User",
    name: "ROLE USER",
    mo_ta: "Quyền người dùng, có thể truy cập nội dung cơ bản",
    permissions: {
      GET_LIST_SUBJECT_HISTORY: 1,
      GET_SUBJECT_HISTORY: 0,
      DELETE_GROUP: 0,
      DELETE_GROUP_PERMISSION: 0,
      UPDATE_LECTURE_CONTENT: 0,
      GET_LECTURE_CONTENT: 1,
      GET_LECTURE_CONTENT_BY_ID: 1,
      DELETE_LECTURE_CONTENT: 1,
      CREATE_LECTURE_CONTENT: 1,
      GET_LIST_LECTURE_CONTENT: 1,
      UPLOAD_VIDEO: 1,
      UPLOAD_FILE: 1,
      CREATE_ACCOUNT_BOOK: 1,
      DELETE_ACCOUNT_BOOK: 1,
      GET_ACCOUNT_BOOK: 1,
      GET_LIST_ACCOUNT_BOOK: 1,
      SYNC_BOOK_PERMISSION: 1,
      DELETE_BOOK_PERMISSION: 1,
      GET_BOOK_PERMISSION: 1,
      GET_LIST_BOOK_PERMISSION: 1,
      LIST_ACCOUNT_GROUP: 1,
      GET_ACCOUNT_GROUP: 1,
      DELETE_ACCOUNT_GROUP: 1,
      LIST_CATEGORY: 1,
      GET_CATEGORY: 1,
      UPDATE_CATEGORY: 1,
      CREATE_CATEGORY: 1,
      DELETE_CATEGORY: 1,
      GET_LECTURE_BY_SUBJECT: 1,
      GET_LIST_LECTURE: 1,
      UPDATE_LECTURE: 1,
      CREATE_LECTURE: 1,
      DELETE_LECTURE: 1,
      UPDATE_SORT_LECTURE: 1,
      DELETE_PUBLISHER: 1,
      GET_PUBLISHER: 1,
      CREATE_PUBLISHER: 1,
      GET_LIST_PUBLISHER: 1,
      DELETE_READER: 1,
      GET_READER: 1,
      CREATE_READER: 1,
      GET_LIST_READER: 1,
      UPDATE_READER: 1,
      CREATE_SETTING: 1,
      GET_SETTING: 1,
      GET_LIST_SETTING: 1,
      UPDATE_SETTING: 1,
      CREATE_PERMISSION: 1,
      LIST_PERMISSION: 1,
      UPDATE_GROUP_PERMISSION: 1,
      GET_GROUP_PERMISSION: 1,
      CREATE_GROUP_PERMISSION: 1,
      GET_LIST_GROUP_PERMISSION: 1,
      UPDATE_ADMIN_ACCOUNT: 1,
      CREATE_ADMIN_ACCOUNT: 0,
      DELETE_ACCOUNT: 0,
      GET_ACCOUNT: 1,
      GET_LIST_ACCOUNT: 1,
    },
  },
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
// Lấy users theo phân trang và hỗ trợ tìm kiếm
app.get('/api/users/paging', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const nameSearch = (req.query.name || '').toLowerCase();
  const phoneSearch = (req.query.phone || '').toLowerCase();

  // 1️⃣ Sắp xếp trước
  let sortedUsers = sortUsers(users);

  // 2️⃣ Lọc theo name và phone nếu có
  if (nameSearch || phoneSearch) {
    sortedUsers = sortedUsers.filter(u => {
      const fullName = (u.fullName || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const matchName = !nameSearch || fullName.includes(nameSearch);
      const matchPhone = !phoneSearch || phone.includes(phoneSearch);
      return matchName && matchPhone;
    });
  }

  // 3️⃣ Tính chỉ số phân trang
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 4️⃣ Lấy danh sách phân trang
  const pagedUsers = sortedUsers.slice(startIndex, endIndex);

  res.json({
    data: pagedUsers,
    page: page,
    pageSize: pageSize,
    total: sortedUsers.length,
    totalPages: Math.ceil(sortedUsers.length / pageSize)
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

// ================= ROLES ===================

// Lấy tất cả roles
app.get('/api/roles', (req, res) => {
  res.json({
    data: roles,
    offset: 0,
    limit: roles.length,
    total: roles.length
  });
});

app.get('/api/roles/page', (req, res) => {
  const { page = 1, pageSize = 10, nameRole } = req.query;

  // 1️⃣ Lọc danh sách roles theo nameRole (nếu có)
  let filteredRoles = roles;
  if (nameRole) {
    filteredRoles = filteredRoles.filter(r => r.name.toLowerCase().includes(nameRole.toLowerCase()));
  }

  // 2️⃣ Sắp xếp danh sách roles
  filteredRoles.sort((a, b) => a.name.localeCompare(b.name));

  // 3️⃣ Tính chỉ số phân trang
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // 4️⃣ Lấy danh sách phân trang
  const pagedRoles = filteredRoles.slice(startIndex, endIndex);

  res.json({
    data: pagedRoles,
    page: page,
    pageSize: pageSize,
    total: filteredRoles.length,
    totalPages: Math.ceil(filteredRoles.length / pageSize)
  });
});

// Lấy 1 role theo id
app.get('/api/roles/:id', (req, res) => {
  const role = roles.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });
  res.json(role);
});

// Tạo mới role với permissions mặc định 0
app.post('/api/roles', (req, res) => {
  const { id, name, mo_ta } = req.body;
  if (roles.find(r => r.id === id)) {
    return res.status(400).json({ error: 'Role already exists' });
  }

  // Tạo permissions mặc định = 0 dựa trên các key của role "Admin"
  const defaultPermissions = {};
  Object.keys(roles[0].permissions).forEach(key => defaultPermissions[key] = 0);

  const newRole = { id, name, mo_ta, permissions: defaultPermissions };
  roles.push(newRole);
  res.status(201).json(newRole);
});

// Cập nhật role (có thể sửa name, mo_ta, permissions)
app.put('/api/roles/:id', (req, res) => {
  const role = roles.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: 'Role not found' });

  const { name, mo_ta, permissions } = req.body;
  role.name = name ?? role.name;
  role.mo_ta = mo_ta ?? role.mo_ta;

  // Nếu gửi permissions thì cập nhật
  if (permissions) {
    role.permissions = { ...role.permissions, ...permissions };
  }

  res.json(role);
});

// Xóa role
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
