console.log('IT’S ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector))
};

// add in autopopulation in all pages nav section
let pages = [
    {url: '', title: 'Home' },
    {url: 'projects/', title: 'Portfolio' },
    {url: 'resume/', title: 'Resume' },
    {url: 'contact/', title: 'Contact' },
    {url: 'https://github.com/benly03', target: '_blank', title: 'GitHub' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = 
    location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ?'/' // Local server
    : '/DSC-209R-Portfolio/'; // Githug pages

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !url.startsWith('http') ? BASE_PATH + url : url;
    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    if (p.target === '_blank') {
        a.target = p.target;
        a.rel = 'noopener noreferrer';
    }

    nav.append(a);

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
};

// add in color theme switcher
document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme: 
            <select>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
            </select>
        </label>`
);

const select = document.querySelector('select');
const savedScheme = localStorage.getItem('colorScheme');

if (savedScheme) {
    document.documentElement.style.setProperty('color-scheme', savedScheme);
    select.value = savedScheme;
}

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
});

// add in project auto population
export async function fetchJSON(url) {
    try {
        //Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`)
        };
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';

    for (const project of projects) {
        const article = document.createElement('article');
        
        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
        `;
        
        containerElement.appendChild(article);
    }
}

export function countProjects(projects) {
    const title = document.querySelector('.projects-title');

    if (title) {
        title.innerHTML = `
            ${projects.length} Projects
        `;
    }
}

export async function fetchGithubData (username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}