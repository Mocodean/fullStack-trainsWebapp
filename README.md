# Webprog-Lab

## Description

This project is a web application developed for educational purposes, demonstrating the implementation of various web technologies and practices. The application provides a comprehensive example of a modern web application stack, including frontend, backend, and database integration.

## Features

The web application offers a range of functionalities, tailored to different types of users: admins, registered users, and guests.

- **User Roles:** The website can be used by three types of users: admins, registered users, and guests.

  - **Admin:** Admins have access to advanced management features and can only be registered manually.
  - **Registered Users:** Users can register and log in to access personalized features such as train reservations.
  - **Guests:** Guests can browse train information .

- **Role-Based Functionality:** Different functionalities are available based on the user's role:
  - **Admins:** Can manage train information, schedules.
  - **Registered Users:** Can plan routes, view detailed train information.
  - **Guests:** Can search for trains, and explore general train information.

These features ensure that each type of user has access to the tools and information they need, enhancing the overall user experience.

## Features

- User authentication with JWT and bcrypt
- Dynamic content rendering with EJS templates
- RESTful API integration with Axios
- Real-time updates with Nodemon
- Code quality and formatting with ESLint and Prettier
- HTML validation with html-validate

## Technologies

- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Version Control:** Git

## Dependencies

Here are the main dependencies used in this project:

### Development Dependencies

- `eslint`: ^8.37.0
- `eslint-config-airbnb-base`: ^15.0.0
- `eslint-config-prettier`: ^8.8.0
- `eslint-plugin-import`: ^2.27.5
- `eslint-plugin-prettier`: ^4.2.1
- `html-validate`: ^8.9.1
- `nodemon`: ^3.1.0
- `prettier`: ^2.8.7

### Production Dependencies

- `axios`: ^1.7.2
- `bcrypt`: ^5.1.1
- `bootstrap`: ^5.3.3
- `cookie-parser`: ^1.4.6
- `ejs`: ^3.1.10
- `express`: ^4.19.2
- `jsonwebtoken`: ^9.0.2
- `morgan`: ^1.10.0
- `mysql2`: ^3.9.7
- `path`: ^0.12.7

## Installation

To get started with this project, follow these steps:

1. **Requirements:**

   - Node.js
   - Git
   - MySQL

2. **Steps:**
   1. Clone the repository:
   2. Navigate to the project directory:
      ```sh
      cd webprog-lab
      ```
   3. Install the required packages:
      ```sh
      npm install
      ```
   4. Set up your MySQL database and update the connection settings in the code.
   5. Start the application:
      ```sh
      npm start
      ```

## Usage

1. Open your browser and navigate to: http://localhost:8080/
2. Explore the features of the web application, including user registration, login, and dynamic content.
