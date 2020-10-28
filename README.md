# NewsSET

An express web application for the 2020 Capital One Software Engineering Summit Challenge. Website is viewable online 
<a href= "https://phuang-newsset-ses.herokuapp.com/">here</a>
## Running the website:
Navigate to this folder's home directory and run this command
```
node index.js
```
Go to localhost:8000 to view the website locally.

## Some Notes:
<ul>
<li><b>Please run the website on Firefox!</b>: 
<br>
I originally just wanted to make a website without having to use node/express, but I ran
into issues early on where the NewsAPI free developer key doesn't allow for requests to the
API through a web browser, and only allows for localhost requests. I thus had to run my files
on localhost using node/express. When I published the website online 
<a href= "https://phuang-newsset-ses.herokuapp.com/">here</a>, it again runs into the same issue
on google chrome. However, the website does seem to work for some reason on Firefox. </li>
<li>The project specifications says any search (which I assumed including any
    kind of keyword search) had to be filtered by the three categories above.
    For some reason with this news API, using keyword searches while 
    also constraining by category for top headlines oftens yields very few results, but I wanted to meet the project specs so I included 
    it here. If I were making this to actually work the best it could be, any keyword search would
    just be a general search and not be constrained by a category.</li>
<li>If the news API returns no articles, a message will show above the search bar</li>
<li>The three horizontal bars is the options menu. Click the icon for more options about organizing searched news stories</li>
<li>Missing author and summary content will say: "No author found" or "No summary available"</li>
<li>Missing images will say "No image found" or "Image failed to load"</li>
<li>Website is hosted on heroku</li>
