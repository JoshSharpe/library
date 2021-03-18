package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	library "github.com/joshsharpe/home-library/pkg"
)

const (
	bookTable       = "books"
	bookIdPathParam = "id"

	missingPathParamError = "Could not complete request. No book id specified in the path."
	isbnDoesNotMatchError = "Could not complete request. ISBN for the book to be updated does not match the changed book."
	invalidOperationError = "Invalid Http Operation."
)

var defaultHeaders = map[string]string{
	"Content-Type":                "application/json",
	"Access-Control-Allow-Origin": "*",
}

type ApiGwFn func(req events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error)

func main() {
	region := os.Getenv("AWS_REGION")
	db, err := library.CreateDynamoDao(region, bookTable)
	if err != nil {
		log.Fatal("Unable to connect to a database.")
	}
	lambda.Start(handleAll(db))
}

func handleAll(db library.Dao) ApiGwFn {
	return func(req events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
		switch req.HTTPMethod {
		case http.MethodGet:
			return handleGetRequest(req, db)
		case http.MethodPost:
			return handlePostRequest(req, db)
		case http.MethodPut:
			return handlePutRequest(req, db)
		case http.MethodDelete:
			return handleDeleteRequest(req, db)
		default:
			return buildErrorResponse(errors.New(invalidOperationError))
		}
	}
}

func handleGetRequest(req events.APIGatewayProxyRequest, db library.Dao) (*events.APIGatewayProxyResponse, error) {
	bookIsbn, doesExist := req.PathParameters[bookIdPathParam]
	if doesExist {
		book, err := db.GetBook(bookIsbn)
		return buildResponse(http.StatusOK, err, book)
	}

	books, err := db.ListBooks()
	return buildResponse(http.StatusOK, err, books)
}

func handlePostRequest(req events.APIGatewayProxyRequest, db library.Dao) (*events.APIGatewayProxyResponse, error) {
	bookToCreate := library.Book{}

	err := json.Unmarshal([]byte(req.Body), &bookToCreate)
	if err != nil {
		return buildErrorResponse(err)
	}

	resp, err := db.CreateBook(bookToCreate)
	return buildResponse(http.StatusCreated, err, resp)
}

func handlePutRequest(req events.APIGatewayProxyRequest, db library.Dao) (*events.APIGatewayProxyResponse, error) {
	bookIsbn, doesExist := req.PathParameters[bookIdPathParam]
	if !doesExist {
		return buildErrorResponse(errors.New(missingPathParamError))
	}

	bookToUpdate := library.Book{}

	err := json.Unmarshal([]byte(req.Body), &bookToUpdate)
	if err != nil {
		return buildErrorResponse(err)
	}

	if bookIsbn != bookToUpdate.Isbn {
		return buildErrorResponse(errors.New(isbnDoesNotMatchError))
	}

	resp, err := db.UpdateBook(bookToUpdate)
	return buildResponse(http.StatusOK, err, resp)
}

func handleDeleteRequest(req events.APIGatewayProxyRequest, db library.Dao) (*events.APIGatewayProxyResponse, error) {
	bookIsbn, doesExist := req.PathParameters[bookIdPathParam]
	if !doesExist {
		return buildErrorResponse(errors.New(missingPathParamError))
	}

	err := db.DeleteBook(bookIsbn)
	return buildResponse(http.StatusNoContent, err, nil)
}

func buildErrorResponse(errorFound error) (*events.APIGatewayProxyResponse, error) {
	statusCode := http.StatusInternalServerError

	switch {
	case strings.Contains(errorFound.Error(), library.CreateConflictError):
		statusCode = http.StatusConflict
	case strings.Contains(errorFound.Error(), library.InvalidFormatError):
		statusCode = http.StatusBadRequest
	case strings.Contains(errorFound.Error(), library.DoesNotExistError):
		statusCode = http.StatusNotFound
	case strings.Contains(errorFound.Error(), missingPathParamError):
		statusCode = http.StatusBadRequest
	case strings.Contains(errorFound.Error(), isbnDoesNotMatchError):
		statusCode = http.StatusBadRequest
	case strings.Contains(errorFound.Error(), invalidOperationError):
		statusCode = http.StatusMethodNotAllowed
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers:    defaultHeaders,
		Body:       string(errorFound.Error()),
	}, nil

}

func buildResponse(successStatus int, errorFound error, responseObject interface{}) (*events.APIGatewayProxyResponse, error) {

	if errorFound != nil {
		return buildErrorResponse(errorFound)
	}

	if responseObject == nil || successStatus == http.StatusNoContent {
		return &events.APIGatewayProxyResponse{
			StatusCode: http.StatusNoContent,
			Body:       "",
			Headers:    defaultHeaders,
		}, nil
	}

	data, err := json.Marshal(responseObject)
	if err != nil {
		return &events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Headers:    defaultHeaders,
			Body:       "Unable to parse response.",
		}, nil
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: successStatus,
		Body:       string(data),
		Headers:    defaultHeaders,
	}, nil
}
