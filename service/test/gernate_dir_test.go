package test

import (
	"encoding/json"
	"fmt"
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

func parseMap(mapData map[string]interface{}, stParentDir string) {
	for k, v := range mapData {
		switch v.(type) {
		case string:
			{
				path, _ := v.(string)
				if path == "" {
					continue
				}
				if stParentDir != "" {
					path = stParentDir + stSeparator + path
					if k == "text" {
						stParentDir = path
					}
				} else {
					stParentDir = path
				}

				createDir(path)
			}

		case []any:
			{
				parseArray(v.([]any), stParentDir)
			}
		}
	}
}

func parseArray(giJsonData []any, stParentDir string) {
	for _, v := range giJsonData {
		mapV, _ := v.(map[string]interface{})
		parseMap(mapV, stParentDir)
	}
}

func createDir(path string) {
	fmt.Println(path)
	if path == "" {
		return
	}
}

func TestGenerateDir(t *testing.T) {
	loadJson()
	parseMap(iJsonData, "")
}
