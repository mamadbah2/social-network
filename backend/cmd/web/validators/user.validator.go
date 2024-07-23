package validators

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"strings"
	"unicode/utf8"
)


func (v *Validator) Valid() bool {
	return len(v.FieldErrors) == 0 && len(v.NonFieldErrors) == 0
}

func (v *Validator) AddFieldError(key, message string) {
	if v.FieldErrors == nil {
		v.FieldErrors = make(map[string]string)
	}
	if _, exists := v.FieldErrors[key]; !exists {
		v.FieldErrors[key] = message
	}
}
func (v *Validator) AddNonFieldError(message string) {
	v.NonFieldErrors = append(v.NonFieldErrors, message)
}

func (v *Validator) CheckField(ok bool, key, message string) {
	if !ok {
		v.AddFieldError(key, message)
	}
}

func (v *Validator) CheckUsernameExists(username string) (bool, error) {
	var exists bool
	if v.DB == nil {
		return false, fmt.Errorf("database connection is not initialized")
	}
	// Prepare a query to check if the username exists
	stmt := `SELECT EXISTS(SELECT 1 FROM user WHERE nickname =? LIMIT 1)`
	err := v.DB.QueryRow(stmt, username).Scan(&exists)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// No rows were returned, which means the username does not exist
			return false, nil
		} else{
			// An error occurred
			return false, err
		}
	}
	return exists, nil
}

func NotBlank(value string) bool {
	return strings.TrimSpace(value) != ""
}
func NotBlankInt(value int) bool {
	return value != 0
}

func CheckAge(value int, n int) bool {
	if value > 15 && value < n {
		return true
	}
	return false
}

func NotNull(tab []int) bool {
	return len(tab) != 0
}

func MaxChars(value string, n int) bool {
	return utf8.RuneCountInString(value) <= n
}

func CheckValue(value int, n int) bool {
	if value > n || value < 1 {
		return false
	}
	return true
}

var EmailRX = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")

func MinChars(value string, n int) bool {
	return utf8.RuneCountInString(value) >= n
}

func Matches(value string, rx *regexp.Regexp) bool {
	return rx.MatchString(value)
}

func IsImage(contentType string) bool {
	imageMIMETypes := []string{
		"image/jpeg",
		"image/png",
		"image/gif",
	}

	for _, mimeType := range imageMIMETypes {
		if contentType == mimeType {
			return true
		}
	}
	return false
}

func VerifyImg(filePath string) bool {
	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return false
	}
	defer file.Close()
	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return false
	}

	contentType := http.DetectContentType(buffer)
	if IsImage(contentType) {
		return true
	} else {
		return false
	}
}

func CheckFileSize(filePath string) bool {
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		fmt.Println("Error getting file size:", err)
		return false
	}
	fileSize := fileInfo.Size()

	return fileSize < (20 << 20)
}
