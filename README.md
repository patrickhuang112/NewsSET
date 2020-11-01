# NewsSET

An express web application for the 2020 Capital One Software Engineering Summit Challenge. Website is viewable online 
<a href= "https://phuang-newsset-ses.herokuapp.com/" target = "_blank">here</a>
## Running the website:
Navigate to this folder's home directory and run this command
```
node index.js
```
Go to localhost:8000 to view the website locally.

## Website features:
<ul>
<li>At the top of page, click one of the three columns for a quick way to get top new stories in sports, entertainment, or tech</li>
<li><ul>The three horizontal bars is the options menu.
<li>Users can select the number of articles to display per search</li>
<li>Users can select which news category (or none) to search the keyword for</li>
<li>Users can select to display news from Latest to earliest, or earliest to latest</li>
<li>Users can view previous successful searches, with information about the keyword or category they searched for</li>
</ul>
</li>
<li>In the bottom right corner, a user can click the arrow bottom to go back to the search bar</li>
</ul>

## Some Notes:
<ul>

<li>The project specifications says any search (which I assumed including any
    kind of keyword search) had to be filtered by the three categories above.
    For some reason with this news API, using keyword searches while 
    also constraining by category for top headlines oftens yields very few results, but I wanted to meet the project specs so I included 
    it here. If I were making this to actually work the best it could be, any keyword search would
    just be a general search and not be constrained by a category.</li>
<li>If the news API returns no articles, a message will show above the search bar</li>
<li>Missing author and summary content will say: "No author found" or "No summary available"</li>
<li>Missing images will say "No image found" or "Image failed to load"</li>
<li>Website is hosted on heroku</li>
</ul>