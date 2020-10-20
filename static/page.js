
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

// Search elements
const searchbar = document.getElementById('searchbar');
const submit = document.getElementById('submit');
const articleList = document.getElementById('article-list');

// Radio buttons
const radioENT = document.getElementById('ent');
const radioTCH = document.getElementById('tch');
const radioSPT = document.getElementById('spt');

class Article {
    constructor(author, publisher, title, description, date, url, image=null) {
        this.author = author;
        this.publisher = publisher;
        this.title = title;
        this.description = description;
        this.date = date
        this.url = url;
        this.image = image;
    }
}

// Startup behavior

// Seach behavior
submit.onclick = () => {
    kword = getSearchbarValue();
    category = getSelectedRadioButton();
    searchURL = getURL(category)

    fetch(proxyURL + searchURL).then(res => {
        return res.json();
    }).then(obj => {
        console.log(obj)
        articles = obj.articles;
        parseNewArticles(articles);
    })
    
    
    console.log('Search performed')


    // Visually reset searchbar value
    setSearchbarValue('');
};

function clearArticles() {
    while(articleList.firstChild != null) {
        articleList.removeChild(articleList.firstChild);
    }
}

function parseNewArticles(articles, limit = 5){
    for (let i = 0; i < limit; i++) {
        parsedDiv = parseArticle(articles[i]);
        let li = document.createElement('li');
        li.appendChild(parsedDiv); 
        articleList.appendChild(li);
    } 
    if (articleList.childElementCount > 10) {
        console.log('here')
        clearArticles();
    }
}

function parseArticle(article){
    p = document.createElement('p');
    p.textContent = 'TESTING';
    return p;
}

function getURL(category, kword = '', type = searchType.TOP, country = 'us') {
    if (category != searchCategory.NONE) {
        url = `${baseURL}${type}?category=${category}&apikey=${apiKey}`;
        return url
    } else {
        return url = `${baseURL}${type}?country=${country}&apikey=${apiKey}`;
    }
}


function getSelectedRadioButton() {
    if (radioENT.checked) {
        return searchCategory.ENT;
    } else if(radioTCH.checked) {
        return searchCategory.TECH;
    } else if(radioSPT.checked) {
        return searchCategory.SPORTS;
    } else {
        return searchCategory.NONE;
    }
}

function getSearchbarValue() {
    return searchbar.value;
}

function setSearchbarValue(val) {
    searchbar.value = val;
}
/*
searchbar.addEventListener('click', () => {
    console.log('Hi')
});
*/
console.log("hello")

