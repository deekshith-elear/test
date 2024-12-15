package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
)

func parseDynamicJSON(filename string) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		log.Fatalf("Failed to read file: %v", err)
	}

	// Parse JSON into a generic map
	var result map[string]interface{}
	err = json.Unmarshal(data, &result)
	if err != nil {
		log.Fatalf("Failed to parse JSON: %v", err)
	}

	// Process the dynamic JSON
	for key, value := range result {
		fmt.Printf("Key: %s, Value: %v\n", key, value)
		if key == "dataItems" {
			fmt.printf(value[data][Perc99])
		}
	}
}

func main() {
	parseDynamicJSON("dynamic.json")
}