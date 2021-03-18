This is a small coding project for library management. It's a very basic website, using a React front-end and AWS's API Gateway and Lambdas (written in Go) to do the backend operations. So far, it's been quickly thrown together so the code isn't particularly clean and tests have not been written.

# Requirements
 * API for CRUD of a books, managing title, author, isbn, description
 * Ability to manage books through a web interface
 * Ability to check in and check out a book
 * Ability to track state changes for a book
 * Report that contains the current state of all books

# File Structure Overview
## /client
All the frontend code lives here. As mentioned, it's a standard react project. React router was throwing a fit and state wasn't complex enough for redux so it has both of those done "manually" for now. 

/client/src/api: contains all the api calls need to manage book data in the library.
/client/src/components: contains all of the react components and css

## /server

api.yaml: An export of the currently running API Gateway configuration. Can be modified and redeployed to API Gateway for any changes. It's a basic swagger file with aws extensions so it could be run locally using swagger's server generation code.

pkg: Contains some information on the data structures and a dao for data operations against a dynamo db.
pkg/dao.go: This provides means to change the database, as long as a dao is created that meets the same interface, with no changes to the lambda/server code.

lambdas/deploy.sh: A script to deploy lambdas to aws. AWS config must be set on the local environment where run.
lambdas/books: Contains all of the REST handlers for book operations. In order to maximuize maintainability without losing benefits of lambdas, one function was created to handle all books operations. If the API is extended to contain more resources then more functions would be introduced. For example, a `user` resource and lambda service may be created to track who has checked out what.

cmd/dynamo_db_test: This was created just to test the dao.go code without api gateway or lambdas in the way. Isolating any debugging.

# Running

## Client
To run the client, enter the client directory. Create a .env with these two envs defined:
```
REACT_APP_API_URL=
REACT_APP_API_KEY=
```

Execute:
`npm i`
`npm run start` 

##