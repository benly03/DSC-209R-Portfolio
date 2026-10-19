import { fetchJSON, renderProjects, countProjects } from '../global.js';

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