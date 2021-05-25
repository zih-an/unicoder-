/*
function getunicode() {
    let input = document.getElementById("input-code");
    return input.value;
}

function SelectToDisplay() {
    let unicode = getunicode();
    let space = document.getElementById("u-dis");
    space.innerHTML = "&#"+unicode+";";

}

function AppendToDisplay() {
    let unicode = getunicode();
    let space = document.getElementById("u-dis");
    space.innerHTML += "&#"+unicode+";";
}


function CreateTableView() {
    $.getJSON("UCD-buildTable/ucd-table.json", function(json) {
        
        tableNode = document.getElementById("table-data");
        let trNode;
        for(let i=0; i<json.length; i++)
        {
            console.log(i);
            if(i%20==0)
                trNode = tableNode.insertRow();
            let tdNode = trNode.insertCell();
            let span = tdNode.appendChild(document.createElement("span"));
            span.innerHTML = "&#"+json[i].dc+";";
        }
    });
}

CreateTableView();
*/

let Jsons = [];
let cnt = 0;
$.getJSON("UCD-buildTable/ucd-table.json", function(json) {
    Jsons.push(json);
    const categories = [ "ALL", "LEFT", "RIGHT", "DOWN", "UP", "MIDDLE", "OTHER" ];
    tableElementClassWrapper = document.getElementById("tableElementBtns-wrapper");
    for(let i=0; i<categories.length; i++) {
        let btn = document.createElement("input");
        btn.type = "button";
        btn.id = "eleClassBtn-" + categories[i];
        btn.className = "eleClassBtn";
        btn.value = categories[i];
        btn.onclick = function(){
            ClearTableElements();
            DisplayTableElements(Jsons[0]);
        };
        tableElementClassWrapper.appendChild(btn);
    }
    CreateTrashBtn();
    //DisplayTableElements(json);
    // CreateDisplayTable(10,10);
});

function CreateTrashBtn() {
    let talbeElementCreateWrapper = document.querySelector("#CreateArea-wrapper");
    let btnTrash = document.createElement("div");
    btnTrash.innerHTML = "TRASH";
    btnTrash.id = "TrashPlc";
    btnTrash.addEventListener("dragover", e => {
        e.preventDefault();
        btnTrash.style.backgroundColor = "#b30000";
    });
    btnTrash.addEventListener("drop", () => {
        btnTrash.style.backgroundColor = "cornflowerblue";
        const draggble = document.querySelector(".created-dragging");
        console.log(draggble.class);
        btnTrash.appendChild(draggble);
        draggble.remove();
    });
    talbeElementCreateWrapper.appendChild(btnTrash);
}


function ClearTableElements() {
    let tableNode = document.getElementById("DisplayPreviewElement");
    if(tableNode!==null) tableNode.remove();
}
function DisplayTableElements(json) {
    let tableNode = document.createElement("table");
    tableNode.id = "DisplayPreviewElement";
    let trNode;
    for(let i=0; i<json.length; i++) {
        if(i%2==0)
            trNode = tableNode.insertRow();
        let tdNode = trNode.insertCell();
        let span = tdNode.appendChild(document.createElement("span"));
        span.className = "draggable-elements";
        span.id = "&#" + json[i].dc + ";";
        span.draggable = true;
        span.innerHTML = "&#"+json[i].dc+";";
        span.addEventListener('dragstart', e => { 
            span.classList.add("dragging");
            span.addEventListener('dragend', () => { span.classList.remove("dragging"); });
        });
    }
    let tableElementDisplayWrapper = document.getElementById("tableElementDisplay-wrapper");
    tableElementDisplayWrapper.appendChild(tableNode);
}


function CreateTable() {
    let row = parseInt(document.querySelector("#tbl-row").value);
    let col = parseInt(document.querySelector("#tbl-col").value);
    CreateDisplayTable(row,col);
}
function CreateDisplayTable(row, column) {
    let elementsCreated = document.createElement("table");
    elementsCreated.id = "elementsCreated";
    for(let i=0; i<row; i++) {
        let trNode = elementsCreated.insertRow();
        for(let j=0; j<column; j++) {
            let tdNode = trNode.insertCell();
            tdNode.addEventListener("dragover", e => {
                e.preventDefault();  // can activate drop??? -why?
                //const draggble = document.querySelector(".dragging");
                //tdNode.appendChild(draggble);
            });
            tdNode.addEventListener("drop", () => {
                const nodeCopy = document.querySelector(".dragging").cloneNode(true);
                nodeCopy.classList.remove("dragging");
                nodeCopy.classList.add("created-draggableElements");
                nodeCopy.id = "cr-" + nodeCopy.id + `${cnt++}`;
                // ---- why need to add listener again  ----?
                nodeCopy.addEventListener('dragstart', e => { 
                    nodeCopy.classList.add("created-dragging");
                    nodeCopy.addEventListener('dragend', () => { nodeCopy.classList.remove("created-dragging"); });
                });
                tdNode.appendChild(nodeCopy);
            });
        }
    }
    let talbeElementCreateWrapper = document.getElementById("talbeElementCreate-wrapper");
    talbeElementCreateWrapper.innerHTML = "";
    talbeElementCreateWrapper.appendChild(elementsCreated);
}


function Copy() {
    var inp =document.createElement('textarea');
    document.body.appendChild(inp);
    let PreviewSpan = document.querySelector("#resPreview");
    inp.value = PreviewSpan.textContent;
    inp.select();
    document.execCommand("copy", false);
    inp.remove();
}

function Preview() {
    let elementsCreated = document.querySelector("#elementsCreated");
    if(elementsCreated === null) 
        return;
    let fnlStr = "";
    for(let row of elementsCreated.rows) {
        for(let cell of row.cells) {
            //console.log(cell);
            let spans = cell.querySelectorAll(".created-draggableElements");
            if(!spans.length) {
                fnlStr += "  ";  // 2 whitespaces
                continue;
            }
            spans.forEach( span => {
                let id = span.id.split("-")[1].split(";")[0]; //format: &#...
                //let uniHexStr = id.toString(16);
                //let unicode = parseInt(uniHexStr, 16);
                fnlStr += id + ";";
                //console.log(id);
            });
        }
        fnlStr += "\n";   // newline
    }
    console.log(fnlStr);

    let resPreview = document.querySelector("#resPreview");
    resPreview.innerHTML = fnlStr;
}