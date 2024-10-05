// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    console.log("Metadata loaded:", metadata);
    
    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metadata.find(meta => meta.id == sample);
    console.log("Filtered Metadata for sample", sample, ":", filteredMetadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");
    console.log("Panel selected:", panel);

    // Use `.html("")` to clear any existing metadata
    panel.html("");
    console.log("Cleared existing metadata");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredMetadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
      console.log(`Added ${key}: ${value} to the panel`);
    });
    

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;
    console.log("Samples loaded:", samples);

    // Filter the samples for the object with the desired sample number
    let filteredSample = samples.find(s => s.id === sample);
    console.log("Filtered Sample for sample", sample, ":", filteredSample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filteredSample.otu_ids;
    let otu_labels = filteredSample.otu_labels;
    let sample_values = filteredSample.sample_values;

    console.log("OTU IDs:", otu_ids);
    console.log("OTU Labels:", otu_labels);
    console.log("Number of Bacteria:", sample_values);

    // Build a Bubble Chart
    let bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
        }
    };

    // Render the Bubble Chart
    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: { title: 'OTU IDs' },
        yaxis: { title: 'Number of Bacteria' },
        hovermode: 'closest'
    };


    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    console.log("Bubble Chart rendered");

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let barTrace = {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
    };

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [barTrace];

    let barLayout = {
        title: 'Top 10 Bacteria Cultures Found',
        xaxis: { title: 'Number of Bacteria' }
        
    };


    Plotly.newPlot('bar', barData, barLayout);
    console.log("Bar Chart rendered");


  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the names field
    let sampleNames = data.names;
    console.log("Sample names loaded:", sampleNames);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Inside a loop, you will need to use d3 to append a new option for each sample name.
    sampleNames.forEach(sample => {
        dropdownMenu.append("option")
        .text(sample)
        .property("value", sample);
    });
    console.log("Dropdown populated with sample names");

    // Get the first sample from the list
    let firstSample = sampleNames[0];
    console.log("First sample selected:", firstSample);

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  let selectedSample = newSample; 
  console.log("New Sample Selected:", selectedSample);
  // Call the functions to build charts and metadata panel
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
