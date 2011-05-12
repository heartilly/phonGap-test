var _FECTHING = 5;
// Manga Site
//var mangaSite = ["http://www.cococomic.com",
//"http://mh.99770.cc",
//"http://dm.99manga.com",
//"http://www.99comic.com"]
var mangaSite = {
	site1:{
		url:"http://www.cococomic.com",
		xpath:"//ul[@id='hots1']/li",
		xpath2:"//div[@class='c_right_main']",
		del:"li p,.c_right_content >a,.c_right_info,.c_right_content > img"
		},
	site2:{
		url:"http://mh.99770.cc",
		xpath:"//ul[@id='hots1']/li"
		},
	site3:{
		url:"http://www.99comic.com",
		xpath:"//div[@class='cComicList']/ul/li",
		xpath2:"//div[@class='cPubRight']/div[@class='cAreaTitle' or @class='cCun' or @class='cVol' or @class='cCoo']",
		del:".cCtt,li p,.cAreaTitle,.cCt p"
		}
	},
	LS = {
	_THUMBC : $('<div/>').addClass('bl'),	
	_MAINC : $("<div id='main'></div>"),
	_BODY : $("body"),
	_LASTESTCOMIC :[],
	_TARGETSITE : mangaSite.site3,
	serverList : [
					"http://220.189.250.101:99/dm01/", //0
					"http://61.164.109.202:99/dm02/", //1
					"http://58.215.241.46:99/", //2
					"http://61.147.113.99:99/dm04/", //3
					"http://220.189.250.101:99/dm05/", //4
					"http://58.211.75.35:98/dm06/", //5
					"http://220.189.250.101:99/dm07/", //6
					"http://58.211.75.35:98/dm08/", //7
					"http://58.211.75.35:98/dm09/", //8
					"http://220.189.250.101:99/dm10/", //9
					"http://220.189.250.101:99/dm11/", //10
					"http://61.164.109.202:99/dm12/", //11
					],
	requestCrossDomain : function( site,xpath, callback ) {
		// If no url was passed, exit.
		if ( !site ) {
			alert('No site was passed.');
			return false;
		}
		// Take the provided url, and add it to a YQL query. Make sure you encode it!
		var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '" AND xpath="'+ xpath +'" AND charset="gb2312"') +'&format=json&callback=?';
		//console.log(yql)
		// Request that YSQL string, and run a callback function.
		// Pass a defined function to prevent cache-busting.
		$.getJSON( yql, function cbFunc(data) {
		console.log(data.query.results);
		if ( data.query.results ) {

			data = data.query.results;
			// If the user passed a callback, and it
			// is a function, call it, and send through the data var.
			if ( typeof callback === 'function') {
				callback(data);
			}
		}
		// Else, Maybe we requested a site that doesn't exist, and nothing returned.
		else throw new Error('Nothing returned from getJSON.');
		/* */
		}
		 );
	},
	comicDetail : function(e){
			this.url = e.a[0].href;
			this.fullUrl = LS._TARGETSITE.url + e.a[0].href;
			this.id  = /\d+/ig.exec(e.a[0].href).toString();
			this.title = e.a[0].title;
			this.coverImg = e.a[0].img.src;
			this.lastestEps = /\d+/ig.exec(e.p).toString();
	},
	doShowComic: function(results){
		var	docFragment = document.createDocumentFragment(),
				obj = results.li.reverse(),i = obj.length;
			
		while(i--) {var comic = new LS.comicDetail(obj[i]),
							divEntry = $("<div/>", {id:comic.id,class:"c-entry",click: LS.doLoadEps}).data(comic),
							//.bind('click',function(){LS.doLoadEps(comic)}),
							imgC = $("<img/>", {src:comic.coverImg,class:"thumbS"}),
							divEps = $("<div class='c-eps'><div class='c-flex' /></div>").append($("<div class='eps'/>").html(comic.lastestEps)),
							/*divImgC = $("<div />",{class:'c-thumbS',style:'background:url('+comic.coverImg+');'}).append(divEps),*/
							divImgC = $("<div />",{class:'c-thumbS'}).append(divEps).append(imgC),
							divTitle = $("<div class='c-title' />").append($("<span />").html(comic.title));
						//	console.log("end = " + comic.title)
							//lastestComicList.push(comic);
							divInfo = $("<div class='c-info' />").append(divTitle);
							divEntry.append(divImgC).append(divInfo);
							docFragment.appendChild(divEntry[0]);
							}
							
			return docFragment
	},
	// Load first time
	doLastest : function(){
		LS.requestCrossDomain(LS._TARGETSITE.url,LS._TARGETSITE.xpath, function doResult(results) {
		
			var	docFragment = LS.doShowComic(results);
				
			console.log("======================================");
			//docFragment = 
			
							//LS._THUMBC.append(li);
						
			/* * /
			$(results.li).each(function appendLatest(i,e){
				doReadComicList(e,function(comic){
						lastestComicList += comic;
						var li = $("<li/>").attr("rel",comic.url),
							img = $("<img/>").attr({src:comic.coverImg,class:"thumbS"}),
							span = $("<span />").html(comic.lastestEps);
							span2 = $("<span />").html(comic.title);
							li.append(span2).append(span).append(img);
							docFragment.appendChild(li[0]);
							//LS._THUMBC.append(li);
					});
					$(results).remove();
					
				})
			/* */
		//	LS._LASTESTCOMIC = lastestComicList;
			LS._THUMBC.append(docFragment);
			LS._MAINC.append(LS._THUMBC);
			LS._BODY.append(LS._MAINC);
		}); 
	},
	doLoadEps : function(){
		var comic = $(event.currentTarget).data(comic);
		console.log(comic.title);
		console.log(comic.url);
		console.log(comic.id);
		//console.log(event.data);
	},
	// Construt
	doConstrucMain : function(){
		backButt = $("<div class='stdButt'>back</div>").bind('click',function(){
			$("#main").slideDown();
			if($("#eps")){$("#eps").remove();}
		})	
		var navList = $('.cHYinYin a');
		console.log(navList.length);
		navList.bind('click',function(){
			var phaseURL = doConcatUrl(this);
				doAjaxLoadEp(phaseURL);
				
		})
		LS.doLastest();
	}

	

