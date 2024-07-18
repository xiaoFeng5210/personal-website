package main

import (
	"service/test_service"

	"github.com/gin-gonic/gin"
)

func main() {
	// 创建一个默认的 Gin 路由器
	r := gin.Default()
	test_service.RegisterRoutes(r)
	r.Run(":2024")
}
