// const { forEach } = require("lodash")

// const { categories } = require("../Backend/models")

// let allwork = []
//  function Displaywork(works){

//         const gallery = document.querySelector('.gallery')
//         gallery.innerHTML = ''
        
//         works.forEach(work => {
//             const figure = document.createElement('figure')
//             const   img = document.createElement('img')
//             const   figcaption = document.createElement('figcaption')
//             figcaption.textContent = work.title
//             img.src = work.imageUrl
//             figure.appendChild(img)
//             figure.appendChild(figcaption)
//             gallery.appendChild(figure)
//             // create image 
//             // create figcaption 
//             // everything goes in figure
//             //  figure goes in gallery
//         })
//     }

// fetch('http://localhost:5678/api/works')
//     .then(response => response.json())
//     .then(works => {
//         allwork = works
//        Displaywork(works)
//     })
//     .catch(error => {
//         console.error('Erreur :', error)
//     })

// fetch('http://localhost:5678/api/categories')
//     .then ( resp => resp.json())
//     .then (categories => {
//         const filters  = document.querySelector('.filters')
//         const Tous = document.createElement('button')
//         Tous.textContent = 'Tous'
//         filters.appendChild(Tous)
//         Tous.addEventListener ('click', () => {
//             document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'))
//             Tous.classList.add('active')
//             Displaywork(allwork)
//         })
//         categories.forEach ( category => {
//             const button = document.createElement('button')
//             button.textContent = category.name
//             filters.appendChild(button)
//             button.addEventListener('click', () => {
//                 document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'))
//                 button.classList.add('active')
//                 const worksfiltered = allwork.filter(work => work.categoryId === category.id)
//                 Displaywork(worksfiltered)
//         })
//         })
//         })
//         .catch(error => {
//         console.error('Erreur :', error)
//     })
       
    
//     document.addEventListener('DOMContentLoaded', () => {
//     if (localStorage.getItem('token')) {
//         document.querySelector('#editor-mode').style.display = 'flex'
//         document.querySelector('.editor-button').style.display = 'flex'
//             const loginLink = document.querySelector('#login a')
//             loginLink.textContent = 'logout'
//             loginLink.href = '#'
//             document.querySelector('.filters').style.display = 'none'
//             document.querySelector('#login a').addEventListener('click', () => {
//             localStorage.removeItem('token')
//             location.reload()
//     })
//     }
// })

const API_URL = 'http://localhost:5678/api'

async function fetchAPI(route) {
    const response = await fetch(`${API_URL}${route}`)
    return response.json()
}

let allWorks = []

function displayWorks(works) {
    const gallery = document.querySelector('.gallery')
    gallery.innerHTML = ''
    works.forEach(work => {
        const figure = document.createElement('figure')
        const img = document.createElement('img')
        const figcaption = document.createElement('figcaption')
        img.src = work.imageUrl
        figcaption.textContent = work.title
        figure.appendChild(img)
        figure.appendChild(figcaption)
        gallery.appendChild(figure)
    })
}

function createFilters(categories) {
    const filters = document.querySelector('.filters')
    const Tous = document.createElement('button')
    Tous.textContent = 'Tous'
    Tous.classList.add('active')
    filters.appendChild(Tous)
    Tous.addEventListener('click', () => {
        document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'))
        Tous.classList.add('active')
        displayWorks(allWorks)
    })
    categories.forEach(category => {
        const button = document.createElement('button')
        button.textContent = category.name
        filters.appendChild(button)
        button.addEventListener('click', () => {
            document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'))
            button.classList.add('active')
            displayWorks(allWorks.filter(work => work.categoryId === category.id))
        })
    })
}

function handleEditorMode() {
    if (localStorage.getItem('token')) {
        document.querySelector('#editor-mode').style.display = 'flex'
        document.querySelector('.editor-button').style.display = 'flex'
        const loginLink = document.querySelector('#login a')
        loginLink.textContent = 'logout'
        loginLink.href = '#'
        document.querySelector('.filters').style.display = 'none'
        loginLink.addEventListener('click', () => {
            localStorage.removeItem('token')
            location.reload()
        })
    }
}

async function init() {
    allWorks = await fetchAPI('/works')
    const categories = await fetchAPI('/categories')
    displayWorks(allWorks)
    createFilters(categories)
    handleEditorMode()
}

document.addEventListener('DOMContentLoaded', init)