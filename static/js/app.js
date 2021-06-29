function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadatabox = d3.select("#sample-metadata");
        metadatabox.html("");
        var filteredData = data.metadata.filter(s => s.id == sample);
        console.log(filteredData)
        Object.entries(filteredData[0]).forEach(([key, value]) => {
            var cell = metadatabox.append("p")
            cell.text(key + ":" + value)
            console.log(key, value)
        })
    })
}

function buildChart(sample) {
    d3.json("samples.json").then((data) => {
        // barchart
        var barchart = d3.select(".bar");
        barchart.html("");
        var filteredData = data.samples.filter(s => s.id == sample);
        // console.log(filteredData)
        var otu_ids = filteredData[0].otu_ids
        var otu_labels = filteredData[0].otu_labels
        var sample_values = filteredData[0].sample_values

        var yval = otu_ids.slice(0,10).map(y => `OTU ${y}`).reverse()
        var xval = sample_values.slice(0,10).reverse() 


        // Extract frequency
        var filteredfrequency = data.metadata.filter(s => s.id == sample);
        var wfreq = filteredfrequency[0].wfreq

        // Horizontal Bar Chart
        trace1 = {
            x: xval,
            y: yval,
            type: "bar",
            orientation: "h" 
        }   
        data1 = [trace1]
        config = {
            responsive: true,
        }
        Plotly.newPlot("bar",data1, config)

        // Bubble Chart
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };
        
        data2 = [trace2]
        layout2 = {
            xaxis: {
                title: {
                  text: 'OTU ID',
                }
            }
        }

        Plotly.newPlot("bubble",data2, layout2, config)

        // Gauge Chart
        // Enter the washing frequency between 0 and 180
        var level = parseFloat(wfreq) * 20;
        // Trig to calc meter point
        var degrees = 180 - level,
        radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = "M -.0 -0.05 L .0 0.05 L ";
        var pathX = String(x);
        var space = " ";
        var pathY = String(y);
        var pathEnd = " Z";
        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        var trace3 = [
            {
              type: "scatter",
              x: [0],
              y: [0],
              marker: { size: 12, color: "850000" },
              showlegend: false,
              name: "Freq",
              text: level,
              hoverinfo: "text+name"
            },
            {
              values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
              rotation: 90,
              text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
              textinfo: "text",
              textposition: "inside",
              marker: {
                colors: [
                  "rgba(0, 105, 11, .5)",
                  "rgba(10, 120, 22, .5)",
                  "rgba(14, 127, 0, .5)",
                  "rgba(110, 154, 22, .5)",
                  "rgba(170, 202, 42, .5)",
                  "rgba(202, 209, 95, .5)",
                  "rgba(210, 206, 145, .5)",
                  "rgba(232, 226, 202, .5)",
                  "rgba(240, 230, 215, .5)",
                  "rgba(255, 255, 255, 0)"
                ]
              },
              labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
              hoverinfo: "label",
              hole: 0.5,
              type: "pie",
              showlegend: false
            }
          ];

        var layout3 = {
        shapes: [
            {
            type: "path",
            path: path,
            fillcolor: "850000",
            line: {
                color: "850000"
            }
            }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 500,
        width: 500,
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        }
        };
    
        Plotly.newPlot('gauge', trace3, layout3, config);       
    })
}




function init(){
    // Dropdown Option creation
    d3.json("samples.json").then((data) => {
        var ID = data.names;
        var dropdown = d3.select("#selDataset");
        var options;
        for (var i = 0; i < ID.length; i++) {
            options = dropdown.append("option")
            options.append("value").text(ID[i])
            options.property("value", ID[i])
        }
        // Use the first sample from the list to build the initial plots
        const firstSample = ID[0];
        buildMetadata(firstSample);
        buildChart(firstSample)

    })
}

function optionChanged() {
    // This function is called when a dropdown menu item is selected
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var sample = parseInt(dropdownMenu.property("value"));
    // console.log(sample)
    buildMetadata(sample);
    buildChart(sample)
  }

init()