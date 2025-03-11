const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const filePath = path.join('db.json');
const data = fs.readFileSync(filePath, 'utf-8');
const db = JSON.parse(data);
const router = jsonServer.router(filePath);
const middlewares = jsonServer.defaults();

server.use(middlewares);

// دعم الكتابة في db.json
server.use(jsonServer.bodyParser);

// إضافة إعادة توجيه للـ API
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}));

// تأكيد عمل CRUD
server.post('/posts', (req, res) => {
    const newPost = {
        id: Date.now(),
        ...req.body
    };
    db.posts.push(newPost); // إضافة للـ db.json
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    res.status(201).json(newPost);
});

server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running on port 3000');
});

module.exports = server;
