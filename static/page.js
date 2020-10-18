const proxyurl = "https://cors-anywhere.herokuapp.com/";
const apiKey = 'b685b96be5b94e67917e75113d2e5809';

let url = 'http://newsapi.org/v2/top-headlines?' +
'country=us&' +
'apikey=' + apiKey;

// Startup behavior
fetch(proxyurl + url).then(response => {
    return response.json()
}).then(obj => console.log(obj))


const searchbar = document.getElementById('searchbar');
const submit = document.getElementById('submit');
console.log(searchbar)
submit.onclick = () => {
    console.log('Clicked');
    console.log(searchbar.value)
    searchbar.value = '';
};

/*
searchbar.addEventListener('click', () => {
    console.log('Hi')
});
*/
console.log("hello")

