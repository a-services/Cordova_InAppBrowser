
document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('DOMContentLoaded', onDocumentReady, false);

var browser;

/**
 * Document ready.
 *
 * There are 3 buttons on the screen.
 */
function onDocumentReady() {
    console.log('-- Document Ready');

    var b1 = document.getElementById('button1');
    if (b1) {
        b1.addEventListener('click', function(event) {
            browserOpen(loginPage);
            event.stopPropagation();
        });
        var b2 = document.getElementById('button2');
        b2.addEventListener('click', function(event) {
            browserOpen(pages[1]);
            event.stopPropagation();
        });
        var b3 = document.getElementById('button3');
        b3.addEventListener('click', function(event) {
            browserOpen(pages[2]);
            event.stopPropagation();
        });
    }

    var bs = document.getElementById('submitButton');
    if (bs) {
        bs.addEventListener('click', function(event) {
            console.log('-- Submit Options');
            updateOptions(document.getElementById('iabOptions').value);
            window.location.href = 'index.html';
            event.stopPropagation();
        });

        document.getElementById('iabOptions').value = getOptions();
    }

    if (!window.cordova) {
        window.cordova = {
            InAppBrowser: window
        };
    }
}

/**
 * Device ready.
 */
function onDeviceReady() {
    console.log('-- Device Ready');
}

function browserOpen(targetUrl) {
    var options = getOptions();
    console.log('-- open:', options);
    browser = cordova.InAppBrowser.open(targetUrl, '_blank', options);
    browser.addEventListener('beforeload', onBeforeLoad);
    browser.addEventListener('loadstop',   onLoadStop);
    browser.addEventListener('loadstart',  onLoadStart);
    console.log('-- browserOpen listeners: beforeload,loadstop,loadstart');
}

/**
 * See on StackOverflow:
 *   Intercept PDF URLs with cordova-plugin-inappbrowser:
 *   https://stackoverflow.com/questions/54061079/ionic-intercept-pdf-urls-with-cordova-plugin-inappbrowser
 */
function onBeforeLoad(event, callback) {
    console.log('-- onBeforeLoad:', event.url);

    // If the URL being loaded is a PDF
    if (event.url.match(".pdf")) {
        // Open PDFs in system browser (instead of InAppBrowser)
        cordova.InAppBrowser.open(event.url, "_system");
    } else {
        // Invoke callback to load this URL in InAppBrowser
        callback(event.url);
    }
}

function onLoadStop(event) {
    console.log('-- onLoadStop:', event.url);

    if (event.url == loginPage) {
        console.log('-- autologin');

        browser.executeScript({code: `
            document.getElementById('${usernameInputID}').value = '${siteUsername}';
            document.getElementById('${passwordInputID}').value = '${sitePassword}';
            var logins = document.getElementsByName('${loginButtonName}');
            if (logins.length == 1) {
                logins[0].click();
            }
        `});
    }
}

function onLoadStart(event) {
    console.log('-- onLoadStart:', event.url);
}


