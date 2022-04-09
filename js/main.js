let withSubdomain = true;

function loadJSON(callback,jsonlist) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'js/'+jsonlist, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}

function withoutSubdomain() {
    var checkBox = document.getElementById("myCheck");
    if (checkBox.checked == true) {
       	withSubdomain = true;
    } else {
    	withSubdomain = true;
    }
}

function createIframe() {
    var url = findGetParameter('url');
    var ifrm = document.createElement('iframe');
    ifrm.setAttribute('id', 'ifrm'); // assign an id
    var el = document.getElementById('reconlist');
    el.parentNode.insertBefore(ifrm, el);
    ifrm.setAttribute('src', url);
}

function createIframeList() {
    createIframe();
}

function createList(jsonlist) {
    // Set up a loop that goes through the items in listItems one at a time
    numberOfListItems = jsonlist.length;
    listContainer = document.getElementById('reconlist');
   
    // Make the list
    listElement = document.createElement('ul');
    listContainer.appendChild(listElement);
  
    for (var i = 0; i < numberOfListItems; ++i) {
	if (jsonlist[i]['start'] != 1){
		continue;
	}
        // create an item for each one
        const listItem = document.createElement('li');
        // Add the item text
        listItem.innerHTML = "<a class='after' href='"+jsonlist[i]['url']+"' onclick=\"replacePlaceholder('listitem"+i+"'); return false;\"  id=\"listitem"+i+"\" target=\"_blank\">"+jsonlist[i]['title']+"</a>";
        // Add listItem to the listElement
        listElement.appendChild(listItem);	
    }
    if(window.location.hash) {
	changeList(jsonlist,window.location.hash.substring(1));
    } 
}

function changeList(jsonlist, category) {
    cleanIframe();
    // Set up a loop that goes through the items in listItems one at a time
    numberOfListItems = jsonlist.length;
    var el = document.getElementById('reconlist').getElementsByTagName('ul')[0];
    if(el) {
	el.remove();
    }

    listContainer = document.getElementById('reconlist');
    // Make the list
    listElement = document.createElement('ul');
    listContainer.appendChild(listElement);
    console.log(category);
    for (var i = 0; i < numberOfListItems; ++i) {
		if (encodeURI(jsonlist[i]['category']) != category && category != 'all'){
			continue;
		}
        // create an item for each one
        const listItem = document.createElement('li');
       
        // Add the item text
        listItem.innerHTML = "<a class='after' href='"+jsonlist[i]['url']+"' onclick=\"replacePlaceholder('listitem"+i+"'); return false;\"  id=\"listitem"+i+"\" target=\"_blank\">"+jsonlist[i]['title']+"</a>";
        // Add listItem to the listElement
        listElement.appendChild(listItem);	
    }
}

// left menu
function createMenu(jsonlist) {
    numberOfListItems = jsonlist.length;
    menuList = [];
  
    for (var i = 0; i < numberOfListItems; ++i) {
	if (jsonlist[i]['start'] != 1){
		continue;
	}
	if(menuList.indexOf(jsonlist[i]['category']) === -1) {
		menuList.push(jsonlist[i]['category']);
	}
    }
	
    menuContainer = document.getElementById('menuCategoryList');
    // Make the menu
    menuElement = document.createElement('ul');
    menuContainer.appendChild(menuElement);

    const listItem = document.createElement('li');
    // Add the item text
    listItem.innerHTML = "<a href='#' id=\"menuitemall\" onclick=\"changeList(jsonlist,'all')\">Show all</a>";
    // Add listItem to the menuElement
    menuElement.appendChild(listItem);
	
    menuList.forEach(function (item) {
	// create an item for each one
        const listItem = document.createElement('li');
        // Add the item text
        listItem.innerHTML = "<a href='#' id=\"menuitem"+item+"\" onclick=\"changeList(jsonlist,'"+encodeURI(item)+"')\">"+item+"</a>";
        // Add listItem to the menuElement
        menuElement.appendChild(listItem);
    });
}

function cleanIframe() {
    var iframecontainer = document.getElementById('ifrm');
    if (iframecontainer !== null) {
	    iframecontainer.remove();
    }
}

// import the array which acts as a data source for the list
function startSite() {

    if(findGetParameter('mode')) {
         switch (findGetParameter('mode')) {
           case 'iframe':
		createIframe()
	   break;
           case 'dir':
	        openSiteinIframe('dir');
	   break;
	   case 'file':
	        openSiteinIframe('file');
	   break;
	 }
	 loadJSON(function(response) {
           // Parse JSON string into object
           jsonlist = JSON.parse(response);
           createMenu(jsonlist);
        }, 'reconlist.json');
    } else {
        loadJSON(function(response) {
           // Parse JSON string into object
           jsonlist = JSON.parse(response);
           createList(jsonlist);
           createMenu(jsonlist);
        }, 'reconlist.json');
   }
}

function replacePlaceholder(listid) {
	var x = document.getElementById(listid).href;
	var domain = document.getElementById('domain').value;
        // withSubdomain
	window.open(x.replaceAll("xxPBBDSxx", domain), '_blank');
	
}
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function ajaxFunctionTest() {
   var url = findGetParameter('url');
   var cors = false;
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
	}
     };
   xhttp.open("POST", url, true);
   xhttp.send()
}

// function to get the dorks from github repo
function getDorksFromGithub() {
   var url_googledorksopenredirect = 'https://raw.githubusercontent.com/Proviesec/google-dorks/master/google-dorks-open-redirect.txt';
   fetch(url_googledorksopenredirect).then(function(response) {
       response.text().then(function(text) {
	  var obj = {"Google Dorking" : "", "category" : "Google Dorking", "start": 1,"subdomain": 1,"url": "https://www.google.com/search?q=site:xxPBBDSxx%20"+text}
          var s = JSON.stringify(obj)
	  createList(s);
	  return s;
       });
   });
}

