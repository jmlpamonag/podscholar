const { formatHyphenateLowercaseTrim } = require('../../utility/string.utility');

function createFeed(type, title, description) {
	return `<section id="${createFeedId(type, title)}">
				<div class="feed">
					<div class="container">
						<div class="feed-row">
							<div class="feed-col">
								<h6 class="feed-type-heading">${type !== undefined && type !== null ? type : ''}</h6>
							</div>
							
							<div class="feed-col">
								<h1 class="feed-title">${title !== undefined && title !== null ? title : ''}</h1>
							</div>
							
							<div class="feed-col">
								<p class="feed-description">${description !== undefined && description !== null ? description : ''}</p>
							</div>
						</div>
						
						<div class="podcast-preview-row">
							
						</div>
						
						<div class="feed-row">
							<div class="feed-pagination-col">
								<button id="${createFeedId(type, title)}" class="feed-pagination">Load More</button>
							</div>
						</div>
					</div>
				</div>
			</section>`;
}

function createFeedId(type, title) {
	if (title !== null && title !== undefined) {
		return `feed-${formatHyphenateLowercaseTrim(type)}-${formatHyphenateLowercaseTrim(title)}`;
	}

	return `feed-${formatHyphenateLowercaseTrim(type)}`;
}

module.exports = { createFeed };