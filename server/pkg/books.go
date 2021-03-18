package library

const (
	Checkout             UpdateType = "checkout"
	Checkin              UpdateType = "checkin"
	AddToCollection      UpdateType = "add_to_collection"
	RemoveFromCollection UpdateType = "remove_from_collection"
)

type UpdateType string

type Book struct {
	Title         string   `json:"title"`
	Author        Author   `json:"author"`
	Isbn          string   `json:"isbn"`
	QuantityIn    int      `json:"quantity_available"`
	QuantityTotal int      `json:"quantity_total"`
	Description   string   `json:"description"`
	History       []Update `json:"history"`
}

type Author struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type Update struct {
	UpdateType  `json:"type"`
	Time        string `json:"time"`
	Author      string `json:"author"`
	Description string `json:"description"`
}
