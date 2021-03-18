package library

import (
	"errors"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

const (
	CreateConflictError string = "Could not create book because it already exists."
	InvalidFormatError  string = "Could not process database query. Invalid format."
	DoesNotExistError   string = "The item queried for does not exist."
)

type Dao interface {
	ListBooks() ([]Book, error)
	CreateBook(newBook Book) (*Book, error)

	GetBook(isbn string) (*Book, error)
	UpdateBook(updatedBook Book) (*Book, error)
	DeleteBook(isbn string) error

	// SearchByTitle(title string) ([]Book, error)
	// SearchByAuthor(lastName string) ([]Book, error)
}

type DynamoDao struct {
	db        dynamodbiface.DynamoDBAPI
	tableName string
}

func CreateDynamoDao(region, tableName string) (*DynamoDao, error) {
	awsSession, err := session.NewSession(&aws.Config{
		Region: aws.String(region)},
	)
	if err != nil {
		return nil, err
	}
	return &DynamoDao{
		db:        dynamodb.New(awsSession),
		tableName: tableName,
	}, nil
}

func (d *DynamoDao) ListBooks() ([]Book, error) {
	input := &dynamodb.ScanInput{
		TableName: aws.String(d.tableName),
	}

	result, err := d.db.Scan(input)
	if err != nil {
		return nil, err
	}

	books := []Book{}
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &books)
	return books, err
}

func (d *DynamoDao) CreateBook(newBook Book) (*Book, error) {

	book, _ := d.GetBook(newBook.Isbn)
	if book != nil {
		return nil, errors.New(CreateConflictError)
	}

	av, err := dynamodbattribute.MarshalMap(newBook)
	if err != nil {
		return nil, errors.New(InvalidFormatError)
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(d.tableName),
	}

	_, err = d.db.PutItem(input)
	if err != nil {
		return nil, err
	}
	return &newBook, nil
}

func (d *DynamoDao) GetBook(isbn string) (*Book, error) {
	input := &dynamodb.GetItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"isbn": {
				S: aws.String(isbn),
			},
		},
		TableName: aws.String(d.tableName),
	}

	result, err := d.db.GetItem(input)
	if err != nil {
		return nil, err
	}

	if len(result.Item) == 0 {
		return nil, errors.New(DoesNotExistError)
	}

	book := &Book{}
	err = dynamodbattribute.UnmarshalMap(result.Item, book)
	if err != nil {
		return nil, err
	}
	return book, nil
}

func (d *DynamoDao) UpdateBook(updatedBook Book) (*Book, error) {
	bookInDb, err := d.GetBook(updatedBook.Isbn)
	if err != nil {
		return nil, err
	}
	if bookInDb == nil {
		return nil, errors.New(DoesNotExistError)
	}

	av, err := dynamodbattribute.MarshalMap(updatedBook)
	if err != nil {
		return nil, err
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(d.tableName),
	}

	_, err = d.db.PutItem(input)
	if err != nil {
		return nil, err
	}
	return &updatedBook, nil
}

func (d *DynamoDao) DeleteBook(isbn string) error {
	input := &dynamodb.DeleteItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"isbn": {
				S: aws.String(isbn),
			},
		},
		TableName: aws.String(d.tableName),
	}
	_, err := d.db.DeleteItem(input)
	if err != nil {
		return err
	}

	return nil
}

// func (d *DynamoDao) SearchByTitle(title string) ([]Book, error) {

// }

// func (d *DynamoDao) SearchByAuthor(lastName string) ([]Book, error) {

// }
