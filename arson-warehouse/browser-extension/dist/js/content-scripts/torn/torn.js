const scriptTag = document.createElement('script');
scriptTag.src = chrome.runtime.getURL('js/page-scripts/collect-equipment-stats.js');
scriptTag.onload = function() {
    this.remove();
};
document.head.appendChild(scriptTag);

scriptTag.addEventListener('arson-warehouse-event-from-page', (event) => {
    const {action, payload} = event.detail;
    if (! ['received-equipment-report'].includes(action)) {
        return;
    }
    chrome.runtime.sendMessage({action, payload});
});


const travelAgencyMarket = document.querySelector('.travel-agency-market');
if (travelAgencyMarket) {
    const country = document.querySelector('h4').innerText.trim();
    const itemStocks = [];

    for (let itemListItem of Array.from(travelAgencyMarket.querySelectorAll('li'))) {
        const image = itemListItem.querySelector('img[src^="/images/items/"]');
        const itemId = parseInt(image.getAttribute('src').replace('/images/items/', ''), 10);
        const stock = parseInt(itemListItem.querySelector('.stck-amount').innerText.trim().replace(/,/g, ''), 10);

        itemStocks.push({
            item_id: itemId,
            stock,
        });
    }

    chrome.runtime.sendMessage({
        action: 'obtained-foreign-stock',
        payload: {
            country,
            items: itemStocks,
        },
    });
}