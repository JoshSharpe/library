

AWS_REGION="us-east-1" go run main.go -operation=list

AWS_REGION="us-east-1" go run main.go -operation=create -body="{\"author\":{\"first_name\":\"First\",\"last_name\":\"Last\"},\"description\":\"hey does this work?\",\"isbn\":\"abcd\",\"title\":\"test\"}" 

AWS_REGION="us-east-1" go run main.go -operation=get -isbn=abc

AWS_REGION="us-east-1" go run main.go -operation=delete -isbn=abc

AWS_REGION="us-east-1" go run main.go -operation=update -isbn=abcd -body="{\"author\":{\"first_name\":\"First\",\"last_name\":\"Last\"},\"description\":\"checking out the update.\",\"isbn\":\"abcd\",\"title\":\"test\"}" 