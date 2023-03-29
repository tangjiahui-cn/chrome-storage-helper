/**
 * 页面流程
 * 
 * 1. 进入页面，请求当前页 storage
 * 2. 进入页面，读取 local.storage
 * 3. 初始化数据
 * 4. 操作数据
 * 5. 保存数据
 * 
 */

const CHOOSE_ALL_MSG = {
	1: '全选',
	2: '反选'
}
const MESSAGE = {
	GET_LOCAL_STORAGE: '0',
	SET_LOCAL_STORAGE: '1'
}

let tabId = null        // 当前页面 tabId
let chooseKeys = []     // 选中keys
let localStorage = {}   // 本地
let pageStorage = {}

const send = (type, data) => chrome.tabs.sendMessage(tabId, { type, data })
const $ = id => document.getElementById(id)
const getStorage = () => chrome.storage.local.get()
const pick = (o = {}, pickKeys = []) => Object.keys(o).reduce((result, key) => {
	if (pickKeys.includes(key)) result[key] = o[key]
	return result
}, {})
const checkIsChooseAll = () => {
	const storageLen = Object.keys(localStorage).length
	return storageLen
		? (storageLen === chooseKeys?.length ? '2' : '1')
		: 0
}
const saveLocalStorage = (localStorage) => chrome.storage.local.set({ localStorage: JSON.stringify(localStorage) })
const saveChooseKeys = (chooseKeys) => {
	dom.chooseAllDom.innerText = CHOOSE_ALL_MSG[checkIsChooseAll()] || ""
	return chrome.storage.local.set({ chooseKeys: JSON.stringify(chooseKeys) })
}
const clearLocalStorage = () => saveLocalStorage({})
const clearChooseKeys = () => saveChooseKeys([])

const dom = {
	loadDom: $('loadBtn'),
	saveDom: $('saveBtn'),

	displayDom: $('display'),
	clearDom: $('clearBtn'),

	chooseAllDom: $('chooseAll'),

	pageClearDom: $('clearLocalBtn'),
	pageDisplayDom: $('display-local'),

	create(name, props) {
		const res = document.createElement(name)
		if (props) {
			Object.keys(props).forEach(k => {
				res[k] = props[k]
			})
		}
		return res
	},
	createCheckbox(props = {}) {
		const el = this.create('input', { type: 'checkbox', ...props })
		return el
	},
	createCheckboxItem(label = '', checked, callBack = {}) {
		const div = this.create('div', {
			className: "display-item",
			title: label
		})
		const checkbox = this.createCheckbox({ checked })
		const span = this.create('span', { innerText: label })

		div.onclick = () => {
			checkbox.checked = !checkbox.checked
			if (checkbox.checked) {
				callBack?.onChoose?.()
			} else {
				callBack?.unChoose?.()
			}
			e.preventDefault();
			e.stopPropagation();
		}

		div.appendChild(checkbox)
		div.appendChild(span)
		return div
	}
}

// 初始化数据
function init() {
	return new Promise(resolve => {
		// 向content.js 发送获取localStorage的请求
		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
			tabId = tabs?.[0]?.id
			send(MESSAGE.GET_LOCAL_STORAGE)
		})

		// // 获取返回的localStorage
		chrome.runtime.onMessage.addListener((req) => {
			getStorage().then(storage => {
				resolve({
					chooseKeys: storage?.chooseKeys ? JSON.parse(storage?.chooseKeys) : null,
					localStorage: storage?.localStorage ? JSON.parse(storage?.localStorage) : {},
					pageStorage: req
				})
			})
		})
	})
}

init().then((data) => {
	chooseKeys = data?.chooseKeys
	localStorage = data?.localStorage
	pageStorage = data?.pageStorage
	appendListener()
	renderLocalStorage(localStorage)
	renderPageStorage(pageStorage)
})

function appendListener() {
	dom.chooseAllDom.innerText = CHOOSE_ALL_MSG[checkIsChooseAll()] || ""

	// 全选/反选本地数据
	dom.chooseAllDom.onclick = () => {
		if (checkIsChooseAll() === '2') {    // 反选
			chooseKeys = []
		} else { // 全选
			chooseKeys = Object.keys(localStorage)
		}
		saveChooseKeys(chooseKeys)
		renderLocalStorage(localStorage)
	}

	// 清空本地
	dom.clearDom.onclick = () => {
		localStorage = {}
		chooseKeys = []
		clearLocalStorage()
		clearChooseKeys()
		renderLocalStorage(localStorage)
	}

	// 清空页面
	dom.pageClearDom.onclick = () => {
		pageStorage = {}
		send(MESSAGE.SET_LOCAL_STORAGE, pageStorage)
		renderPageStorage(pageStorage)
	}

	// 保存
	dom.saveDom.onclick = () => {
		console.log(pageStorage)
		localStorage = pageStorage || {}
		chooseKeys = Object.keys(localStorage)
		saveChooseKeys(chooseKeys)
		saveLocalStorage(localStorage)
		renderLocalStorage(localStorage)
	}

	// 加载
	dom.loadDom.onclick = () => {
		pageStorage = pick(localStorage, chooseKeys)
		send(MESSAGE.SET_LOCAL_STORAGE, pageStorage)
		renderPageStorage(pageStorage)
	}
}

// 渲染本地storage到页面上（可选中）
function renderLocalStorage(localStorage) {
	dom.displayDom.innerHTML = ""
	const keys = Object.keys(localStorage)
	const container = dom.create('div')

	// 暂无数据
	if (!keys.length) {
		const empty = dom.create('div', { innerHTML: '<div class="empty">暂无数据</div>' })
		container.appendChild(empty)
	}

	keys.forEach(key => {
		const checked = chooseKeys.includes(key)
		const el = dom.createCheckboxItem(key, checked, {
			onChoose() {
				chooseKeys.push(key)
				console.log('选择 -> ', chooseKeys, key)
				saveChooseKeys(chooseKeys)
			},
			unChoose() {
				chooseKeys = chooseKeys.filter(id => id !== key)
				console.log('取消选择 -> ', chooseKeys, key)
				saveChooseKeys(chooseKeys)
			}
		})
		container.appendChild(el)
	})

	dom.displayDom.appendChild(container)
}

// 渲染页面storage到页面上
function renderPageStorage(pageStorage) {
	dom.pageDisplayDom.innerHTML = ''
	const keys = Object.keys(pageStorage)
	const container = dom.create('div')

	// 暂无数据
	if (!keys.length) {
		const empty = dom.create('div', { innerHTML: '<div class="empty">暂无数据</div>' })
		container.appendChild(empty)
	}

	keys.forEach(key => {
		const el = dom.create('div', {
			className: 'display-item',
			innerText: key,
			title: key
		})
		container.appendChild(el)
	})

	dom.pageDisplayDom.appendChild(container)
}