// Image Server ip
/*
var ServerList=new Array(12);
ServerList[0]="http://210.22.14.110:99/dm01/";
ServerList[1]="http://210.22.14.111:99/dm02/";
ServerList[2]="http://210.22.14.111:99/dm03/";
ServerList[3]="http://210.22.12.253:99/dm04/";
ServerList[4]="http://221.4.182.218:99/dm05/";
ServerList[5]="http://221.4.182.219:99/dm06/";
ServerList[6]="http://221.4.182.219:99/dm07/";
ServerList[7]="http://221.4.179.13:99/dm08/";
ServerList[8]="http://218.107.52.44:99/dm09/";
ServerList[9]="http://221.4.179.13:99/dm10/";
ServerList[10]="http://221.4.182.219:99/dm11/";
ServerList[11]="http://221.4.179.13:99/dm12/";
*/
/*
var ServerList=new Array(12);
ServerList[0]="http://58.215.241.39:99/dm01/";
ServerList[1]="http://61.164.109.202:99/dm02/";
ServerList[2]="http://58.211.75.35:98/dm03/";
ServerList[3]="http://61.147.113.99:99/dm04/";
ServerList[4]="http://58.215.241.39:99/dm05/";
ServerList[5]="http://61.164.109.202:99/dm06/";
ServerList[6]="http://61.164.109.202:99/dm07/";
ServerList[7]="http://61.147.113.99:99/dm08/";
ServerList[8]="http://58.211.75.35:98/dm09/";
ServerList[9]="http://61.147.113.99:99/dm10/";
ServerList[10]="http://58.211.75.35:98/dm11/";
ServerList[11]="http://61.147.113.99:99/dm12/";
*/

