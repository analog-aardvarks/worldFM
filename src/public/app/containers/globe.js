import React, { Component } from 'react';
// import * as d3 from 'd3';
// import * as topojson from 'topojson-client';
// import * as queue from 'd3-queue';

class Globe extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('did mount');
    this.x = 'x';
    const width = 600;
    const height = 500;
    const sens = 0.25;
    let focused;

    // Set projection

    const projection = d3.geo.orthographic()
      .scale(245)
      .rotate([0, 0])
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geo.path()
      .projection(projection);

    // SVG container
    const svg = d3.select('#globe').append('svg')
      .attr('width', width)
      .attr('height', height);

    // Add water
    svg.append('path')
      .datum({ type: 'Shere' })
      .attr('class', 'water')
      .attr('d', path);

    const countryTooltip = d3.select('body')
      .append('div')
      .attr('class', 'countryTooltip');
    const countryList = d3.select('body')
      .append('select')
      .attr('class', 'globeSelect')
      .attr('name', 'countries');

    queue()
      .defer(d3.json, '/data/world-110m.json')
      .defer(d3.tsv, '/data/world-110m-country-names.tsv')
      .await(ready);

    // Main Function

    function ready(error, world, countryData) {
      console.log('read func activate');
      const countryById = {};
      const countries = topojson.feature(world, world.objects.countries).features;

      // Adding countries to select

      countryData.forEach((d) => {
        countryById[d.id] = d.name;
        const option = countryList.append('option');
        option.text(d.name);
        option.property('value', d.id);
      });

      world = svg.selectAll('path.land')
        .data(countries)
        .enter().append('path')
        .attr('class', 'land')
        .attr('d', path)

        // Drag event

        .call(d3.behavior.drag()
          .origin(() => {
            const r = projection.rotate();
            return { x: r[0] / sens, y: -r[1] / sens };
          }))
          .on('drag', () => {
            const rotate = projection.rotate();
            projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
            svg.selectAll('path.land').attr('d', path);
            svg.selectAll('.focused').classed('focused', focused = false);
          })

        // Mouse events

        .on('mouseover', (d) => {
          countryTooltip.text(countryById[d.id])
            .style('left', `${(d3.event.pageX + 7)} px`)
            .style('top', `${(d3.event.pageY - 15)} px`)
            .style('display', 'block')
            .style('opacity', 1);
        })
        .on('mouseout', (d) => {
          countryTooltip.style('opacity', 0)
            .style('display', 'none');
        })
        .on('mousemove', (d) => {
          countryTooltip.style('left', `${d3.event.pageX + 7} px`)
            .style('top', `${d3.event.pageY - 15} px`);
        });

      // Country focus on option select

      d3.select('body').select('select.globeSelect')
        .on('change', function() {
          const rotate = projection.rotate();
          const focusedCountry = country(countries, this);
          const p = d3.geo.centroid(focusedCountry);

          svg.selectAll('.focused').classed('focused', focused = false);
        })

    d3.select("select").on("change", function() {
      const rotate = projection.rotate();
      const focusedCountry = country(countries, this);
      const p = d3.geo.centroid(focusedCountry);

      svg.selectAll(".focused").classed("focused", focused = false);

      // Globe rotating

      (function transition() {
        console.log('transitioning')
        d3.transition()
          .duration(2500)
          .tween('rotate', () => {
            const r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
            return (t) => {
              projection.rotate(r(t));
              svg.selectAll('path').attr('d', path)
              .classed('focused', (d,i) =>
                d.id === focusedCountry.id ? focused = d : false);
            };
          })
      })();
    });

    function country(cnt, sel) {
      for (let i = 0, l = cnt.length; i < l; i++) {
        if (cnt[i].id === sel.value) return cnt[i];
      }
    }
    }
  }

  render() {
    return (
      <div>
        <div className="tooltip" />
        <div
          className="globe"
          ref={(el) => { this.svg = el; }}
          width={600}
          height={500}
        />
      </div>
    );
  }
}

export default Globe;
