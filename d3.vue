
<template>
  <svg class="contextStudio"
       width="960"
       height="600"></svg>

</template>

<script >
import * as d3 from "d3";
import { SpinalGraph } from "spinal-models-context_studio";
var globalType = typeof window === "undefined" ? global : window;
var spinalSystem;

var graph = {
  nodes: [
    {
      id: "Myriel",
      group: 1,
      depth: 1
    },
    {
      id: "Labarre",
      group: 50,
      depth: 3
    },
    {
      id: "Napoleon",
      group: 1,
      depth: 1
    },
    {
      id: "Valjean",
      group: 30,
      depth: 4
    },
    {
      id: "Marguerite",
      group: 3,
      depth: 1
    }
  ],
  links: [
    {
      source: "Napoleon",
      target: "Myriel",
      value: 1
    },
    {
      source: "Valjean",
      target: "Labarre",
      value: 1
    },
    {
      source: "Marguerite",
      target: "Valjean",
      value: 1
    }
  ]
};

export default {
  name: "contextStudio",
  data() {
    return {};
  },
  components: {},
  methods: {
    getEvents: function() {},
    linkToDB: function() {
      spinalSystem
        .getModel()
        .then(forgefile => {
          if (forgefile) {
            if (forgefile.graph) {
              forgefile.graph.init();
            } else {
              console.log(forgefile.name.get());
              let g = new SpinalGraph(forgefile.name.get());
              g.init();
              forgefile.add_attr({
                graph: g
              });
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    this.getEvents();
    this.linkToDB();

    var radius = 12;

    var svg = d3.select(".contextStudio"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var depth = d3.scaleLinear().range([5, radius]);

    var simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function(d) {
          return d.id;
        })
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("stroke-width", function(d) {
        return Math.sqrt(d.value);
      });

    var node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("g");

    var circles = node
      .append("circle")
      .attr("r", function(d) {
        return depth(d.depth);
      })
      .attr("fill", function(d) {
        let test = color(d.group);
        return test;
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    var lables = node
      .append("text")
      .text(function(d) {
        return d.id;
      })
      .attr("x", 6)
      .attr("y", 3);

    node.append("title").text(function(d) {
      return d.id;
    });

    simulation.nodes(graph.nodes).on("tick", ticked);

    simulation.force("link").links(graph.links);

    function ticked() {
      link
        .attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

      node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      // .attr("cx", function(d) { return d.x; })
      // .attr("cy", function(d) { return d.y; });
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
};
</script>

<style>
.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}

text {
  font-family: sans-serif;
  font-size: 10px;
}
</style>
