let array = document.getElementById('first-row')
let modules = document.getElementsByClassName('module')
let space = document.getElementById('merge-area')
let size = 10
let topMargin = 5
let timeout = 500

function createArray() {
    console.log('creating first array')
    for (let i = 0; i < size; i++) {
        let m = createArrayModule(i)
        m.style.backgroundColor = 'green'
        array.appendChild(m)
    }
}

function createArrayModule(n) {
    let module = document.createElement('div')
    module.classList.add('module')


    let number = document.createElement('p')
    number.classList.add('number')

    let text = document.createTextNode(n)
    number.appendChild(text)
    module.appendChild(number)
    return module
}

async function createSubArray(from, to, parentArray, dir) {
    let subarray = document.createElement('div')
    subarray.style.width = (to - from) * 70 + "px"
    let pos = parentArray.children[from].getBoundingClientRect()
    while (from < to) {
        subarray.appendChild(createArrayModule(parseInt(parentArray.children[from].innerText)))
        from++
    }
    subarray.classList.add('arrayContainer')

    console.log(pos.left)
    if (dir === '+')
        subarray.style.left = pos.left - 60 + "px"
    else
        subarray.style.left = pos.left + 30 + "px"
    subarray.style.top = pos.top + "px"

    space.appendChild(subarray)
    await animateDivision(subarray, dir)
    return subarray
}

function remakeArray() {
    console.log('buenas tardes')
    let selector = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    while (array.firstChild) {
        array.removeChild(array.lastChild)
    }

    let cont = 0
    for (let i = size; i > 0; i--) {

        let index = Math.floor((Math.random() * i))
        let n = selector[index]
        selector.splice(index, 1)

        array.appendChild(createArrayModule(n))
        animateModule(cont++)
    }

    clear()
}

function clear() {
    let done = true
    while (done) {
        if (space.lastChild.id != 'first-row')
            space.removeChild(space.lastChild)
        else
            done = false
    }
}

function animateModule(i) {
    return new Promise(resolve => {
        modules[i].style.animation = "highlightModule 0.7s ease"
        setTimeout(() => {
            modules[i].style.animation = null
            resolve()
        }, timeout)
    })
}

function animateDivision(half, dir) {

    console.log(half.offsetHeight)

    return new Promise(resolve => {
        half.animate({
            transform: [
                `translate(${dir}40px, ${-(half.offsetHeight) - topMargin}px)`,
                'translate(0, 0)'
            ]
        }, timeout);
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

function animateMerge(target, element) {

    let targetPos = target.getBoundingClientRect()
    let pos = element.getBoundingClientRect()

    return new Promise(resolve => {
        element.animate({
            transform: [
                `translate(${targetPos.left - pos.left}px, ${targetPos.top - pos.top}px)`,
            ]
        }, timeout)
        setTimeout(() => {
            target.children[0].innerText = element.children[0].innerText
            element.style.opacity = 0
            target.style.backgroundColor = 'green'
            resolve()
        }, timeout)
    })
}

async function merge(arr1, arr2, target) {
    let i1 = 0,
        i2 = 0,
        i3 = 0
    while (i1 < arr1.children.length && i2 < arr2.children.length) {
        let val1 = parseInt(arr1.children[i1].children[0].innerText)
        let val2 = parseInt(arr2.children[i2].children[0].innerText)
        if (val1 < val2)
            await animateMerge(target.children[i3++], arr1.children[i1++])
        else
            await animateMerge(target.children[i3++], arr2.children[i2++])
    }
    while (i1 < arr1.children.length)
        await animateMerge(target.children[i3++], arr1.children[i1++])
    while (i2 < arr2.children.length)
        await animateMerge(target.children[i3++], arr2.children[i2++])

}

async function sort(arr) {
    if (arr.children.length <= 1)
        return

    let middle = Math.floor(arr.childNodes.length / 2)
    let half1 = await createSubArray(0, middle, arr, '+')
    let half2 = await createSubArray(middle, arr.childNodes.length, arr, '-')

    await sort(half1)
    await sort(half2)

    await merge(half1, half2, arr)
}