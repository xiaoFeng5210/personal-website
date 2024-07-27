package test_service

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Item struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
	Desc string `json:"desc"`
}

var testData = []Item{}

func RegisterRoutes(router *gin.Engine) {
	testGroup := router.Group("/test")
	{
		testGroup.GET("/ping", ping)
		// 可以在此处添加更多的路由
		testGroup.GET("/data", getData)

		testGroup.GET("/add", addItem)

		testGroup.GET("/changeDesc", changeDesc)
	}
}

func ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code":    0,
		"message": "pong",
	})
}

func getData(c *gin.Context) {
	if testData != nil {
		c.JSON(http.StatusOK, gin.H{
			"code": 0,
			"data": testData,
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"code":    -1,
			"message": "No data",
		})
	}
}

func addItem(c *gin.Context) {
	item := Item{
		Name: "名称",
		Age:  18,
		Desc: "描述",
	}
	// 先检查testData是否包含item
	for _, v := range testData {
		if v.Name == item.Name {
			c.JSON(http.StatusAccepted, gin.H{
				"code":    -1,
				"message": "Item already exists",
			})
			return
		}
	}
	testData = append(testData, item)
	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": item,
	})
}

func changeDesc(c *gin.Context) {

}
