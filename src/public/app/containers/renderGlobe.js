// import * as d3 from 'd3';
// import * as topojson from 'topojson-client';
// import * as queue from 'd3-queue';
import availableCountries from '../constants/availableCountries';
import store from '../index';
import { setCurrentCountry } from '../actions';
import ReactTooltip from 'react-tooltip';

const renderGlobe = (element, startCoordinates) => {
  const globe = {};
  const w = window.innerWidth;
  const h = window.innerHeight;
  const height = h < w ? h * 0.55 : w * 0.7;
  const width = height;
  const sens = 0.25;
  const globeSize = height / 2;
  const projectionMode = window.innerWidth < 600 ? 'mercator' : 'orthographic';

  // Set projection

  const projection = d3.geo[projectionMode]()
    .scale(globeSize)
    .rotate(startCoordinates)
    .translate([width / 2, height / 2])
    .clipAngle(90);

  const path = d3.geo.path()
    .projection(projection);

  // SVG container
  const svg = d3.select(element).append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'globe');

  // Add water
  svg.append('path')
    .datum({ type: 'Sphere' })
    .attr('class', 'water')
    .attr('d', path);

  const globeSelect = d3.select(element)
    .append('select')
    .attr('class', 'globeSelect')
    .attr('name', 'countries');

  d3.queue()
    .defer(d3.json, '../data/world-110m.json')
    .defer(d3.tsv, '../data/world-110m-country-names.tsv')
    .await(ready);

  // Main Function

  function ready(error, world, countryData) {
    const countryById = {};
    const countries = topojson.feature(world, world.objects.countries).features;

    // Adding countries to select

    countryData.forEach((d) => {
      countryById[d.id] = d.name;
      const option = globeSelect.append('option');
      option.text(d.name);
      option.property('value', d.id);
    });
    world = svg.selectAll('path.land')
      .data(countries)
      .enter().append('path')
      .attr('class', 'land')
      .attr('data-tip', 'doot')
      .attr('d', path)
      .filter(d => availableCountries.includes(countryById[d.id]))
        .classed('available', true);

    // Drag event

    svg.call(d3.behavior.drag()
      .origin(() => {
        const r = projection.rotate();
        return { x: r[0] / sens, y: -r[1] / sens };
      })
      .on('drag', () => {
        const rotate = projection.rotate();
        projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
        svg.selectAll('path.land').attr('d', path);
      }));

    // Mouse events

    d3.selectAll('.land')
      .attr('data-tip', d => countryById[d.id])
      .attr('data-for', 'globe')
      .on('click', (d) => {
        if (availableCountries.includes(countryById[d.id])) {
          store.dispatch(setCurrentCountry(countryById[d.id]));
        }
      });

    // Configuration for rotation
    let time;
    let rotation;
    const velocity = [0.015, -0];
    let isSpinning = false;

    globe.interval = setInterval(() => {
      if (store.getState().globeSpin) {
        const dt = Date.now() - time;

        // get the new position
        projection.rotate([rotation[0] + (velocity[0] * dt), rotation[1] + (velocity[1] * dt)]);

        // update land positions
        svg.selectAll('path.land').attr('d', path);
      }
    }, 50)

    globe.startSpin = () => {
      if (window.innerWidth > 580) {
        time = Date.now();
        rotation = projection.rotate();
        store.dispatch({ type: 'START_SPIN' });
      }
    }
    globe.stopSpin = () => {
      store.dispatch({ type: 'STOP_SPIN' });
    }
    // Rotate!
    svg.on('mouseleave', globe.startSpin)
      .on('mouseover', globe.stopSpin);

    globe.startSpin();
    ReactTooltip.rebuild();
  }

  globe.svg = svg;
  globe.projection = projection;
  return globe;
};


export default renderGlobe;
