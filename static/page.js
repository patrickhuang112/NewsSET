// News API url infos
const proxyURL = "https://cors-anywhere.herokuapp.com/";
const apiKey = 'b685b96be5b94e67917e75113d2e5809';
const baseURL = 'http://newsapi.org/v2/';

const searchCategory = {
    SPORTS : 'sports',
    ENT : 'entertainment',
    TECH  : 'technology',
    NONE : 'none'
}

const searchType = {
    TOP : 'top-headlines',
    EVERYTHING : 'everything',
    SOURCES : 'sources'
}

const displayMode = {
    IMAGE : 'Image Mode',
    TABLE : 'Table Mode'
}

const endings = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']

const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November",
                    "December"]

// Divs
const left = document.getElementById('left');
const right = document.getElementById('right');
const mid = document.getElementById('mid');

const sortButton = document.getElementById('sort-button');
const articleLimit = document.getElementById('limit');

// Search elements
const warning = document.getElementById('warning');
const searchbar = document.getElementById('searchbar');
const submit = document.getElementById('submit');
const articleList = document.getElementById('article-list');
const results = document.getElementById('results');
const option = document.getElementById('option');
const userSearchCategory = document.getElementById('search-type');

// Radio buttons
const radioDiv = document.getElementById('show');
const radioENT = document.getElementById('ent');
const radioTCH = document.getElementById('tch');
const radioSPT = document.getElementById('spt');

const defaultImgWidth = 300;
const defaultImgHeight = 300;

let sortByLatest = null;
let resultsDisplayMode = displayMode.IMAGE;
let currentArticleList = new Array();

// -------------------------EVENT HANDLERS------------------------------------

// Search behavior
let generalSearch = (category) => {

    kword = getSearchbarValue();
    searchURL = getURL(category, kword);

    clearModelArticles();
    clearViewArticles() 
    fetch(proxyURL + searchURL).then(res => {
        return res.json();
    }).then(obj => {
        setModelArticles(obj.articles);
        console.log(obj.articles);
        displayArticles();
    })

    // Visually reset searchbar value
    setSearchbarValue('');

    // I cannot for the life of me figure out why this doesn't work automatically,
    // so I am calling this delayed by 500 milliseconds
    setTimeout(() => {results.scrollIntoView({behavior: "smooth"});}, 500);
    
};

left.onclick = () => {generalSearch(searchCategory.ENT)};
mid.onclick = () => {generalSearch(searchCategory.SPORTS)};
right.onclick = () => {generalSearch(searchCategory.TECH)}; 

// FYI To Capital One people:
/*
    The project specifications says any search (which I assumed including any
    kind of keyword search) had to be filtered by the three categories above.
    For some reason with this news API, using keyword searches while 
    also constraining by category for top headlines yields incorrect and 
    sometimes no results, but I wanted to meet the project specs so I included 
    it here. If I were making this to actually work, any keyword search would
    just be a general search and not be constrained by a category, since if
    we have a keyword, results will likely fall in that category already.
*/
submit.onclick = () => {generalSearch(userSearchCategory.value)};

searchbar.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        generalSearch();
    }
});

option.onclick = () => {
    show.classList.toggle('active');
};


// -----------------------NON EVENT HANDLERS ----------------------------------


function setModelArticles(articles) {
    clearModelArticles();
    let limit = Math.min(parseInt(articleLimit.value), articles.length);
    for(let i = 0; i < limit; i++){
        currentArticleList.push(articles[i]);
    } 
}

function clearModelArticles() {
    currentArticleList = new Array(); 
}

function clearViewArticles() {
    while(articleList.firstChild != null) {
        articleList.removeChild(articleList.firstChild);
    }
}

function displayArticles(){
    let limit = Math.min(parseInt(articleLimit.value), currentArticleList.length);
    if (limit == 0) {
        warning.innerHTML = 'No Articles Found!'
        setTimeout(() => {warning.innerHTML = ''}, 3000); 
        return 
    } else {
        for (let i = 0; i < limit; i++) {
            let parsedDiv = parseArticle(currentArticleList[i], resultsDisplayMode);
            let li = document.createElement('li');
            li.appendChild(parsedDiv); 
            articleList.appendChild(li);
        } 
    }
    
}

function sortArticlesByDate () {
    let sortFunc = ((a,b) => {
        if (a < b) {
            return -1;
        } else {
            return 1;
        }
    });
    currentArticleList.sort(sortFunc);
    currentArticleList.reverse();
}

    
function parseArticle(article, mode) {
    if (mode == displayMode.IMAGE) {
        let newDiv = document.createElement('div');
        let userFriendlyDate = getUserFriendlyDate(article.publishedAt);
        let author = article.author;
        let img = 'No image found';
        let description = article.description;
        if(article.author == null || author == '') {
            author = 'No author found'; 
        }
        if (article.urlToImage != null) {
            let image = new Image();
            image.src = article.urlToimage;

            let width = image.width;
            let height = image.height;
            let aspectRatio = width/height;
            if (width > height) {
                width = defaultImgWidth;
                height = aspectRatio * width;
            } else {
                height = defaultImgHeight;
                width = aspectRatio * height;
            }
            let error = () => {
                img = 'Image failed to load';
                console.log('lol');
            }
            let imgStyle = `display:block;margin-left:auto; margin-right:auto;`
            img = `<img src = "${article.urlToImage}" style = "${imgStyle}" 
                    width = "${width}" height = "${height} onerror=${error}"></img>`
        }
        if (description == null) {
            description = 'No summary available.';
        }

        newDiv.innerHTML = 
        img + `

        <h3>"${article.title}"</h3> 
        
        <b>Author</b>: ${author}<br> 
        <b>Date Published</b>: ${userFriendlyDate}<br> 
        <b>Website</b>: ${article.source.name} <br>
        <p> Summary: ${description} </p> 
        <p> Interested? Read more <a href="${article.url}" target = "_black">here</a></p>`
        return newDiv;
    }
    return;
    }

function getUserFriendlyDate(date) {
    let dateObj = new Date(date);
    let monthName = monthNames[dateObj.getMonth()];
    let day = dateObj.getDate().toString();
    let dayEnding = endings[dateObj.getDate() % 10];
    let year = dateObj.getFullYear();

    let ampm = dateObj.getHours() > 11 ? 'pm' : 'am'; 
    let hour = dateObj.getHours() % 12 == 0 ? '12' : (dateObj.getHours() % 12).toString();
    let mins = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes().toString() :
                                                 dateObj.getMinutes().toString();

    // Ex: June 4th, 2020 at 4:20pm
    return  `${monthName} ${day}${dayEnding}, ${year} at ${hour}:${mins}${ampm}`;
}


function getURL(category, kword = '', country = 'us', type = searchType.TOP) {
    if (category != searchCategory.NONE) {
        if (kword != ''){
            return `${baseURL}${type}?q=${kword}&category=${category}&apikey=${apiKey}`; 
        } else {
            return `${baseURL}${type}?country=${country}&category=${category}&apikey=${apiKey}`; 
        }
    } else { 
        if (kword != '') {
            type = searchType.EVERYTHING;
            return `${baseURL}${type}?q=${kword}&apikey=${apiKey}`;
        } else {
            type = searchType.TOP;
            return `${baseURL}${type}?country=${country}&apikey=${apiKey}`;  
        }
        
    }
}

function getSearchbarValue() {
    return searchbar.value;
}

function setSearchbarValue(val) {
    searchbar.value = val;
}

