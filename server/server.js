const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

// 创建一个 express 应用
const app = express();
const port = 3000;

// 启用 CORS 支持
app.use(cors());

// 解析 JSON 请求体
app.use(bodyParser.json());

// 配置数据库连接
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // 根据你的 MySQL 配置修改
  password: 'root', // 根据你的 MySQL 配置修改
  database: 'qi_user_db' // 你可以选择一个数据库名称，确保数据库已创建
});

// 连接数据库
db.connect((err) => {
  if (err) {
    console.error('数据库连接失败: ' + err.stack);
    return;
  }
  console.log('已连接到数据库');
});

// 登录接口
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // 简单的表单验证
    if (!username || !password) {
      return res.json({ success: false, message: '用户名和密码不能为空' });
    }
  
    // 查询数据库验证用户
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error('数据库查询失败: ' + err.stack);
        return res.json({ success: false, message: '数据库查询失败' });
      }
  
      // 如果用户存在且密码匹配
      if (results.length > 0) {
        return res.json({ success: true, message: '登录成功' });
      } else {
        return res.json({ success: false, message: '用户名或密码错误' });
      }
    });
  });
  

// 注册接口
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // 简单的表单验证
  if (!username || !password) {
    return res.json({ success: false, message: '用户名和密码不能为空' });
  }

  // 插入数据到数据库
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('数据库插入失败: ' + err.stack);
      return res.json({ success: false, message: '注册失败' });
    }

    res.json({ success: true, message: '注册成功' });
  });
});

// 启动服务器  
app.listen(port, () => {
  console.log(`服务器正在运行，监听端口 ${port}`);
});
