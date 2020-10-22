
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

const endings = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']

const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November",
                    "December"]

// Search elements
const searchbar = document.getElementById('searchbar');
const submit = document.getElementById('submit');
const articleList = document.getElementById('article-list');

// Radio buttons
const radioENT = document.getElementById('ent');
const radioTCH = document.getElementById('tch');
const radioSPT = document.getElementById('spt');

let currentArticleList = new Array();

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

function clearModelArticles() {
    currentArticleList = new Array(); 
}

function clearViewArticles() {
    while(articleList.firstChild != null) {
        articleList.removeChild(articleList.firstChild);
    }
}

function parseNewArticles(articles, limit = 5){
    for (let i = 0; i < limit; i++) {
        currentArticleList.push(articles[i]);

        let parsedDiv = parseArticle(articles[i]);
        let li = document.createElement('li');

        li.appendChild(parsedDiv); 
        articleList.appendChild(li);
    } 
    if (articleList.childElementCount > 10) {
        clearArticles();
    }
}

function sortArticlesByDate (latest) {
    let sortFunc = ((a,b) => {
        if (a < b) {
            return -1;
        } else {
            return 1;
        }
    });
    
    if(latest) {
        currentArticleList.sort(sortFunc).reverse()
    } else {
        currentArticleList.sort(sortFunc);
    }
}

    
function parseArticle(article) {
    let newDiv = document.createElement('div');
    let userFriendlyDate = getUserFriendlyDate(article.publishedAt);
    newDiv.innerHTML = `
    <h3>"${article.title}"</h3> 
    <b>Author</b>: ${article.author}<br> 
    <b>Date Published</b>: ${userFriendlyDate}<br> 
    <b>Website</b>: ${article.source.name} <br>
    <p> Summary: ${article.description} </p> 
    <p> Interested? Read more <a href="${article.url}">here</a></p>`
    
    return newDiv;
}

function getUserFriendlyDate(date) {
    let dateObj = new Date(date);
    let monthName = monthNames[dateObj.getMonth()];
    let day = dateObj.getDate().toString();
    let dayEnding = endings[dateObj.getDate() % 10];
    let year = dateObj.getFullYear();

    let ampm = dateObj.getHours() > 11 ? 'pm' : 'am'; 
    let hour = dateObj.getHours() % 12 == 0 ? '12' : (dateObj.getHours() % 12).toString();
    let mins = dateObj.getMinutes() == 0 ? "00" : dateObj.getMinutes().toString();

    // Ex: June 4th, 2020 at 4:20pm
    return  `${monthName} ${day}${dayEnding}, ${year} at ${hour}:${mins}${ampm}`;
}

function getUserFriendlyMonth(month) {

}

function getURL(category, kword = '', type = searchType.TOP, country = 'us') {
    if (category != searchCategory.NONE) {
        url = `${baseURL}${type}?country=${country}&category=${category}&apikey=${apiKey}`;
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

