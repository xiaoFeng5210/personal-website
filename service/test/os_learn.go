package test

import (
	"os"
	"testing"
)

func TestOS01(t *testing.T) {
	f, err := os.Create("test.txt")
	if err != nil {
		panic(err)
	}

	defer f.Close()
}
