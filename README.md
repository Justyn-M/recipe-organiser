# Repository Details
This repository outlines a personal project of mine that I have created for my own personal use amoung myself and trusted individuals.
The repository contains a recipe storage web app created using React and Firebase.

# How to use code for your own projects

1) Create a firebase project.
2) Add blaze plan to the project (need due to storage)
3) Add authentication (email & password), firestore database & storage.
   == This project uses a shared user system for authentication. It is advised to copy the authentication system when forking the repository and recreating the project.
   == If you change the authentication system, please ensure to make changes accordingly to the code.
5) Add 'invitations' & 'recipes' collection to the database.
6) Add a document into invitations:
  Doc-Name
  assigned - true
  deviceId - string - <leave blank>
  userId - string - <email you put into authentication>
7) Add a document into recipes:
  Doc-Name <auto-ID>
  cookTime - string - <leave blank>
  creatorName - string - <leave blank>
  ingredients - array - string - <leave blank>
  photo - string - <leave blank>
  recipeName - string - <leave blank>
  steps - array - string - <leave blank>
  timestamp - timestamp
8) Connect your firebase project to your code fork.
9) Ensure connection between firebase storage to the database
10) Run npm start in your code editor's terminal
11) Debug/continue developing as needed

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
