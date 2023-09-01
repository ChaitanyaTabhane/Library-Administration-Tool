# Library Administration Tool

Welcome to the Library Administration Tool! This tool is designed to help manage various aspects of library administration, including issues, members, and books. The complete working code can be found in the "complete" branch of this repository.

## Getting Started
1. Clone this repository to your local machine.

```bash
git clone https://gitlab.stackroute.in/group20/lat_web.git
```

2. Change the directory to lat_web

```bash
cd lat_web
```
3. Switch to the "complete" branch.

```bash
git switch complete
```
4. Start the website by opening the landing_page.html file in your web browser.

5. ID and Password for Login Page is admin, admin
## JSON Server Setup
### Issue JSON Server
To host the issue data, you can use json-server. Run the following command to start the issue JSON server on port 5000:

```bash
json-server --watch ./issue.json -p 5000
```
### Members JSON Server
To host the members data, start another instance of json-server with the following command:

```bash
json-server --watch ./members.json
```

### Books JSON Server
For the books data, start another instance of json-server on port 4000:

```bash
json-server --watch ./books1.json -p 4000
```

## HTTPS Node Server
To host the server.html file using an HTTPS node server, follow these steps:

1. Ensure you have Node.js installed on your machine.

2. Navigate to the repository directory in your terminal.

3. Install the required packages by running:

```bash
npm install
```

4. Start the HTTPS node server using the following command:

```bash
node ./server.js
```

The server will be hosted on your local machine and accessible at https://localhost:3000 or http://localhost:8881

## Contributions
Contributions to this library administration tool are welcome! Feel free to submit issues and pull requests to help improve the tool's functionality and user experience.

Feel free to explore the complete working code in the "complete" branch and start using the Library Administration Tool to efficiently manage your library's administration tasks. If you have any questions or need assistance, please don't hesitate to reach out. Happy library administration! 📚
