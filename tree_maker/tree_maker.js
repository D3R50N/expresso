const tree = `├── config/
│   ├── config.js
│   ├── db.js
├── controllers/
│   ├── userController.js
│   ├── authController.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── errorHandler.js
├── models/
│   ├── userModel.js
│   ├── postModel.js
├── routes/
│   ├── userRoutes.js
│   ├── authRoutes.js
│   ├── index.js
├── services/
│   ├── authService.js
│   ├── userService.js
├── utils/
│   ├── logger.js
│   ├── constants.js
├── views/
│   ├── index.ejs
│   ├── error.ejs
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md`
  .split("├── ")
  .filter((item) => item !== "")
  .map((item) => item.replace(/\n/g, "").replaceAll("│   ", ""));

const fs = require("fs");
const path = require("path");

var current_path = "";
for(let i = 0; i < tree.length; i++) {
  let item = tree[i];
  if(item.includes("/")) {
    current_path = path.join(__dirname, item);
    fs.mkdirSync(current_path, { recursive: true });
  } else {
    fs.writeFileSync(path.join(current_path, item), "");
  }
}