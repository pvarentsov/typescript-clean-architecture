# Typescript Clean Architecture

It is my attempt to create Clean Architecture based application in Typescript

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](./LICENSE)

<p align="center"> 
    <img src="./asset/IPosterStructure.png">
</p>

## IPoster

IPoster is a simple fictional application that allows users to publish posts.

##### Main Entities:
1. User
2. Post
3. Media

##### Use Cases:

User -> IPoster:

1. `User` can create `Guest` account in `IPoster`
2. `User` can create `Author` account in `IPoster`

User -> Media:

1. `Author User` can create own `Media`
2. `Author User` can edit own `Media`
3. `Author User` can get own `Media`
4. `Author User` can get own `Media` list
5. `Author User` can remove own `Media`

User -> Post:

1. `Author User` can create own draft `Post`
2. `Author User` can edit own `Post`
3. `Author User` can attach an image `Media` to own `Post`
4. `Author User` can publish own `Post`
5. `Author User` can get own `Post`
6. `Author User` can get own `Post` list
7. `Author User` can remove own `Post`
8. `All users` can get published `Post`
9. `All users` can get list with published `Posts`
