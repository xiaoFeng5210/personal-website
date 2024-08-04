package main

import (
	"fmt"
	"os"
)

func main() {
	// 创建一个默认的 Gin 路由器
	// r := gin.Default()
	// test_service.RegisterRoutes(r)
	// r.Run(":2024")
	readText()

}

func openFileTest() {
	f, err := os.Create("test.txt")
	if err != nil {
		return
	}

	defer f.Close()
}

func readText() {
	f, err := os.ReadFile("test.txt")
	if err != nil {
		return
	}

	var fstr interface{}

	fstr = string(f)
	v, ok := fstr.(string)
	if ok {
		fmt.Println(v)
	}
}
