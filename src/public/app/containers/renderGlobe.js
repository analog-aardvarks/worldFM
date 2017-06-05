// import * as d3 from 'd3';
// import * as topojson from 'topojson-client';
// import * as queue from 'd3-queue';
import availableCountries from '../constants/availableCountries';
import store from '../index';
import { setCurrentCountry } from '../actions';
// import activateGlobe from '../helpers/globeBehavior';


const renderGlobe = (element, startCoordinates) => {
  const globe = {};
  const w = window.innerWidth;
  const h = window.innerHeight;
  const height = h < w ? h * 0.55 : w * 0.7;
  const width = height;
  const sens = 0.25;
  const globeSize = height / 2;
  let focused;
  let interval = {};

  // Set projection

  const projection = d3.geo.orthographic()
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

  queue()
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
        svg.selectAll('.focused').classed('focused', focused = false);
      }));

    // Mouse events

    d3.selectAll('.land')
      .attr('data-tip', d => countryById[d.id])
      .on('click', (d) => {
        if (availableCountries.includes(countryById[d.id])) {
          store.dispatch(setCurrentCountry(countryById[d.id]));
        }
      });

    // TODO: Country focus on option select

    // globeSelect.on('change', () => {
    //   const rotate = projection.rotate();
    //   const focusedCountry = country(countries, globeSelect);
    //   console.log('focusedCountry: ', focusedCountry)
    //   const p = d3.geo.centroid(focusedCountry);
    //
    //   svg.selectAll('.focused').classed('focused', focused = false);
    //
    // // Spin globe to selected country
    //
    //   (function transition() {
    //     d3.transition()
    //       .duration(2500)
    //       .tween('rotate', () => {
    //         const r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
    //         return (t) => {
    //           projection.rotate(r(t));
    //           svg.selectAll('path').attr('d', path)
    //           .classed('focused', (d, i) => {
    //             console.log(focusedCountry)
    //             return d.id === focusedCountry.id ? focused = d : false;
    //           });
    //         };
    //       })
    //   })();
    // });

    // Configuration for rotation
    let time;
    let rotation;
    const velocity = [0.015, -0];
    let isSpinning = true;

    // function spinningGlobe() {
    //   const dt = Date.now() - time;
    //
    //   // console.log('tick')
    //
    //   // get the new position
    //   projection.rotate([rotation[0] + (velocity[0] * dt), rotation[1] + (velocity[1] * dt)]);
    //
    //   // update land positions
    //   svg.selectAll('path.land').attr('d', path);
    // }
    //
    // globe.startSpin = () => {
    //   time = Date.now();
    //   rotation = projection.rotate();
    //   interval.current = setInterval(spinningGlobe, 10);
    // }
    // globe.stopSpin = () => {
    //   clearInterval(interval.current);
    // }
    // // Rotate!
    // svg.on('mouseleave', globe.startSpin)
    //   .on('mouseover', globe.stopSpin);
    // globe.startSpin();

    // //////////////////
    // d3.time implementation
    // //////////////////

    function spinningGlobe(t) {
      if (isSpinning) {
        // get the new position
        projection.rotate([rotation[0] + (velocity[0] * t), rotation[1] + (velocity[1] * t)]);

        // update land positions
        svg.selectAll('path.land').attr('d', path);
      }
    }

    globe.startSpin = () => {
      rotation = projection.rotate();
      d3.timer(spinningGlobe);
      isSpinning = true;
    };
    globe.stopSpin = () => {
      // timer.stop();
      isSpinning = false;
    };
    // Rotate!
    svg.on('mouseleave', globe.startSpin)
      .on('mouseover', globe.stopSpin);
    globe.startSpin();

    // Zoom!
    // const scale0 = (width - 1) / 2 / Math.PI;
    //
    // const zoom = d3.behavior.zoom()
    //   .translate([width / 2, height / 2])
    //   .scale(scale0)
    //   .scaleExtent([scale0, 8 * scale0])
    //   .on('zoom', zoomed);
    //
    // svg.call(zoom)
    //   .call(zoom.event);
    //
    // function zoomed() {
    //   projection.translate(zoom.translate())
    //   .scale(zoom.scale());
    //   svg.selectAll('path')
    //   .attr('d', path);
    // }

    function country(cnt, sel) {
      console.log('cnt in country: ', cnt);
      console.log('sel.value: ', sel.value);
      for (let i = 0; i < cnt.length; i++) {
        if (cnt[i].id === sel.value) return cnt[i];
      }
    }
  }
  globe.svg = svg;
  globe.projection = projection;
  return globe;
};


export default renderGlobe;
