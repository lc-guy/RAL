// Add JS functionality to timeline navigators and
// block their HTML hrefs
function connectnav(collection, leftnav, rightnav)
{
	collection.currpage = 0;

	rightnav.removeAttribute('href');
	rightnav.addEventListener('click', function(e) {
		timelinescroll(collection, collection.currpage + 1);
	});
	leftnav.removeAttribute('href');
	leftnav.addEventListener('click', function(e) {
		e.preventDefault();
		timelinescroll(collection, collection.currpage - 1);
	});

	// Remove the ?p= from the href query string (since JS
	// keeps track of the current page
	var children = collection.children;
	for (var i = 0; i < children.length; i++) {
		var href = children[i].href;
		var query = href.slice(href.indexOf('?') + 1);
		var page = href.slice(0, href.indexOf('?'));
		query = removequeryparts(query, ['p']);
		if (query.length > 0)
			children[i].href = page + '?' + query;
		else
			children[i].href = page;
	}
}
function connectreader(reader)
{
/*
	// Don't bother with the cool stuff if we are on a mobile
	if (window.matchMedia("(max-width: 600px)").matches) return;

	// Hide the scrollbar from view
	reader.style.overflow = 'hidden';

	reader.highlighted = reader.firstElementChild;
	var next = reader.highlighted.nextElementSibling;


	// Preserve scroll position
	var h = reader.clientHeight;
	if (reader.scrollTop > h / 2)
	while (next.offsetTop - h / 2 < reader.scrollTop) {
		reader.highlighted = next;
		next = reader.highlighted.nextElementSibling;
	}
	var previous = reader.highlighted.previousElementSibling;
	var scrollbank = reader.scrollTop + h / 2;
	var scrollbank = 0;
	reader.highlighted.classList.add('selected');

	var speed = 40;
	function handlescroll(dy) {
		var direction = (dy > 0 ? 1 : -1);

		scrollbank += speed * direction;

		var h = reader.clientHeight;
		if (scrollbank > h / 2)
			reader.scrollTop = scrollbank - h / 2;
		else reader.scrollTop = 0;

		if (scrollbank < 0) {
			scrollbank = 0;
			readerhighlight(reader, reader.firstElementChild);
			previous = null;
			next = reader.firstElementChild.nextElementSibling;
		}
		else if (scrollbank > reader.lastElementChild.offsetTop + reader.lastElementChild.offsetHeight) {
			previous = reader.lastElementChild.previousElementSibling;
			readerhighlight(reader, reader.lastElementChild);
			next = null
			scrollbank = reader.lastElementChild.offsetTop + reader.lastElementChild.offsetHeight;
		}
		else if (next && scrollbank > next.offsetTop) {
				scrollbank = next.offsetTop;
				previous = reader.highlighted;
				readerhighlight(reader, next);
				next = next.nextElementSibling;
			}
		else if (previous && scrollbank < previous.offsetTop + previous.offsetHeight) {
				scrollbank = previous.offsetTop + previous.offsetHeight;
				next = reader.highlighted;
				readerhighlight(reader, previous);
				previous = previous.previousElementSibling;
		}
	}
	wheel = "onwheel" in document.createElement("div") ? "wheel" :
	document.onmousewheel !== undefined ? "mousewheel" :
	"DOMMouseScroll";
	reader.addEventListener(wheel, function(e) {
		e.preventDefault();
		handlescroll(e.deltaY);
	});
*/
}
function readerhighlight(reader, element)
{
	reader.highlighted.classList.remove('selected');
	element.classList.add('selected');
	reader.highlighted = element;

}
// Remove a parameter from the GET query string (do not pass
// the ? or location!)
function removequeryparts(query, params)
{
	var parts = query.split('&');
	var newparts = [];
	for (var k = 0; k < parts.length; k++) {
		if (params.indexOf(parts[k].split('=')[0]) < 0)
		newparts.push(parts[k]);
	}
	return newparts.join('&');
}
function timelinescroll(collection, page)
{
	/* CONFIG_MAX_TIMELINES */
	var results_per_page = 5;

	var children = collection.children;
	var delay = 0;
	var i;

	// Gradually hide currently shown elements
	for (i = 0; i < children.length; i++) {
		if (children[i].style.display == 'none') continue;
		setTimeout(function(node) {
				node.style.visibility = 'hidden';
		}, delay, children[i]);
		delay += 50;
	}

	// Remove old page from document flow and add in the new page
	setTimeout(function() {
		for (i = 0; i < children.length; i++) {
			if (i >= results_per_page*page &&
			i < results_per_page*(page+1)) {
				children[i].style.display = '';
			}
			else {
				children[i].style.display = 'none';
			}
		}
	// Gradually show the current page
	var offset = 0;
	for (i = 0; i < children.length; i++) {
		if (children[i].style.display == 'none') continue;
		setTimeout(function(node) {
			node.style.visibility = 'visible';
		}, offset, children[i]);
		offset += 50;
	}

	// Should we show the right / left page nav?
	var timelines = collection.parentNode;
	var leftnav = timelines.getElementsByClassName('leftnav')[0];

	if (!page)
		leftnav.style.visibility = 'hidden';
	else
		leftnav.style.visibility = 'visible';
	var rightnav = timelines.getElementsByClassName('rightnav')[0];
	if (page + 1 >= children.length / results_per_page)
		rightnav.style.visibility = 'hidden';
	else
		rightnav.style.visibility = 'visible';
	}, delay);

	collection.currpage = page;
}
