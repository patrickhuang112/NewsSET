// News API url infos
const proxyURL = "https://cors-anywhere.herokuapp.com/";
const apiKey = '78b9d599c4f94f8fa3afb1a5458928d6';
const baseURL = 'https://newsapi.org/v2/';

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

// Other useful info and initialized values
const defaultImgWidth = 300;
const defaultImgHeight = 300;
let sortByLatest = null;
let currentArticleList = new Array();

// -------------------------EVENT HANDLERS------------------------------------

// Search behavior function
let generalSearch = (category) => {

    kword = getSearchbarValue();
    searchURL = getURL(category, kword);

    clearModelArticles();
    clearViewArticles() 
    fetch(searchURL).then(res => {
        return res.json();
    }).then(obj => {
        setModelArticles(obj.articles);
        console.log(obj.articles);
        displayArticles();
    })

    // Visually reset searchbar value
    setSearchbarValue('');

    // I cannot for the life of me figure out why this doesn't work automatically,
    // so I am calling this delayed by one second
    setTimeout(() => {results.scrollIntoView({behavior: "smooth"});}, 1000);
    
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
        generalSearch();
    }
});

// Enable/Disable search options
option.onclick = () => {
    show.classList.toggle('active');
};


// -----------------------NON EVENT HANDLERS ----------------------------------

// Set model article list
function setModelArticles(articles) {
    clearModelArticles();
    let limit = Math.min(parseInt(articleLimit.value), articles.length);
    for(let i = 0; i < limit; i++){
        currentArticleList.push(articles[i]);
    } 
}

// Clear model article list
function clearModelArticles() {
    currentArticleList = new Array(); 
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

        // This error function is if the image is not able to load
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

// Getter for searchbar
function getSearchbarValue() {
    return searchbar.value;
}

// Setter for searchbar
function setSearchbarValue(val) {
    searchbar.value = val;
}

