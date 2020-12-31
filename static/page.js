// News API url infos
const proxyURL = "https://cors-anywhere.herokuapp.com/";
const apiKey = 'b685b96be5b94e67917e75113d2e5809';
const baseURL = 'http://newsapi.org/v2/';

// Enums
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

// Model to View info
const endings = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']

const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November",
                    "December"]

// Divs
const left = document.getElementById('left');
const right = document.getElementById('right');
const mid = document.getElementById('mid');

// Search elements
const warning = document.getElementById('warning');
const searchbar = document.getElementById('searchbar');
const submit = document.getElementById('submit');

// Results
const articleList = document.getElementById('article-list');
const results = document.getElementById('results');

// User options
const option = document.getElementById('option');
const userSearchCategory = document.getElementById('search-type');
const articleLimit = document.getElementById('limit');
const sortReversed = document.getElementById('sort-type');
const up = document.getElementById('up');
const scrollto = document.getElementById('scrollto');
const prevSearches = document.getElementById('prev-searches');
const prevSearchesFirst = document.getElementById('prev-searches-first');

// Other useful info and initialized values
const testNullImg = 'https://admin.ncaa.com/_flysystem/public-s3/images/2020-10/ohio-state-penn-state_0.jpg'
const defaultImgWidth = window.innerWidth / 3;
const defaultImgHeight = window.innerHeight / 3;
let currentArticleList = new Array();
const previousSearches = new Array();
let sortByLatest = null;
// -------------------------EVENT HANDLERS------------------------------------

// Search behavior function
let generalSearch = (category) => {
    kword = getSearchbarValue();
    [searchURL, prev] = getURL(category, kword);
    clearModelArticles();
    clearViewArticles() 
    warning.innerHTML = 'Searching for article...';
    fetch(proxyURL + searchURL).then(res => {
        return res.json();
    }).then(obj => {
        if (obj.articles == null) {
            warning.innerHTML = `Chrome does not work! Error 426 (HTTP Upgrade Required) 
            and this only happens on Chrome. Please switch to Firefox.`
            setTimeout(() => {warning.innerHTML = ''}, 3000); 
            return false;
        } else {
            warning.innerHTML = 'Article found!'
            setModelArticles(obj.articles);
            displayArticles();
            setTimeout(() => {warning.innerHTML = ''}, 3000); 
            return true;
        }
    }).then(success => {
        if (success) {
            setTimeout(() => {
                results.scrollIntoView({behavior: "smooth"});
            }, 100);
            updatePreviousSearches(prev);
            
        }
    })

    // Visually reset searchbar value
    setSearchbarValue('');

    // I cannot for the life of me figure out why this doesn't work automatically,
    // so I am calling this delayed by one second
};

// Search Entertainment Category
left.onclick = () => {generalSearch(searchCategory.ENT)};

// Search Sports Category
mid.onclick = () => {generalSearch(searchCategory.SPORTS)};

// Search Tech category
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
// General Search 
submit.onclick = () => {generalSearch(userSearchCategory.value)};

// Allow for enter key press to search
searchbar.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        generalSearch(userSearchCategory.value);
    }
});

// Enable/Disable search options
option.onclick = () => {
    show.classList.toggle('active');
};

up.onclick = () => {
    scrollto.scrollIntoView({behavior: "smooth"}); 
}

// -----------------------NON EVENT HANDLERS ----------------------------------

function clearPreviousSearches() {
    while(prevSearches.firstChild != null) {
        prevSearches.removeChild(prevSearches.firstChild);
    }
}

function updatePreviousSearches(search) {
    previousSearches.push(search);
    if (previousSearches.length == 1) {
        prevSearchesFirst.innerHTML = search;
    } else if (previousSearches.length > 1) {
        clearPreviousSearches()
        for (let i = previousSearches.length - 1; i >= 0; i--) {
            let newOption = document.createElement('option'); 
            newOption.innerHTML = previousSearches[i];
            prevSearches.appendChild(newOption);
        }
        
    }
}

