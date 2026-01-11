# Instagram clone

Thaivivat Frontend Assignmen: Instagram clone

## Requirements

Develop the Instagram-clone web application with your favorite content such as
Pokemon, Star Wars, GitHub which contains requirements below.

1. The design/layout of the web application must similar to Instagram (in web
   version) with a responsive design
2. It fetches content and image from an API (any APIs are allowed to be used)
   e.g. https://developer.github.com/v3/, http://apis.guru/graphql-apis/ ,
   https://github.com/public-apis/public-apis
3. It should provide " search box "
4. It should have " infinite scrolling " feature
5. It should show some effect when user click an image
6. If you have any idea to complete the project, feel free to add more we like to
   see creativity
7. (optional) create your backend API e.g. create your new API, Firebase,
   https://github.com/typicode/json-server .
8. (optional) integration an API with Restful or GraphQL
9. (optional) implement test e.g. unit test, user acceptance test
10. (optional) to enhance the user experience, we like to see the application
    apply
11. (optional) implement ui section with ui freamwork e.g. material ui, ant design
12. (optional) design and implement component service with library eg. react-
    query, rtk-query
13. (optional) implement api for project with headless CMS e.g. strapi

## Pre-requisites

-   Install [Node.js](https://nodejs.org/en/)

## Getting started

-   Open Command Prompt or PowerShell
-   Clone the repository

```
git clone https://github.com/PittawasChoo/thaivivat-frontend-assignment.git
```

-   Install dependencies

```
cd thaivivat-frontend-assignment
npm run install:all
```

-   Run the project

```
npm run dev
```

-   Once the command log shows below logs, the web application is ready to use

```
  VITE v7.3.1  ready in 251 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

and

```
Backend running on http://localhost:4000
```

## Project Structure

```bash
├── backend/
│   ├── db/
│   │   └── *.json (database in json file)
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/ (data type)
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── apis/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── views/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

## Project Features

| Feature                 | Description                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Feed (Home page)        | Show posts with infinite scrolling                                                                                       |
| Search                  | Feature to search accounts with caching recent opened profile                                                            |
| Profile page            | Show user info + images from that user                                                                                   |
| Carousel                | Handle multiple images in one post                                                                                       |
| Show tags               | Show tag of the image by click on the image (If there are more than 1 images in a post, each image can have it own tags) |
| Like/Unlike             | Feature that allow user to like post by clicking heart icon or double click on image                                     |
| Profile card            | Hover image or username in post to show profile card                                                                     |
| Responsive UI           | Support many screen size                                                                                                 |
| Handle not support link | If the link is invalid, the page will show error message + back and home button (improve UX)                             |
