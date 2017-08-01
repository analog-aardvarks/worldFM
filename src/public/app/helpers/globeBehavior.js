import availableCountries from '../constants/availableCountries';
import store from '../index';
import { setCurrentCountry } from '../actions';

const activateGlobe = (error, world, countryData) => {
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
    .attr('d', path);

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
    })
    .on('click', (d) => {
      console.log(countryById[d.id]);
      if (availableCountries.includes(countryById[d.id])) {
        store.dispatch(setCurrentCountry(countryById[d.id]));
      }
    });

  // Country focus on option select

  // d3.select('.globeSelect')
  //   .on('change', () => {
  //     const rotate = projection.rotate();
  //     const focusedCountry = country(countries, d3.select('select.globeSelect'));
  //     const p = d3.geo.centroid(focusedCountry);
  //
  //     svg.selectAll('.focused').classed('focused', focused = false);
  //   });

  globeSelect.on('change', () => {
    console.log(countries)
    const rotate = projection.rotate();
    const focusedCountry = country(countries, d3.select('.globeSelect'));
    console.log('focusedCountry: ', focusedCountry)
    const p = d3.geo.centroid(focusedCountry);

    svg.selectAll('.focused').classed('focused', focused = false);

  // Spin globe to selected country

    (function transition() {
      d3.transition()
        .duration(2500)
        .tween('rotate', () => {
          const r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
          return (t) => {
            projection.rotate(r(t));
            svg.selectAll('path').attr('d', path)
            .classed('focused', (d, i) => {
              console.log(focusedCountry)
              return d.id === focusedCountry.id ? focused = d : false;
            });
          };
        })
    })();
  });

  // Configuration for the spinning effect

  let time = Date.now();
  const rotation = [0, 0];
  const velocity = [0.015, -0];
  function spinningGlobe() {
    // d3.timer(function () {
      // get current time
      const dt = Date.now() - time;

      // get the new position from modified projection function
      projection.rotate([rotation[0] + (velocity[0] * dt), rotation[1] + (velocity[1] * dt)]);

      // update cities position = redraw
      svg.selectAll('path.land').attr('d', path);
    // });
  }

  let interval;
  function startSpin() {
    time = Date.now();
    interval = setInterval(spinningGlobe, 20);
  }
  function stopSpin() {
    clearInterval(interval);
  }
  // Globe rotation
  svg.on('mouseleave', startSpin);
  svg.on('mouseover', stopSpin)

  function country(cnt, sel) {
    console.log('cnt in country: ', cnt)
    console.log('sel.value: ', sel.value);
    for (let i = 0; i < cnt.length; i++) {
      if (cnt[i].id === sel.value) return cnt[i];
    }
  }
}

export default activateGlobe;
