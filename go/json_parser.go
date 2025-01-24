package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
)

// Define the ParseStrategy type
type ParseStrategy func(data map[string]interface{}) (map[string]float64, error)

// Main parsing function
func parseJSONReport(filePath string) (map[string]float64, error) {
	// Load the JSON file
	data, err := loadJSON(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to load JSON file: %w", err)
	}

	// Determine the appropriate strategy
	strategy, err := determineStrategy(data)
	if err != nil {
		return nil, err
	}

	// Use the selected strategy to parse the data
	return strategy(data)
}

// Load JSON into a generic map
func loadJSON(filePath string) (map[string]interface{}, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var data map[string]interface{}
	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(bytes, &data); err != nil {
		return nil, err
	}

	return data, nil
}

// Determine the strategy based on JSON structure
func determineStrategy(data map[string]interface{}) (ParseStrategy, error) {
	// Check for specific fields in the JSON to identify the format
	if _, ok := data["dataItems"]; ok {
		return parseDataItems, nil
	}
	if _, ok := data["pods"]; ok {
		return parsePods, nil
	}

	// Add new strategies here as needed
	return nil, errors.New("unsupported JSON format")
}

// Example parsing strategy for "dataItems"
func parseDataItems(data map[string]interface{}) (map[string]float64, error) {
	results := make(map[string]float64)
	dataItems, ok := data["dataItems"].([]interface{})
	if !ok {
		return nil, errors.New("invalid format: dataItems not found or not an array")
	}

	for _, item := range dataItems {
		itemMap, ok := item.(map[string]interface{})
		if !ok {
			continue
		}
		labels, ok := itemMap["labels"].(map[string]interface{})
		if !ok {
			continue
		}
		metricName, ok := labels["Metric"].(string)
		if !ok {
			continue
		}
		dataField, ok := itemMap["data"].(map[string]interface{})
		if !ok {
			continue
		}
		value, ok := dataField["Perc99"].(float64)
		if !ok {
			continue
		}
		results[metricName] = value
	}
	return results, nil
}

// Example parsing strategy for "pods"
func parsePods(data map[string]interface{}) (map[string]float64, error) {
	results := make(map[string]float64)
	pods, ok := data["pods"].([]interface{})
	if !ok {
		return nil, errors.New("invalid format: pods not found or not an array")
	}

	for _, pod := range pods {
		podMap, ok := pod.(map[string]interface{})
		if !ok {
			continue
		}
		podName, ok := podMap["name"].(string)
		if !ok {
			continue
		}
		containers, ok := podMap["containers"].([]interface{})
		if !ok {
			continue
		}
		for _, container := range containers {
			containerMap, ok := container.(map[string]interface{})
			if !ok {
				continue
			}
			restartCount, ok := containerMap["restartCount"].(float64)
			if !ok {
				continue
			}
			results[podName] = restartCount
		}
	}
	return results, nil
}

// Example usage
func main() {
	filePath := "example.json" // Path to your JSON file
	results, err := parseJSONReport(filePath)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println("Parsed Metrics:", results)
}
