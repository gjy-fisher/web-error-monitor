function foo() {
    console.log("lol, i don't do anything")
}

function foo2() {
    foo()
    console.log('i called foo')
}

function broken() {
    try {
        /* fkjdsahfdhskfhdsahfudshafuoidashfudsa*/ fdasfds[0] // i throw an error h sadhf hadsfdsakf kl;dsjaklf jdklsajfk ljds;klafldsl fkhdas;hf hdsaf hdsalfhjldksahfljkdsahfjkl dhsajkfl hdklsahflkjdsahkfj hdsjakhf dkashfl diusafh kdsjahfkldsahf jkdashfj khdasjkfhdjksahflkjdhsakfhjdksahfjkdhsakf hdajskhf kjdash kjfads fjkadsh jkfdsa jkfdas jkfdjkas hfjkdsajlk fdsajk fjkdsa fjdsa fdkjlsa fjkdaslk hfjlkdsah fhdsahfui
    } catch (e) {
        console.error('1')
        console.error('2')
        console.error('3')
        Report.catchError(e)
    }
}

function ready() {
    document.getElementById('test').onclick = broken
}

function foo3() {
    document.getElementById('crap').value = 'barfdasjkfhoadshflkaosfjadiosfhdaskjfasfadsfads'
}

function somethingelse() {
    document.getElementById('somethingelse').value = 'this is some realy really long message just so our minification is largeeeeeeeeee!'
}

function derp() {
    fdas[0]
}


function throwString() {
    throw 'oops'
}

function throwEval() {
    eval('derp();')
}


function blobExample() {
    console.log('in')
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'stack.js')
    xhr.onreadystatechange = function () {
        console.log('origin state')
        if (xhr.readyState === 4) {
            const blob = new Blob([xhr.responseText], { type: 'application/javascript' })
            const url = URL.createObjectURL(blob)

            const script = document.createElement('script')
            script.src = url
            document.head.appendChild(script)
        }
    }
    xhr.send()
}

function keypress(e) {
    if (e.key == 'a') {
        throw 'key press'
    }
}

function a() { b() }
function b() { c() }
function c() { d() }
function d() { e() }
function e() { f() }
function f() { g() }
function g() { h() }
function h() { i() }
function i() { j() }
function j() { k() }
function k() { l() }
function l() { m() }
function m() { n() }
function n() { o() }
function o() { throw new Error('dang') }

function promise() {
    let resolve
    let reject
    const testPromise = new Promise((r, e) => { resolve = r; reject = e })
    console.log(resolve)
    console.log(reject)
    reject('asdasdasd')
}
