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
I previously had issues with the free API key only working on Firefox, but after
the Capital One engineers supplied a business API key, I keep getting 426 http
upgrade required on Chrome, but no error on Firefox. I have posted a question 
on the challenge page and will update when I get a response, but currently, the 
website STILL only works on Firefox and not on Goolge Chrome</li>
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
