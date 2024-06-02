
# Expresso

Expresso is a command-line interface (CLI) tool designed to quickly generate ExpressJS projects with a predefined structure. It helps standardize your projects and allows you to get started quickly with a ready-to-use configuration.

## Installation

To install Expresso globally on your machine, use npm:

```sh
npm install -g @happy.dev/expresso
```

## Usage

To create a new ExpressJS project with Expresso, use the following command:

```sh
expresso new myapp
```

This command will create a new folder named `myapp` with the following project structure:

```bat
myapp/
├── config/
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
├── .gitignore
├── app.js
├── package.json
└── README.md
```

To see available commands, use the following command:

```sh
expresso help
```

or

```sh
expresso -h
```

## Project Structure

- **config/**: Contains application configuration files.
- **controllers/**: Contains functions that handle HTTP requests and responses.
- **middlewares/**: Contains middlewares to process requests before they reach the controllers.
- **models/**: Contains data models for the application.
- **routes/**: Contains route definitions.
- **services/**: Contains business logic, complex interactions, and service calls.
- **utils/**: Contains reusable utilities for the application.
- **views/**: Contains view templates (if using a template engine like EJS).
- **app.js**: Main entry point of the Express application.
- **package.json**: npm configuration file.
- **README.md**: Project documentation.

## Contributions

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
