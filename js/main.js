document.addEventListener("DOMContentLoaded", function() {
    createArray()
})

document.getElementById('remake-btn').addEventListener('click', function() {
    remakeArray()
})
document.getElementById('sort-btn').addEventListener('click', function() {
    sort(array)
})
