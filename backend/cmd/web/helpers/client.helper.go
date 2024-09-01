package helpers

import (
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
)

// handler of the error client (404, 405, etc)
func (help *Helpers) ClientError(w http.ResponseWriter, status int) {
	w.WriteHeader(status)
	
}

func (help *Helpers) Getfile(file multipart.File) (*os.File, error) {
	tempFile, err := ioutil.TempFile("./../frontend/public", "upload-*.jpg")
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer tempFile.Close()

	_, err = io.Copy(tempFile, file)
	if err != nil {
		return nil, err
	}
	return tempFile, nil
}