import React, { PureComponent } from 'react'
import * as d3 from 'd3'
import { feature } from 'topojson-client'

// import renderGlobe from '../containers/renderGlobe'

import availableCountries from '../constants/availableCountries';
import countriesByID from '../../assets/countriesByID';
import countryShapeData from '../../assets/countryShapes';

const globeConfig = {
  diameter: 1000,
  dragSensitivity: 0.25,
  startingRotation: [60, 0]
}
class Globe extends PureComponent {
  componentDidMount() {
    // Initiate spin, set event listeners
    this.setupGlobe();
    this.addEventListeners();
  }

  componentWillUnmount() {
    // cleanup, remove listeners
  }

  setupGlobe() {
    // initialize d3 code
    const {
      diameter,
      startingRotation,
    } = globeConfig;

    // Set projection
    this.projection = d3.geoOrthographic()
      .scale(diameter / 2)
      .rotate(startingRotation)
      .translate([diameter / 2, diameter / 2])
      .clipAngle(90);

    this.path = d3.geoPath().projection(this.projection)

    this.svg = d3.select(this.container).append('svg')
      .attr('viewBox', `0 0 ${diameter} ${diameter}`)
      .attr('class', 'globe');

    // Add water
    this.svg.append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'water')
      .attr('d', this.path);

    // const globeSelect = d3.select(this.container)
    //   .append('select')
    //   .attr('class', 'globeSelect')
    //   .attr('name', 'countries');
    // TODO add countries to select

    // Add land
    const countryShapes = feature(countryShapeData, countryShapeData.objects.countries).features;

    this.svg.selectAll('path.land')
      .data(countryShapes)
      .enter().append('path')
      .attr('class', 'land')
      .attr('d', this.path)
      .attr('data-tip', d => countriesByID[d.id])
      .attr('data-for', 'globe')
      .filter(d => availableCountries.includes(countriesByID[d.id]))
        .classed('available', true);
  }

  addEventListeners() {
    const { dragSensitivity } = globeConfig;
    this.svg.call(d3.drag()
      .subject(() => {
        const r = this.projection.rotate();
        return {
          x:r[0] / dragSensitivity,
          y: -r[1]/ dragSensitivity
        }
      })
      .on('drag', () => {
        const r = this.projection.rotate();
        this.projection.rotate([
          d3.event.x * dragSensitivity,
          -d3.event.y * dragSensitivity, 
          r[2]
        ]);
        this.svg.selectAll('path.land').attr('d', this.path)
      }));

      this.svg.selectAll('path.land')
        .on('click', (d) => {
          if (availableCountries.includes(countriesByID[d.id])) {
            this.props.dis
          }
        })
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
