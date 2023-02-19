
// Define a function to get the JSON data from the endpoint and log it to the console
function getData() {
    const endpoint = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
    return d3.json(endpoint).then(function(data) {
      console.log('the data: ');
      console.log(data);
      return data;
    });
  }
  
  // Define a function to update the plot when the user selects a new test subject
  function updatePlot(testSubject) {
    let newValues = [];
    let newLabels = [];
    let newTooltips = [];
    let displaySize = 10;
  
    // Get the data from the endpoint
    getData().then(function(data) {
      // Find the index of the selected test subject in the data
      const subjectIndex = data.names.findIndex((element) => element == testSubject);
      console.log(subjectIndex);
  
      // Get the top 10 sample values, OTU IDs, and OTU labels for the selected test subject
      for (let i = 0; i < displaySize; i++) {
        newValues[i] = data.samples[subjectIndex].sample_values[i];
        newLabels[i] = "OTU " + data.samples[subjectIndex].otu_ids[i];
        newTooltips[i] = data.samples[subjectIndex].otu_labels[i];
      }
  
      // Create a bar chart trace with the top 10 sample values and corresponding OTU IDs and labels
      const barTrace = {
        x: newValues.reverse(),
        y: newLabels.reverse(),
        text: newTooltips.reverse(),
        type: "bar",
        orientation: 'h'
      };
  
      // Define the layout for the bar chart
      const barLayout = {
        title: "Test Subject " + testSubject.toString()
      };
  
      // Create a new plot with the bar chart trace and layout in the "bar" div
      Plotly.newPlot("bar", [barTrace], barLayout);
  
      // Get the metadata for the selected test subject
      const metadata = data.metadata[subjectIndex];
      console.log(metadata);
      const keys = Object.keys(metadata);
  
      // Build an HTML string to display the metadata in the infobox
      let metaText = "Test Subject " + testSubject + "<hr>";
      for (i = 0; i < keys.length; i++) {
        metaText = metaText + keys[i] + ": " + metadata[keys[i]] + "<br>";
      }
  
      // Display the metadata in the infobox
      d3.select('#sample-metadata').html(metaText);
  
      // Create a bubble chart trace with all sample values, OTU IDs, and OTU labels for the selected test subject
      for (let i = 0; i < data.samples[subjectIndex].sample_values.length; i++) {
        newValues[i] = data.samples[subjectIndex].sample_values[i];
        newLabels[i] = data.samples[subjectIndex].otu_ids[i];
        newTooltips[i] = data.samples[subjectIndex].otu_labels[i];
      }
      const bubbleTrace = {
        x: newLabels,
        y: newValues,
        text: newTooltips,
        mode: 'markers',
        marker: {
          color: newLabels,
          size: newValues
        }
      };
  
      // Define the layout for the bubble chart
      const bubbleLayout = {
        title: 'to be added',
        showlegend: false,
        height:500,
        width: 1300
    };
    Plotly.newPlot('bubble', data, layout);
});

}


// Display the default plot
function init() {

url.then(function(data2) {
    let defaultTestSubject = data2.samples[0].id;


    // Use D3 to select the dropdown and add options to it;
    let dropDown = d3.select("#selDataset");
    var options = dropDown.selectAll("option")
        .data(data2.names)
        .enter()
        .append("option");

    options.text(function(d) {
            return d;
        })
        .attr("value", function(d) {
            return d;
        });


    optionChanged(defaultTestSubject)

});
}

init();
  
