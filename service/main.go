package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	// 创建一个默认的 Gin 路由器
	r := gin.Default()

	// 设置一个简单的 GET 路由
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// 启动并运行 HTTP 服务器
	r.Run(":2024") // 监听并在 0.0.0.0:8080 上启动服务
}
