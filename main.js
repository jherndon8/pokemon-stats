window.onload = start;

var svg;
var circleGroup;

var height;
var width;
var margin;

var yScale;
var xScale;
var xAxis;
var yAxis;
var yContainer;
var xContainer;
var xLabel;
var yLabel;

var data;
var dataIdMap;

var tip;
var tipHtml;

var xValues;
var yValues;


function start() {
    var graph = document.getElementById('graph');
    
    margin = {top: 0, right: 0, bottom: 50, left: 40};
    width = 850;
    height = 550;


    svg = d3.select(graph)
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    data = []
    dataIdMap = {}
    for (var i = 1; i <= 649; i++) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://dry-island-61236.herokuapp.com/pokemon/id/' + i);
        xhr.onload = function() {
            console.log("Success")
            var response = JSON.parse(this.response);
            dataIdMap[response.id] = response;
            data.push(response);
            if (data.length >= 649) {
                document.getElementById('graph').removeChild(document.getElementById('myProgress'));
                displayInitialData()
            } else {
                document.getElementById('myBar').style.width = data.length/6.49  + "%"
            }
        }
        xhr.send();
    }
    //Preload the images
    for (var i = 1; i <= 649; i++) {
        var img = new Image();
        img.src = imageLink(i);
    }
    /*var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://dry-island-61236.herokuapp.com/pokemon/height')
    xhr.onload = function() {
        data = []
        var response = JSON.parse(this.response)
        console.log(response);
        for (id in response) {
            data[id] =  {"height": response[id]};
        }
        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', 'https://dry-island-61236.herokuapp.com/pokemon/weight');
        xhr2.onload = function() {
            var resp = JSON.parse(this.response);
            console.log(resp);
            for (id in resp) {
                data[id]["weight"] = resp[id]
 1           }
        };
        xhr2.send();
    }
    xhr.send();
    */
}

function imageLink(id) {
    return 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + ('00' + id).slice(-3)  + '.png'
}


function onMouseOverTip() {
    var id = this.id.split("-")[1];
    tipHtml = '<div style="text-align: center">'
        + '<img src="' + imageLink(id) + '" height="150"/> <br>'
        + '<h4>' + dataIdMap[id].species_name + '</h4><p>'
        + dataIdMap[id].flavor_text.replace("\n", "<br>")
        + '</p></div>'

    tip.show();
}

function displayInitialData() {

            var maxWeight = d3.max(data, function (d) { return d.weight})
            var maxHeight = d3.max(data, function (d) { return d.height})
            console.log("Max weight: " + maxWeight);
            xScale = d3.scaleLinear().domain([0, maxWeight]).range([margin.left, width-margin.left]);
            yScale = d3.scaleLinear().domain([0, maxHeight]).range([height - margin.bottom, margin.bottom])
            xAxis = d3.axisBottom(xScale);
            yAxis = d3.axisLeft(yScale);
        console.log("translate:" ,height - margin.bottom)
       xContainer = svg.append("g") // create a group node
                .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                .attr("class", "x axis")
                .call(xAxis) // call the axis generator

        xLabel = xContainer.append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -8)
                .style("text-anchor", "end")
                .text("Incident Date");

        yContainer = svg.append("g") // create a group node
                .attr("transform", "translate("+margin.left+", 0)")
                .attr("class", "y axis")
                .call(yAxis)

        yLabel = yContainer.append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 8)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Total Fatalities and Injuries Combined");

        tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html(function() {
                return tipHtml;
        });

        svg.call(tip);

            circleGroup = svg.selectAll(".point")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "point")
                .attr("r", 3)
                .attr("id", function(d) { return "point-" + d.id })
                .attr("cx", function(d) { return xScale(d.weight) })
                .attr("cy", function(d) { return yScale(d.height) })
                //.on('mouseover', tip.show)
                .on('mouseover', onMouseOverTip)
                .on('mouseout', tip.hide);
}
