console.log("Start SSG")

var appForm = document.getElementById("appForm")
var appButton = document.getElementById("app-button")
var contentRow = document.getElementById('content-row')
var startHeader = document.getElementById('start-header')
var startCode = document.getElementById("start-code")
var resultHeader = document.getElementById("result-header")
var resultCode = document.getElementById("result-code")
var resultRow = document.getElementById('result-row')
var renderHeader = document.getElementById('render-header')
var resultRender = document.getElementById("result-render")

var fileContent
var fileType
var resultContent
var resultAsText
var resultAsRender
var renderDiv

function loadFile() {
    var fileSelector = document.getElementById("choose-file");
    var selectedFile = fileSelector.files[0];
    var fileName = selectedFile.name;
    fileType = selectedFile.name.split('.')[1]
    console.log(`Selected File: ${fileName} \n\t Extension: ${fileType}`);
    console.log(selectedFile);

    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, 'UTF-8');
    fileReader.onload = function() {
        content = fileReader.result
        console.log(`File Content: ${fileContent}`)
        fileContent = content
        console.log("File Loaded")
        console.log(fileContent)

        var textFile = document.createElement('p')
        textFile.innerHTML = fileContent
        startCode.appendChild(textFile)

        appButton.setAttribute('value', 'Convert File');
        appButton.setAttribute('onClick', "convertFile()");
        appButton.setAttribute('class', 'btn btn-success');

    };
};

function convertFile() {
    console.log('Convert File');
    console.log(fileContent);
    console.log(fileType);
    if (fileType == 'md') {
        console.log('Markdown Conversion')
        resultAsText = translateMarkdownText(fileContent)
        resultAsRender = translateMarkdownRender(fileContent)
    };
    
        var textHTML = document.createElement('p')
        textHTML.innerHTML = resultAsText
        resultCode.appendChild(textHTML)
        resultContent = resultAsText

        var renderHTML = document.createElement('div')
        renderHTML.setAttribute('id', 'render-div')
        renderHTML.innerHTML = resultAsRender
        resultRender.appendChild(renderHTML)
        renderDiv = document.getElementById('render-div')

        appButton.setAttribute('value', 'Customize');
        appButton.setAttribute('onClick', "customizeHTML()");
        appButton.setAttribute('class', 'btn btn-dark');

}

function translateMarkdownText(markdown) {
    var htmlText = markdown
        .replace(/^### (.*$)/gim, '&lth3&gt$1&lt/h3&gt')
        .replace(/^## (.*$)/gim, '&lth2&gt$1&lt/h2&gt')
        .replace(/^# (.*$)/gim, '&lth1&gt$1&lt/h1&gt')
        .replace(/^\> (.*$)/gim, '&ltblockquote&gt$1&lt/blockquote&gt')
        .replace(/\*\*(.*)\*\*/gim, '&ltb&gt$1&lt/b&gt')
        .replace(/\*(.*)\*/gim, '&lti&gt$1&lt/i&gt')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "&ltimg alt='$1' src='$2' /&gt")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "&lta href='$2'&gt$1&lt/a&gt")
        .replace(/\n$/gim, '&ltbr /&gt')

    return htmlText
}

function translateMarkdownRender(markdown) {
    var htmlRender = markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
        .replace(/\n$/gim, '<br />')

    return htmlRender
}

function customizeHTML(){
    startHeader.innerHTML = "Base HTML"
    startCode.innerHTML = resultContent
    resultHeader.innerHTML = "Modified HTML"


    resultCode.innerHTML = resultAsText
    renderDiv.innerHTML = resultAsRender

    appForm.innerHTML = ""
    appForm.append(appButton)
    
    appButton.setAttribute('value', 'Convert to Document');
    appButton.setAttribute('onClick', "asHTMLFile()");
    appButton.setAttribute('class', 'btn btn-primary');
}

function asHTMLFile() {
    var htmlSections =[
        ['html-start','&lt!doctype html&gt'],
        ['html-lang','&lthtml lang="en"&gt'],
        ['head-start', '&lthead&gt'],
        ['head-content', ""],
        ['head-end', '&lt/head&gt'],
        ['body-start',' &ltbody&gt'],
        ['body-content', `${resultAsText}`],
        ['body-end', '&lt/body&gt'],
        ['html-end', '&lt/html&gt']
    ]
    
    resultCode.innerHTML = ""
    var resultColumn = document.createElement('div')
    resultColumn.setAttribute('class', 'col')
    resultCode.appendChild(resultColumn)
    
    for (i = 0; i < htmlSections.length; i++) {
        var codeSection = document.createElement('div')
        codeSection.setAttribute('class', 'row')
        codeSection.setAttribute('id', htmlSections[i][0])
        codeSection.innerHTML = htmlSections[i][1]
        resultColumn.appendChild(codeSection)
    }

    metaName = document.createElement('input')
    metaName.setAttribute('type', 'text')
    metaName.setAttribute('name', 'meta-name')
    metaName.setAttribute('class', 'form-control')
    metaName.setAttribute('id', 'meta-name')
    metaName.setAttribute('placeholder', 'Meta Tag Name')
    
    metaContent = document.createElement('input')
    metaContent.setAttribute('type', 'text')
    metaContent.setAttribute('name', 'meta-content')
    metaContent.setAttribute('class', 'form-control')
    metaContent.setAttribute('id', 'meta-content')
    metaContent.setAttribute('placeholder', 'Meta Tag Content')
    
    appForm.appendChild(metaName)
    appForm.appendChild(metaContent)
    appForm.appendChild(appButton)
    appButton.setAttribute('value', 'Add Meta Tag');
    appButton.setAttribute('onClick', "addMeta()");
    appButton.setAttribute('class', 'btn btn-primary');
}

function addMeta() {
    var headContent = document.getElementById('head-content')
    var metaName = document.getElementById('meta-name').value
    var metaContent = document.getElementById('meta-content').value
    headContent.append(`< meta name="${metaName}" content="${metaContent}" >`)
}