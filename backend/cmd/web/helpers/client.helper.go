package helpers

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

// handler of the error client (404, 405, etc)
func (help *Helpers) ClientError(w http.ResponseWriter, status int) {
	w.WriteHeader(status)
	
}

func (help *Helpers) Getfile(file multipart.File, filename string) (*os.File, error) {
	// Define the full path to the file in the public directory
	dir := "../frontend/public/upload"
	if err := os.MkdirAll(dir, os.ModePerm); err != nil {
			fmt.Println("Error creating directory:", err)
			return nil, err
	}

	filePath := filepath.Join(dir, filename)

	// Create the file at the specified path
	tempFile, err := os.Create(filePath)
	if err != nil {
			fmt.Println("Error creating file:", err)
			return nil, err
	}
	defer tempFile.Close()

	// Copy the content from the uploaded file to the created file
	_, err = io.Copy(tempFile, file)
	if err != nil {
			return nil, err
	}

	return tempFile, nil
}
