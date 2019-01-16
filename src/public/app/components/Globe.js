import React, { PureComponent } from 'react'
import * as d3 from 'd3'

// import renderGlobe from '../containers/renderGlobe'

import topoJSON from '../../assets/topoJSON'
import availableCountries from '../constants/availableCountries';
import countriesByID from '../../assets/countriesByID';

const globeConfig = {
  width: 400,
  height: 400,
  sens: 0.25,
  startingRotation: [0, -11]
}
class Globe extends PureComponent {
  componentDidMount() {
    // Initiate spin, set event listeners
    this.setupGlobe()
  }

  componentWillUnmount() {
    // cleanup, remove listeners
  }

  setupGlobe() {
    // initialize d3 code
    const {
      width,
      height,
      sens,
      startingRotation,
    } = globeConfig;

    this.globe = {};

    // Set projection
    const projection = d3.geoOrthographic()
      .scale(height / 2)
      .rotate(startingRotation)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection)

    this.svg = d3.select(this.container).append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'globe');

    // Add water
    this.svg.append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'water')
      .attr('d', path);

    // const globeSelect = d3.select(this.container)
    //   .append('select')
    //   .attr('class', 'globeSelect')
    //   .attr('name', 'countries');
    // TODO add countries to select


    // Add land
    const countries = topojson.feature(topoJSON, topoJSON.objects.countries).features;


    const land = this.svg.selectAll('path.land')
      .data(countries)
      .enter().append('path')
      .attr('class', 'land')
      .attr('d', path)
      .filter(d => availableCountries.includes(countriesByID[d.id]))
        .classed('available', true);
  }

  updateGlobe() {
    // animation stuff
  }

  setRef = (node) => {
    this.container = node
  }

  render() {
    return (
    <div
      className="globeContainer"
      ref={this.setRef}
    />
    );
  }
}

export default Globe;
