// ==UserScript==
// @name         Colorful TL
// @namespace    http://github.com/wiiiiam104
// @version      0.2.3
// @description  Color Twitter's TL based on AC rating
// @author       @Wiiiiam_104
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==

(()=>{
  "use strict";
  let storage = localStorage.ubuneci5$colorfulTl_colors;
  if(storage !== undefined){
    storage = JSON.parse(storage);
  }

  class TwitterList{
    constructor(listId, color){
      this.listId = listId;
      this.color = color;
    }

    pushMembers(arg){
      for(let i = 0, n = arg.users.length; i < n; i++){
        storage["@" + arg.users[i].screen_name] = this.color;
      }
    }

    accessApi(){
      let headers = new Headers();
      headers.set("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA");
      fetch("https://api.twitter.com/1.1/lists/members.json?count=5000&list_id=" + this.listId, {
        headers
      }).then(r => r.json()).then(r => this.pushMembers(r)).catch(e => {console.error(e)});
    }
  }

  function updateStorage(){
    console.log("start updating your storage <colorfulTl>");

    localStorage.ubuneci5$colorfulTl_latestUpdate = (new Date())-0;
    storage = {};
    let lists = [
      {id:"1265269317169340417", color:"gray"},
      {id:"1265269251641761793", color:"brown"},
      {id:"1265269191877124101", color:"green"},
      {id:"1265269135493099526", color:"cyan"},
      {id:"1265269077888479235", color:"blue"},
      {id:"1265269023278690304", color:"yellow"},
      {id:"1265268943393943554", color:"orange"},
      {id:"1265268852528566273", color:"red"}
    ];

    function f(i){
      if(i < lists.length){
        setTimeout(() => {
          let twiList = new TwitterList(lists[i].id, lists[i].color);
          twiList.accessApi();
          f(++i);
        }, 1000);
      }else{
        localStorage.ubuneci5$colorfulTl_colors = JSON.stringify(storage);
        console.log("finish updating your storage <colorfulTl>");
        return;
      }
    }f(0);
  }

  function main(){
    let latestUpdate = new Date(localStorage.ubuneci5$colorfulTl_latestUpdate) ?? 0;
    let now = new Date();
    if(storage === undefined || now - latestUpdate > 14*24*60*60*1000){
      updateStorage();
    }

    setInterval(()=>{
      let nameSetElements = document.querySelectorAll("article[data-testid=\"tweet\"]");
      for(let element of nameSetElements){
        let name = element.querySelector("article[data-testid=\"tweet\"] a:nth-child(1) div[dir=\"auto\"] span>span");
        let id = element.querySelector("article[data-testid=\"tweet\"] a:nth-child(1) div[dir=\"ltr\"] span:nth-child(1)").innerHTML;
        if(id in storage){
          name.style.color = storage[id];
        }
      }
    }, 1000);
  }

  main();
})();
