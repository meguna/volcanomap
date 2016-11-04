var width = 1280,
height = 700;

var svg = d3.select("body").append("svg")
  .attr("width",width)
  .attr("height",height);

var projection = d3.geoRobinson()
  .scale(150)
  .clipExtent([[0, 0], [1280, 800]])
  .center([0,0])
  .rotate([0,0,0]);

var path = d3.geoPath()
  .projection(projection);

d3.json("world.json", function(error, world) {
  if (error) return console.error(error);

  svg.append("path")
    .datum(topojson.mesh(world))
    .attr("d",path)
    .attr("class","world-path");

  d3.csv("volcanolist.csv",
    function row(d) {
      return {
        lat: +d.Longitude,
        long: +d.Latitude,
        country: d.Country,
        type: d.PrimaryVolcanoType,
        name: d.VolcanoName,
        id: "id" + d.VolcanoNumber,
        elev: +d.Elevation
      }
    },
    function(error, data) {
    if (error) return console.error(error);
    svg.append("g")
      .selectAll("polygon")
        .data(data)
      .enter().append("polygon")
        .attr("class",function(d) {return "volcano " + d.type;} )
        .attr("id",function(d) {return d.id;})
        .attr("points","0,13 7.5,0 15,13 ") //"0,11.3 6.5,0 13,11.3 "
        .attr("transform", function(d) {return "translate(" + projection([d.lat,d.long]) + ")";})
        .on("mouseover", function(d){
          // console.log(this);
          // console.log(projection([d.lat,d.long])[0]);
          // console.log(d.id);
          // console.log(d3.mouse(this));
          var x = projection([d.lat,d.long])[0];
          var y = projection([d.lat,d.long])[1];
          // console.log(x);
          // console.log(y);
          explorer
            .text(d.name + ", " + d.country + " (" + d.elev + "m)")
            .style("left", (x + "px") )
            .style("top", ((y + 80)  + "px") )
            .classed("hidden",false)
        })
        .on("mouseout", function(){
          explorer
            .classed("hidden",true)
        });

      var explorer = d3.select("body").append("div")
        .attr("class","explorer")
        .classed("hidden",true);

      var legend = svg.append("g")
        .attr("class","legend")
        .selectAll("g")
            .data(["stratovolcano","caldera","complex","compound","pyroclastic-shield","lava-cone","subglacial","submarine","fissure-vent","cone","lava-dome","shield","pyroclastic-cone","maar","unknown","explosion-crater","tuff-cone","volcanic-field","crater-row"])
            .enter().append("g");

      legend.append("polygon")
        .attr("class",function(d) {return "volcano " + d;} )
        .attr("points","0,13 7.5,0 15,13 ")
        .attr("transform",function(d,i){ return "translate(" + (30*i + 50) +", " + 520 + ")"});

      legend.append("text")
        .text(function(d) {var str = d; str = str.replace("-"," "); return str;})
        .attr("transform",function(d,i){ return "translate(" + (30*i + 50) +", " + 520 + ")rotate(90)"})
        .attr("dx",20)
        .attr("dy",-4);

      d3.json("tectonic.json",function(error, tectonic) {
        if (error) return console.error(error);

        var tectonicLayer = svg.append("g")
          .attr("class","tectonic-layer");

        tectonicLayer.append("path")
          .datum(topojson.mesh(tectonic))
          .attr("d",path)
          .attr("id","tectonic-path");
      });

      d3.select("#tectonic-check")
        .property("disabled", false)
        .on("change", function(){d3.select("#tectonic-path").classed("tectonic-path", this.checked)});

      d3.select("#elevationSlider")
        .on("input", function() {
          // console.log(this.value);
          var elevation = this.value;
          d3.selectAll(".volcano")
            .each(function(d) {
              // console.log(d.elev);
              // console.log(elevation);
              if (d.elev <= elevation) {
                console.log(d.id);
                d3.select("#" + d.id).classed("hidden",true);
              }
              else {
                d3.select("#" + d.id).classed("hidden",false);
              }

            })
        });


  });
});
