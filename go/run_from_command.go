package main

import (
	"os"
	"github.com/yourmodule/mycmd" // Import the package containing your command
)

func runCommandWithArgsAndSaveOutput() {
	// Create or open a file to store the output
	outputFile, err := os.Create("output_with_args.txt")
	if err != nil {
		fmt.Println("Error creating output file: ", err)
	}
	defer outputFile.Close()

	// Redirect the command's output to the file
	mycmd.MyCommand.SetOut(outputFile)

	// Pass arguments and flags to the command
	mycmd.MyCommand.SetArgs([]string{"--flag1", "value1", "arg1"})

	// Run the command programmatically
	if err := mycmd.MyCommand.Execute(); err != nil {
		fmt.Println("Error executing command: ", err)
	}
}

func main() {
	// Run the Cobra command and save its output
	runCommandWithArgsAndSaveOutput()
}