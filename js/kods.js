let vardi =[["KALNS","KURPE","OZOLS","BUMBA","APLIS"],
            ["KAROTE","DATORS","PLAUKTS","ZAGLIS","PALAGS"],
            ["HANTELE","ATSPERE"],
            ["MONITORS","KAMIELIS","AISBERGS"],
            ["HAMELEONS","KROKODILS","PROCESORS"],
            ["LECAMAUKLA","KARTUPELIS"]];
let vards;
let laiks=30;
let dl=0;
let n;
let punkti=0;
let spele;

function sajaukt(vards){
    let burti=vards.split("");
    for(let i=0;i<vards.length;i++){
        let tmp=burti[i];
        let j=Math.floor(Math.random()*vards.length);
        burti[i]=burti[j];
        burti[j]=tmp;
    }
    return burti;
}
function irSalikts(){
    let pogas=document.getElementsByTagName("button");
    let objMas=[];
    for(let i=0;i<pogas.length;i++){
        let x=Number(pogas[i].style.left.slice(0,-2));
        let obj={"x":x,"b":pogas[i].innerHTML};
        console.log(obj.x+" "+obj.b);
        objMas.push(obj);
    }
    objMas.sort(function(a,b){return a.x-b.x;});
    let atbilde="";
    for(let i=0;i<objMas.length;i++) atbilde+=objMas[i].b;
    if (atbilde===vards) {
        punkti=punkti+n*(60-laiks);
        for(let i=0;i<pogas.length;i++) pogas[i].setAttribute("class","buttons blink-bg");
        document.getElementById("punkti").innerHTML="punkti = "+punkti;
        setTimeout(function(){ 
            for(let i=0;i<pogas.length;i++){
                pogas[i].setAttribute("class","buttons"); 
                pogas[i].setAttribute("disabled","true"); 
            }
            jaunsVards();
        }, 1000);
        
    }

}
function paradit(burti){
    if(document.getElementById("laukums")!==null) document.getElementById("laukums").remove();
    let rinda=document.createElement("div");
    rinda.setAttribute("id","laukums");
    for(let i=0;i<burti.length;i++){
      let poga = document.createElement("button");
      poga.setAttribute("class","buttons");
      poga.style.left = i*60 + "px";
      poga.innerHTML=burti[i];
      rinda.appendChild(poga);
      poga.onmousedown=function(event){

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
          }

          function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            poga.style.top = (poga.offsetTop - pos2) + "px";
            poga.style.left = (poga.offsetLeft - pos1) + "px";
          }

          function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            irSalikts();
          }    
          dragMouseDown(event);

      };
    }

    document.body.appendChild(rinda);
}
function rezultati(speletajs, punkti){
    let dict={punkti:punkti,vards:speletajs};
    console.log(JSON.stringify(dict));
    fetch('https://nitobenito.pythonanywhere.com/send', {
        method: 'POST',
       
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(dict)
    })
      .then(res => res.json())
      .then(data => document.getElementById("tabula").innerHTML = "Labākais rezultāts "+data[0].punkti+" punkti "+data[0].vards);
}
function skaitaLaiku(){
    laiks=laiks-dl;
    document.getElementById("laiks").innerHTML="laiks = "+laiks+" s";
    if(laiks===0)clearInterval(spele);
    if (laiks===0&& punkti>0){
        dl=0;
        let speletajs=prompt("Tu ieguvi "+punkti+" punktus! Ja vēlies saglabāt rezultātu, ievadi savu vārdu!");
        if(speletajs!==null)rezultati(speletajs, punkti);
        punkti=0;
        document.getElementById("punkti").innerHTML="punkti = 0";
     }
 }

function jaunsVards(){
    let r=n-5;
    let k=Math.floor(Math.random()*vardi[n-5].length);
    vards=vardi[r][k];
    let burti=sajaukt(vards);
    paradit(burti);
}
function sakums(nn){
    n=nn;
    laiks=30;
    dl=1;
    document.getElementById("laiks").innerHTML="laiks = "+laiks+" s";
    document.getElementById("punkti").innerHTML="";
    if(n<5 || n>10) {
        alert("Der skaitļi no 5 līdz 10");
        return;
    }
    jaunsVards();
    spele=setInterval(skaitaLaiku,1000);
 }



