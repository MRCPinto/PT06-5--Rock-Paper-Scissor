var dndSupported;    // verdade se o arrastar e o soltar são suportados
var dndEls = new Array();
var draggingElement; // variável para arrastar as imagens
var winners = { //  
    Rock: 'Paper',
    Paper: 'Scissors',
    Scissors: 'Rock'
};

var hoverBorderStyle = '2px dashed #999';
var normalBorderStyle = '2px solid white';

function detectDragAndDrop() {
    if (navigator.appName == 'Microsoft Internet Explorer') { // se o navegador detetado for o Microsoft Internet Explorer,
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            var rv = parseFloat( RegExp.$1 );
            if(rv >= 6.0) return true;
            }
        return false;
    }
    if ('draggable' in document.createElement('span')) return true;
    return false;
}

// DnD support

function handleDragStart(e) {
    var rpsType = getRPSType(this);
    draggingElement = this;
    draggingElement.className = 'moving';
    statusMessage('Drag ' + rpsType);
    this.style.opacity = '0.4';
    this.style.border = hoverBorderStyle;
    e.dataTransfer.setDragImage(getRPSImg(this), 120, 120); // colocar a imagem a ser arrastada

}

function handleDragEnd(e) {
    this.style.opacity = '1.0';

    // recompor o estilo dos elementos
    draggingElement.className = undefined;
    draggingElement = undefined;

    // recompor todos os elementos
    for(var i = 0; i < dndEls.length; i++) {
        dndEls[i].style.border = normalBorderStyle;
    }
}

function handleDragOver(e) {
    if(e.preventDefault) e.preventDefault();
    this.style.border = hoverBorderStyle;

    return false;   // alguns browsers podem precisar disto para prevenir uma ação padrão
}

function handleDragEnter(e) {
    if(this !== draggingElement) statusMessage('Hover ' + getRPSType(draggingElement)    + ' over ' + getRPSType(this));
    this.style.border = hoverBorderStyle;
}

function handleDragLeave(e) {
    this.style.border = normalBorderStyle;
}

function handleDrop(e) {
    if(e.stopPropegation) e.stopPropagation(); // impede alguns browsers de redirecionar
    if(e.preventDefault) e.preventDefault();
    if(this.id === draggingElement.id) return;
    else isWinner(this, draggingElement);
}

// funções utilitárias
function isWinner(under, over) {
    var underType = getRPSType(under);
    var overType = getRPSType(over);
    if(overType == winners[underType]) {
        statusMessage(overType + ' beats ' + underType);
        swapRPS(under, over);
    } else {
        statusMessage(overType + ' does not beat ' + underType);
    }
}

function getRPSFooter(e) {
    var children = e.childNodes;
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'footer' ) return children[i];
    }
    return undefined;
}

function getRPSImg(e) {
    var children = e.childNodes;
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'img' ) return children[i];
    }
    return undefined;
}

function getRPSType(e) {
    var footer = getRPSFooter(e);
    if(footer) return footer.innerHTML;
    else return undefined;
}

function swapRPS(a, b) {
    var holding = Object();

    holding.img = getRPSImg(a);
    holding.src = holding.img.src;
    holding.footer = getRPSFooter(a);
    holding.type = holding.footer.innerHTML;
    
    holding.img.src = getRPSImg(b).src;
    holding.footer.innerHTML = getRPSType(b);

    getRPSImg(b).src = holding.src;
    getRPSFooter(b).innerHTML = holding.type;
}

// funções utilitárias

var elStatus;
function element(id) { return document.getElementById(id); }

function statusMessage(s) {
    if(!elStatus) elStatus = element('statusMessage');
    if(!elStatus) return;
    if(s) elStatus.innerHTML = s;
    else elStatus.innerHTML = '&nbsp;';
}

// aplicação de suporte do tempo de vida

function init() {
    if((dndSupported = detectDragAndDrop())) {
        statusMessage('Using HTML5 Drag and Drop');
        dndEls.push(element('rps1'), element('rps2'), element('rps3'));
        for(var i = 0; i < dndEls.length; i++) {
            dndEls[i].addEventListener('dragstart', handleDragStart, false);
            dndEls[i].addEventListener('dragend', handleDragEnd, false);
            dndEls[i].addEventListener('dragover', handleDragOver, false);
            dndEls[i].addEventListener('dragenter', handleDragEnter, false);
            dndEls[i].addEventListener('dragleave', handleDragLeave, false);
            dndEls[i].addEventListener('drop', handleDrop, false);
        }
    } else {
        statusMessage('This browser does not support Drag and Drop');
    }
}

window.onload = init;