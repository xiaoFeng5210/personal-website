package test

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

var stRootDir string
var stSeparator string
var iJsonData map[string]interface{}

const stJsonFileName = "dir.json"

func loadJson() {
	// 分隔符
	stSeparator = string(filepath.Separator)
	stWorkDir, _ := os.Getwd()
	stRootDir = stWorkDir[0:strings.LastIndex(stWorkDir, stSeparator)]

	gnJsonBytes, _ := os.ReadFile(stWorkDir + stSeparator + stJsonFileName)
	err := json.Unmarshal(gnJsonBytes, &iJsonData)
	if err != nil {
		panic(err)
	}

}

func TestGenerateDir(t *testing.T) {
	loadJson()
}
