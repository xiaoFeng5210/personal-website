package mylearnclass

import "fmt"

type A struct {
	name string
	age  int32
}

func PrintCall() {
	a := A{"Tom", 20}
	fmt.Println(a.name, a.age)
}

func NewA() A {
	return A{"Tom", 20}
}

func (obj A) ChangeName(rename string) {
	obj.name = rename
	fmt.Println(obj.name)
}
