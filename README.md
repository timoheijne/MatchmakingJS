# MatchmakingJS

![Build Image](https://travis-ci.org/lghenk/MatchmakingJS.svg?branch=master)
![Dependencies](https://david-dm.org/lghenk/MatchmakingJS/status.svg)
![Dev Dependencies](https://david-dm.org/lghenk/MatchmakingJS/dev-status.svg)

A matchmaking system written in NodeJS. The idea of this matchmaking system is to be as generic and configurable as possible so that I can use it for any game in the future with no- or minor tweaks

This project also doubles as a school assignment (that I created my self).

## Certain Items worth pointing out
- [Generic Socket Service](https://github.com/lghenk/MatchmakingJS/blob/master/services/SocketService.js)
- [Dispatcher](https://github.com/lghenk/MatchmakingJS/tree/master/controllers/dispatcher)
- [TCP Routing (functionality of the dispatcher)](https://github.com/lghenk/MatchmakingJS/blob/master/routes/PlayerRoutes.js)
- [The Unit Tests](https://github.com/lghenk/MatchmakingJS/tree/master/test)

## Software Analysis 
Most languages can handle TCP Sockets. I have sufficient proficiency in the following languages: C#, C++, JAVA & NodeJS(javascript)
that are suitable for this system

- C++: In C++ It is relatively hard to work with sockets and not only that you have to take care of your pointers and really make sure you are not creating any memory leaks. Since we will be working with a ton of reference to the clients socket in this project. I personally think it is not the best choice on the list HOWEVER it is extremely fast
+ C++ is not platform independent out of the box and it's not exactly the language to prototype in.

- C# & JAVA: Both languages are fast and reliable. Both languages are easily compiled for multiple OS'es 

- NodeJS: A non-IO blocking async language that works platform independent out of the box, Easily scalable for big projects and event-based programming here is practically required which for a system like this is favorable

I decided to go with NodeJS because of its scalability and the fact that it can run on multiple platforms.
Also because of its Non-Blocking IO operations makes this quite desirable for large scale applications

## Goals of this project
- Have a fully functional matchmaking system
- Get more experience with NodeJS and networking programming
- Find a good reason to use multi-threading/clusters
- Write a very nice portfolio piece that I can possibly use for future projects
- Some way of geo matching (better ping etc)
- Optional but preferable: Learn how to unit test
- Optional but preferable: Continuous Integration 


## Planning 
| | Monday | Tuesday | Wednesday | Thursday | Friday |
| --- | --- | --- | --- | --- | --- |
|Week 1 | Start Development Matchmaking | Finish Step 1 & start step 2 | -> | Finish Step 2 | ->
|Week 2 | Finish step 2 & start step 3 | -> | Turn in assignment to school and start step 4 |

### Step 1
- Start working out how this system should work exactly (mostly done in my head)

### Step 2
- Successful network connection with the client
- Express like routing for incoming socket traffic

### Step 3
- Global event system
- Basic Matchmaking 
- Some form of authentication

### Step 4
Step 4 includes part two of this assignment which is an actual multiplayer system written from scratch
- Implement Server Spawner connection
- Send out match data to the client (IP:port where to connect)

The above steps are for a basic matchmaking system which can and likely will grow in the future with more advanced features & implementations 
like actual authentication

## Sources
- [Gamasutra Skill, matchmaking, and ranking systems design](https://www.gamasutra.com/view/news/310968/Video_Skill_matchmaking_and_ranking_systems_design.php)
- [Testing In NodeJS](https://mochajs.org/)
- [NodeJS Clusters](https://nodejs.org/api/cluster.html)
- [TCP Server](https://nodejs.org/api/net.html)