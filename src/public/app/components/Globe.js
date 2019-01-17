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
  startingRotation: [60, 0],
  velocity: [0.015, -0],
  logFPS: false
}
class Globe extends PureComponent {
  componentDidMount() {
    // Initiate spin, set event listeners
    this.frameCount = 0
    this.setupGlobe();
    this.addEventListeners();
    if (this.props.rotate) {
      this.frameRequest = requestAnimationFrame(this.updateGlobe);
    }
    if (globeConfig.logFPS) {
      this.interval = setInterval(() => {
        console.log('FPS: ', this.frameCount)
        this.frameCount = 0
      }, 1000)
    }
  }

  componentWillUnmount() {
    // cleanup, remove listeners
    cancelAnimationFrame(this.frameRequest)
    this.svg.remove().exit()
    if (globeConfig.logFPS) {
      clearInterval(this.interval)
    }
  }

  setupGlobe() {
    const {
      diameter,
      startingRotation,
    } = globeConfig;

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

      this.svg.selectAll('path')
        .on('mouseenter', () => {
          this.isHovered = true
        })
        .on('mouseleave', () => {
          this.lastFrame = Date.now()
          this.isHovered = false;
        })
        .call(d3.drag()
          .subject(() => {
            const r = this.projection.rotate();
            return {
              x: r[0] / dragSensitivity,
              y: -r[1] / dragSensitivity
            }
          })
          .on('drag', () => {
            const r = this.projection.rotate();
            this.projection.rotate([
              d3.event.x * dragSensitivity,
              -d3.event.y * dragSensitivity,
              r[2]
            ])
            this.svg.selectAll('path.land').attr('d', this.path)
          })
          .on('start', () => {
            this.isDragging = true
            this.svg.classed('is-dragging', true)
          })
          .on('end', () => {
            this.isDragging = false
            this.svg.classed('is-dragging', false)
          }));

      this.svg.selectAll('path.land')
        .on('click', (d) => {
          const name = countriesByID[d.id];
          if (availableCountries.includes(name)) {
            this.props.selectCountry(name);
          }
        })
  }

  updateGlobe = () => {
    const shouldAnimate = this.props.aboveFold && 
      !this.isHovered &&
      !this.isDragging

    if (shouldAnimate) {
      const { velocity } = globeConfig;
      const now = Date.now()
      const dt = now - (this.lastFrame || now);
      this.lastFrame = now;
  
      const rotation = this.projection.rotate()
      this.projection.rotate([
        rotation[0] + (velocity[0] * dt),
        rotation[1] + (velocity[1] * dt),
      ]);
  
      // update land positions
      this.svg.selectAll('path.land').attr('d', this.path);

    }
    this.frameCount++
    this.frameRequest = requestAnimationFrame(this.updateGlobe);
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
