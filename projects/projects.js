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

let colors = d3.scaleOrdinal(d3.schemeTableau10);

function renderPieChart(projectsGiven) {
    let selectedIndex = -1;

    let newRolledData = d3.rollups (
        projectsGiven,
        (v) => v.length,
        (d) => d.Year
    );
    
    let newData = newRolledData.map(([Year, count]) => {
        return {value: count, label: Year};
    });

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));

    let svg = d3.select('#projects-pie-plot');
    let legend = d3.select('.legend');

    svg.selectAll('path').remove();
    legend.selectAll('li').remove();

    newArcs.forEach((arc, i) => {
        svg.append('path')
            .attr('d', arc)
            .attr('fill', colors(newData[i].label))
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;

                svg.selectAll('path')
                    .attr('class', (_, idx) => 
                        idx === selectedIndex
                    );

                legend.selectAll('path')
                    .attr('class', (_, idx) => 
                        idx === selectedIndex
                    );
                
                let filteredProjects;

                if (selectedIndex === -1) {
                    filteredProjects = projectsGiven;
                } else { 
                    let selectedYear = newData[selectedIndex].label;

                    filteredProjects = projectsGiven.filter (
                        (project) => project.Year === selectedYear
                    );
                }

            projectsContainer.innerHTML = '';
            renderProjects(filteredProjects, projectsContainer, 'h2');
            countProjects(filteredProjects);
        });
    });

    newData.forEach((d, idx) => {
        legend
            .append('li')
            .attr('class', 'legend-item')
            .attr('style', `--color:${colors(d.label)}`)
            .html(`<span class="swatch"></span> 
                <span>${d.label} <em>(${d.value})</em></span>`);
    });
};

renderProjects(projects, projectsContainer, 'h2');
countProjects(projects);
renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    let query = event.target.value;

    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    projectsContainer.innerHTML = '';
    renderProjects(filteredProjects, projectsContainer,'h2');
    countProjects(filteredProjects);

    renderPieChart(filteredProjects);
});


let selectedIndex = -1;
