var feed,xmlFeed, xtitle, xlink, xbody, xdate,
filePath = "/cas/externcontent/SystemStatus.rss",
containerID = "#mayday", 
NO_STATUS_PARAM = "systemstatus=false",
itemCount = 0,
items, feed;

var rssUrl = window.location.protocol + "//" + window.location.hostname + filePath;

function makeNotificationItem(title, body, linkHref, date) {
        var str = "<div class='mayday-item closed ERROR'>" +
                        "<div class = 'title'>" +
                                "<h2>" + title + "</h2>" +
                                "<span>" + date + "</span>" +
                        "</div>" + body;

        if (linkHref != null) {
                str += "<a class = 'more-info' href = '" + linkHref + "'>More info</a>";
        }

        return str + "</div>";
}


console.log(window.location.protocol);
console.log(window.location.hostname);
console.log(filePath);

if (window.location.search.indexOf(NO_STATUS_PARAM) < 0) {
	$.ajax({
        	url: window.location.protocol + "//" + window.location.hostname + filePath,
        	dataType: "xml",
        	success : function(response) {
                	feed = $(response);
			displayRSS();
			setupCollapseHandlers();
			steadyLoginHeight(); 
        	}
	});
}

function displayRSS() {
        items = $(feed).find("item");
        console.log(items.length);

        if (items.length > 0) {
                $(containerID).css('display', 'block');

                items.each(function(item) {

                        xtitle = $(this).find("title").text();
                        xdate = $(this).find("pubDate").text();
                        console.log(xdate);
                        xdate = xdate.substr(0, xdate.length - 13);
                        console.log("Date :" + xdate);
                        xlink = $(this).find("link");
                        xlink = xlink.length > 0 ? xlink.text() : null;

                        xbody = $(this).find("description").text();

                        $(containerID).append(makeNotificationItem(xtitle, xbody, xlink, xdate));

                        itemCount++
                });
        }
}


function setupCollapseHandlers() {
	$('.mayday-item').click(function() {
        	$(this).toggleClass("closed");
	});
}


function steadyLoginHeight()
{
	var pageInner = $('#bodyContainer .page-inner');
	var topOffset = $(pageInner.children()[0]).offset().top;

	pageInner.css({
		display: 'block',
		marginTop: topOffset
	});
}