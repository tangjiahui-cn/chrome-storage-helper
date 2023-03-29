const MESSAGE = {
    GET_LOCAL_STORAGE: '0', // popup获取localStorage
    SET_LOCAL_STORAGE: '1'  // popup发起设置当前页localStorage
}

// from popup
chrome.runtime.onMessage.addListener((request) => {
    switch (request.type) {
        case MESSAGE.GET_LOCAL_STORAGE:
            sendToPopup(localStorage)
            break;
        case MESSAGE.SET_LOCAL_STORAGE:
            setLocalStorage(request.data)
            break;
    }
})

function sendToPopup(data) {
    chrome.runtime.sendMessage(data)
}

function setLocalStorage(data = {}) {
    localStorage.clear()
    Object
        .entries(data)
        .forEach(([key, value]) => {
            localStorage[key] = value
        })
}