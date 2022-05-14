// initially set minimum height
setMinimumHeight();

// recalculate and set minimum height on each page resize
window.addEventListener('resize', setMinimumHeight);

function setMinimumHeight() {
	let headerHeight = document.querySelector('header').offsetHeight;
	let footerHeight = document.querySelector('footer').offsetHeight;
	let windowHeight = window.innerHeight;

	let mainHeight = windowHeight - headerHeight - footerHeight;

	document.querySelector('main').setAttribute('style', `min-height: ${mainHeight}px`);
}