/* * /
// Get location valae
function Request(strName,strHref){
    var strHref = strHref;
    var intPos = strHref.indexOf("?");
    var strRight = strHref.substr(intPos + 1);
    var arrTmp = strRight.split("*");
    for(var i = 0; i < arrTmp.length; i++)
    {
        var arrTemp = arrTmp[i].split("=");
        if(arrTemp[0].toUpperCase() == strName.toUpperCase()) return arrTemp[1];
    }
    return "";
}


// Accepts a url and a callback function to run.


function doConcatUrl(obj){
	var phaseURL = LS._TARGETSITE.url.concat($(obj).attr("rel"));
	console.log("doConcatUrl = "+phaseURL);
	return phaseURL;
	}
	
function doAjaxLoadEp(url){
	requestCrossDomain(url,LS._TARGETSITE.xpath2, function(results) {

			results = $(results)
			epsList = $("<section id='epsList'><ul class='bl'></ul></section>");
			
			$("#main").slideUp();
			$("body").append(epsList)
			//$("#hold").replaceWith("")
			results.each(function(i,e){
			     console.log("select = "+$("select",e).length)
					e = $(e).contents().find("li");
					e = doRefined(e);
				$(".bl").append(e)
				})
			//$(LS._TARGETSITE.del).remove();
			//$("ul li").attr("rel","passed");
			//$("ul li").bind("click",listPg);
			//$("#epsList").prepend(backButt)
			//return results
	});
}
// add some 
function doRefined(e,callback){
	e.attr("rel",e.find("a:first-of-type").attr("href"))
	.find("a:first-of-type").removeAttr("href")
	.bind('click',listEp)
	.find("img").attr("class","thumbS");
	callback(e)
	}
	

// Load manga episo
function listEp(){

// Load images
function listPg(){
	var linkTo = $(this).find("a:first-of-type").attr("href");
	$(this).find("a:first-of-type").removeAttr("href");
	var phaseURL = LS._TARGETSITE.url.concat(linkTo);
	console.log(phaseURL)
	imgHollder = $("<div id='imgHollder'></div>");
	
	requestCrossDomain(phaseURL,"//head/script[1]", function(results) {
		results = $(results[0]);

		// Get image url
		comic = comicSet(results[0]);
		
		var servera=Request("s",phaseURL);
		if (servera!=""){server=servera;}
		$("#hold").before(imgHollder)
		console.log("total pic = "+comic.picListUrl.length);
		//console.log(comic.picListUrl[2].url);
		//console.log(comic.picListUrl[2].page);
		
		newList = comic.picListUrl
		newList = doRenderImg(newList)
		
		
	}); 
	imgHollder.click(function(){
	console.log(newList.length)
		newList = doRenderImg(newList)
		})
	}
function doRenderImg(obj){
			$(obj).each(function(i,e){
			if(i<_FECTHING){
				img = $("<img/>").attr({src:ServerList[server-1]+e.url,class:"comicImg",rel:Number(e.page)+1})
				imgHollder.append(img)
				//comic.index = i;
			
				obj.shift()
				}
			})
			console.log("newList = "+obj.length)
			return obj
	}
	
function comicSet(data){
	var reg1=/ComicListID\s?=\s?(\d+)[\s\S]\W+\w+[\s\S]ComicID\s?=\s?(\d+)[\s\S]\W+\w+[\s\S]PicListUrl\s?=\s?"(.*)"/ig ,
	comicColl = reg1.exec($(data).html()),
	picListUrl  = comicColl[3].split("|"),
	comicSet = {
		listId :comicColl[1],
		id : comicColl[2],
		picListUrl : []
		}
	$(picListUrl).each(function(i,e){
		var imgPro = {
			url : e,
			page : i
			}
		comicSet.picListUrl+=imgPro;
	})
	return comicSet
	}
/* */
};
LS.doConstrucMain();
var fav = new Lawnchair('fav');