// Set model article list
function setModelArticles(articles) {
    clearModelArticles();
    let limit = Math.min(parseInt(articleLimit.value), articles.length);
    for(let i = 0; i < limit; i++){
        currentArticleList.push(articles[i]);
    } 
    if (sortReversed.value == 'yes') {
        currentArticleList.reverse()
    }
}

// Clear model article list
function clearModelArticles() {
    currentArticleList = new Array()
}

// Clear view (user-facing) article list
function clearViewArticles() {
    while(articleList.firstChild != null) {
        articleList.removeChild(articleList.firstChild);
    }
}

// Set view (user-facing) article list
function displayArticles(){
    let limit = Math.min(parseInt(articleLimit.value), currentArticleList.length);
    if (limit == 0) {
        warning.innerHTML = 'No Articles Found!'
        setTimeout(() => {warning.innerHTML = ''}, 3000); 
        return 
    } else {
        for (let i = 0; i < limit; i++) {
            let parsedDiv = parseArticle(currentArticleList[i]);
            let li = document.createElement('li');
            li.appendChild(parsedDiv); 
            articleList.appendChild(li);
        } 
    }
    
}

// Set view (user-facing) information for a single article    
function parseArticle(article) {
    let newDiv = document.createElement('div');
    let userFriendlyDate = getUserFriendlyDate(article.publishedAt);
    let author = article.author;
    let img = 'No image found';
    
    let description = article.description;
    if(article.author == null || author == '') {
        author = 'No author found'; 
    }
    if (article.urlToImage != null) {
        // Reformat/resize image
        let image = new Image();
        image.src = article.urlToImage;
        let width = image.width;
        let height = image.height;
        if (width > height) {
            let ratio = height / width
            width = defaultImgWidth;
            height = ratio * width;
        } else {
            let ratio = width / height
            height = defaultImgHeight;
            width = ratio * height;
        }
        
        let imgStyle = `display:block;margin-left:auto; margin-right:auto;
                        padding:20px;`

        img = ` <div id = 'article-right'>
                <img src = "${article.urlToImage}" style = "${imgStyle}" 
                width = "${width}" height = "${height}" 
                onerror = "this.onerror=null;this.src='images/imageFail.png'"
                ></img>
                </div>`
    }

    if (description == null) {
        description = 'No summary available.';
    }

    newDiv.innerHTML = 
    img + `
    <div id = article-left">
    <h3>"${article.title}"</h3> 
    
    <b>Author</b>: ${author}<br> 
    <b>Date Published</b>: ${userFriendlyDate}<br> 
    <b>Website</b>: ${article.source.name} <br>
    <p> Summary: ${description} </p> 
    <p> Interested? Read more <a href="${article.url}" target = "_black">here</a></p>
    </div>`
    return newDiv;
}


// Return view (user-facing) text for article publish date
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

// Format the URL needed for a search
function getURL(category, kword = '', country = 'us', type = searchType.TOP) {
    if (category != searchCategory.NONE) {
        if (kword != ''){
            return [`${baseURL}${type}?q=${kword}&category=${category}&apikey=${apiKey}`, 
                    `${category}: "${kword}"`]; 
        } else {
            return [`${baseURL}${type}?country=${country}&category=${category}&apikey=${apiKey}`,
                    `The general top news from ${category}`] 
        }
    } else { 
        if (kword != '') {
            type = searchType.EVERYTHING;
            return [`${baseURL}${type}?q=${kword}&apikey=${apiKey}`,
                    `"${kword}"`];
        } else {
            type = searchType.TOP;
            return [`${baseURL}${type}?country=${country}&apikey=${apiKey}`,
                    `The general top news`];  
        }
        
    }
}

// Getter for searchbar
function getSearchbarValue() {
    return searchbar.value;
}

// Setter for searchbar
function setSearchbarValue(val) {
    searchbar.value = val;
}

