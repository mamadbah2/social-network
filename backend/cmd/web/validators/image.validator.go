package validators

import (
	"bytes"
	"mime/multipart"
)

func (v *Validator) ImageValidation(img multipart.File) bool {
	buf := make([]byte, 8)
	if _, err := img.Read(buf); err != nil {
		return false
	}
	if bytes.HasPrefix(buf, []byte("\xff\xd8")) || bytes.HasPrefix(buf, []byte("\x89\x50\x4e\x47")) || bytes.HasPrefix(buf, []byte("GIF89a")) || bytes.HasPrefix(buf, []byte("GIF87a")) || bytes.HasPrefix(buf, []byte("BM")) {
		return true
	}

	return false
}
