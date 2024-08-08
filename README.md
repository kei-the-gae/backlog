<p align="center">
    <img src ="./Screenshot 2024-08-08 at 12.57.06 PM.png" width="500" >
</p>

# Backlog
An app to keep track of your video game collection.

Inspired by my friend's Google Sheets of their game backlog. Also, we all spend far too much time in vc scrolling through Steam pondering on what to play and who has what.

### Getting started
[go here](https://backlog-app-e5d4ee764879.herokuapp.com/)

### Attributions
[IGDB API v4](https://www.igdb.com/api)

### Technologies
HTML / CSS / JavaScript - MongoDB / Express / Node stack

### Stretch goals
- There's an unused wishlist array in the user schema, to add games that isn't in one's collection yet but want to play
- Friends list, to keep track of what your friends own without having to search through all users
- Implement a way to show if your friends select that they want to play a certain game
- Cover art. There's a way to pull cover art links through IGDB. It'd make the game show pages look better.
- Add more details on a game's show page. IGDB has *SO MUCH* information and its difficult to parse directly through the json body of a given game. The API calls are not hard coded to just have what it saves to my DB, so it would be decently easy to implement grabbing more details about a game when I learn how to pull array type elements properly.
- Sort games in my DB in another way than when it was populated when loading onto the games index page.
- Add a peek of a given users collection or wishlist on their show page.
- Add more profile details for a given user.
