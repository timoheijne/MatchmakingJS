# MatchmakingJS
A matchmaking system written in NodeJS for my personal development and it also doubles as a school assignment.
Its like tinder for matches but automatic.

![Build Image](https://travis-ci.org/lghenk/MatchmakingJS.svg?branch=master)
![Dependencies](https://david-dm.org/lghenk/MatchmakingJS/status.svg)
![Dev Dependencies](https://david-dm.org/lghenk/MatchmakingJS/dev-status.svg)

## Features
- Da

## Software Analysis 
I decided to go with NodeJS because of its scalability and the fact that it can run on multiple platforms.
Also because of its Non-Blocking IO operations makes this quite desirable for large scale applications

## Goals of this project
- Have a fully functional matchmaking system
- Get more experience with NodeJS and networking programming
- Find a good reason to use multi-threading/clusters
- Write a very nice portfolio piece that I can possibly use for future projects
- Some way of geo matching (better ping etc)
- Optional but preferable: Learn how to unit test
- Optional but preferable: Continuous Intergration 


## Planning 
| | Monday | Tuesday | Wednesday | Thursday | Friday |
| --- | --- | --- | --- | --- | --- |
|week 1 | Start Development Matchmaking | Finish Step 1 & start step 2 | -> | Finish Step 2 | ->
|week 2 | Finish step 2 & start step 3 | -> | Turn in assignment to school and start step 4 |

### Step 1
For Step 1 I want a successful network connection with storage of the currently waiting for a match players

### Step 2
I want that the matchmaking can keep track of parties and do some basic matchmaking

### Step 3
I want a more advanced matchmaking algorithm and the start of a server spawner communication bridge

### Step 4
I want to have a basic server spawner up and running using Docker

## Sources
- [Gamasutra Skill, matchmaking, and ranking systems design](https://www.gamasutra.com/view/news/310968/Video_Skill_matchmaking_and_ranking_systems_design.php)
- [Testing In NodeJS](https://mochajs.org/)
- [NodeJS Clusters](https://nodejs.org/api/cluster.html)
- [TCP Server](https://nodejs.org/api/net.html)