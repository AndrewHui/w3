# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). TinyApp comes with login and registration functionality. It has access constraints depending on the user authentication. Cookies are secured through Cookie Session and passwords are hashed through b.crypt. 

## Final Product

!["Screenshot of the registration page"](https://github.com/AndrewHui/w3/blob/master/tinyapp/Docs/RegistrationPage.png)
!["Screenshot of the URL home page"](https://github.com/AndrewHui/w3/blob/master/tinyapp/Docs/URLhomepage.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Navigation

- Create and start the server
- Once at the home page, please login or register your account
- Logged in users may create tiny URLs from the "Create New URL" page
- Once on the "Create New URL" page, please enter a URL that you would like to create a tiny URL for
- On the tinyURL page, you may edit the URL or be redirected to the URL page
- Clicking on "My URLs" will display all URLs that are associated to your account from the database
- All URLs are private to the user, however, the path of the URL can be shared to other users and will be redirected to the page
- Tiny URLs can be deleted on your "My URLs" page

Please report any additional issues to AndrewHui@github