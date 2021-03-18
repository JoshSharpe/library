package main

import (
	"encoding/json"
	"flag"
	"log"
	"os"

	library "github.com/joshsharpe/home-library/pkg"
)

const (
	listOp   = "list"
	createOp = "create"

	getOp    = "get"
	updateOp = "update"
	deleteOp = "delete"

	invalidOp = "invalid"

	emptyBody = "empty"
)

var operation *string
var body *string
var isbn *string

func init() {
	operation = flag.String("operation", invalidOp, "The database operation to do.")
	body = flag.String("body", emptyBody, "The book to be parsed.")
	isbn = flag.String("isbn", emptyBody, "The book isbn to be queried.")
}

func main() {
	flag.Parse()
	var bookFromFlag library.Book
	var parseBodyErr error

	db, err := library.CreateDynamoDao(os.Getenv("AWS_REGION"), "books")
	if err != nil {
		log.Fatalf("Unable to initialize database. Err: %s\n", err)
	}

	if *body != emptyBody {
		parseBodyErr = json.Unmarshal([]byte(*body), &bookFromFlag)
	}

	switch *operation {
	case listOp:
		books, err := db.ListBooks()
		if err != nil {
			log.Fatalf("Issue listing all books. Err: %s\n", err)
		}
		log.Printf("Books Found: %+v\n", books)

	case createOp:
		if *body == emptyBody {
			log.Fatal("Did not parse body from flag.")
		}
		if parseBodyErr != nil || bookFromFlag.Isbn == "" {
			log.Fatalf("Failed to parse body from flag. Err: %s\n", parseBodyErr)
		}
		bookCreated, err := db.CreateBook(bookFromFlag)
		if err != nil {
			log.Fatalf("Failed to create book. Err: %s\n", err)
		}
		log.Printf("Books Created: %+v\n", bookCreated)

	case getOp:
		if *isbn == emptyBody {
			log.Fatal("Did not parse isbn from flag.")
		}

		book, err := db.GetBook(*isbn)
		if err != nil {
			log.Fatalf("Failed to retrieve book. Err: %s\n", err)
		}
		log.Printf("Books Found: %+v\n", book)

	case updateOp:
		if *isbn == emptyBody {
			log.Fatal("Did not parse isbn from flag.")
		}
		if *body == emptyBody {
			log.Fatal("Did not parse body from flag.")
		}
		if parseBodyErr != nil || bookFromFlag.Isbn == "" {
			log.Fatalf("Failed to parse body from flag. Err: %s\n", parseBodyErr)
		}
		bookUpdated, err := db.UpdateBook(bookFromFlag)
		if err != nil {
			log.Fatalf("Failed to create book. Err: %s\n", err)
		}
		log.Printf("Books Updated: %+v\n", bookUpdated)

	case deleteOp:
		if *isbn == emptyBody {
			log.Fatal("Did not parse isbn from flag.")
		}

		err := db.DeleteBook(*isbn)
		if err != nil {
			log.Fatalf("Failed to retrieve book. Err: %s\n", err)
		}
		log.Printf("Books Deleted Successfully: %+v\n", *isbn)

	default:
		log.Fatalf("Invalid Operation. Operation: %s\n", *operation)
	}

}

// "{\"author\":{\"first_name\":\"First\",\"last_name\":\"Last\"},\"description\":\"hey does this work?\",\"isbn\":\"abcd\",\"title\":\"test\"}"
