import { fetchJSON, renderProjects, countProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

if (projects && projectsContainer) {
    renderProjects(projects, projectsContainer, 'h2');
}

if (projects) {
    countProjects(projects);

    if (projectsContainer) {
        renderProjects(projects, projectsContainer, 'h2');
    }
}

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let arc = arcGenerator({
    startAngle: 0,
    endAngle: 2 * Math.PI
});

d3.select('svg').append('path').attr('d', arc).attr('fill','red');

let rolledData = d3.rollups (
    projects, (v) => v.length, (d) => d.Year,
);

let data = rolledData.map(([Year, count]) => {
    return {value: count, label: Year};
});

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);

arcs.forEach((arc, idx) => {
    d3.select('svg')
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx));
});

let legend = d3.select('.legend');

data.forEach((d, idx) => {
    legend
        .append('li')
        .attr('class', 'legend-item')
        .attr('style', `--color:${colors(idx)}`)
        .html(`<span class="swatch"></span> 
            <span>${d.label} <em>(${d.value})</em></span>`);
});


let query = '';

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
    query = event.target.value;
    
})