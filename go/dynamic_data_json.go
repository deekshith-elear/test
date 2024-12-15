package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"strconv"
)

// Function to process and generate the metric string from any of the structures
func processJSON(jsonData map[string]interface{}) string {
	metric_string := ""
	// Check if the 'dataItems' key exists (this indicates JSON1 or JSON2 structure)
	if dataItems, ok := jsonData["dataItems"].([]interface{}); ok {
		for _, item := range dataItems {
			if itemMap, ok := item.(map[string]interface{}); ok {
				if labels, ok := itemMap["labels"].(map[string]interface{}); ok {
					if resource, ok := labels["Resource"].(string); ok {
						if data, ok := itemMap["data"].(map[string]interface{}); ok {
							if perc99, ok := data["Perc99"].(float64); ok {
								metric_string = updateMetricString(metric_string, resource, perc99)
							}
						}
					}
					if metric, ok := labels["Metric"].(string); ok {
						if data, ok := itemMap["data"].(map[string]interface{}); ok {
							if perc99, ok := data["Perc99"].(float64); ok {
								metric_string = updateMetricString(metric_string, metric, perc99)
							}
						}
					}
				}
			}
		}
	}

	// Check if the 'max' key exists (indicating JSON3 structure)
	if max, ok := jsonData["max"].(float64); ok {
		metric_string = updateMetricString(metric_string, "max", max)
	}
	fmt.Println(metric_string)
	return metric_string
}

func updateMetricString(metric_string string, metric_name string, metric_value float64) string {
	metric_value_str := strconv.FormatFloat(metric_value, 'f', 4, 64)
	if metric_string == "" {
		metric_string = metric_name + ":"+  metric_value_str
	} else {
		metric_string = metric_string + "," + metric_name + ":" + metric_value_str
	}
	return metric_string
}

func main() {
	// Directory containing the JSON files
	dir := "./json_files"
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		log.Fatal(err)
	}

	// Loop through each file
	for _, file := range files {
		if filepath.Ext(file.Name()) == ".json" {
			filePath := filepath.Join(dir, file.Name())
			data, err := ioutil.ReadFile(filePath)
			if err != nil {
				log.Fatal(err)
			}

			// Create a generic map to store the parsed JSON data
			var jsonData map[string]interface{}
			if err := json.Unmarshal(data, &jsonData); err != nil {
				log.Fatal(err)
			}

			// Process the JSON and generate the metric string
			metricString := processJSON(jsonData)
			if metricString != "" {
				// Print the generated metric string
				fmt.Println(metricString)
			}
		}
	}
}
