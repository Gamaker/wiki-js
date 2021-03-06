//Defino funcion constructora wikiController para crear objeto y seleccionar los elementos
var WikiController = function(div, guardar, editar, wiki){


    var that = this;

    this.wiki = wiki;

    this.tapiz = document.getElementById(div);

    this.guardar = document.getElementById(guardar);

    this.editar = document.getElementById(editar);

    //metodo de insertar textarea en el tapiz para el modo edicion.
    //@id identificador de la wiki a editar (ya lo tenemos al crear el objeto).
    this.insertarTextarea = function(id){
        var textarea = document.createElement("textarea");
        textarea.id = "area1";
        textarea.rows = 20;
        textarea.cols = 100;
        //aplicarEstilos(textarea, estilos);

        //var div = document.getElementById(tapiz);
        //console.log(div);

        console.dir(that);
        that.tapiz.appendChild(textarea); //por que me da undefined con this ???
        // return ...el return ha de colocar el cursor en el textarea directamente e incluir en el textarea el contenido guardado.
    };

    //Metodo de guardar en JSON las cadenas de texto recogidas en el textarea.
    //@id identificador a guardar (ya lo tenemos al crear el objeto)
    this.recogerTextarea = function(id){
        var area = document.getElementById('area1');
        console.log(area);
        //var areaText = area.nodeValue; //da element input no el nodo de texto.
        //var childrenTextarea = area.childNodes; //da 0 nodos hijos??
        var text = new String(area.value); //variable de tipo string, nos interesa objeto ??

        //Pruebas de atributos de area
        var textString = area.value;
        console.log(textString);
        console.log(text);

        var boton = document.getElementById(guardar);
        console.log(boton);

        that.wiki.splitSections(text);

        console.log(that);

        //console.log(sections);
        //return el return ha de llamar a convertirTextarea para guardarla en formato convertido
    };

    //Metodo para recoger datos de la wiki
    //@id identificador de la wiki de la que hay que recoger los datos.
    this.recogerWiki = function(id){};


    return this; // da igual que lo ponga que no ???
}

//Defino el ojeto Wiki que puede ser usado como mixing o crearse objetos con el.
// Está pensado para ser usado en objetos con las propiedades wiki, tapiz, guardar y editar (controller)
//@id id de la wiki.
//@styles estilos de la wiki
//@sitax sintasis de la wiki
var Wiki = function(id, div, guardar, editar){

    var that = this;

    this.sections = {};

    this.id = id;

    this.styles = {
        'width': '100%',
        'height': '400px',
        'border': '1px solid blue'
    };

    //Array con sintaxis de la Wiki para comparar con los strings recogidos del textarea
    this.sintax = [
        sections = "=",
        articles = "-",
        divs     = "#",
        black     = "*",
        linksInit = "[",
        linksFin = "]",
        linksToInit  = "(",
        linksToFin   = ""
    ];

    //Metodo que convertirá el textarea y compara los simbolos de la sintaxis de la wiki para formatear la vista de la wiki.
    this.splitSections = function(cadena){
        var arraySections = new Array();
        var count = 0;
        var lastCount;

        //sustituyo los saltos de linea por el simnbolo ¬
        //(parace que el parser de JS no lo guarda y después no dispongo de esos saltos en el string)
        var string = cadena.replace(new RegExp("\n", "g"), "¬");

        //Recorro el string para detectar las secciones
        for (var i = 0; i< string.length; i++) {
            var t = i + 2;

            //Cuando tengo 3 = seguidos, estoy en una section...
            if(string[i] == "=" && string[i++] == "=" && string[t] == "="){
                lastCount = count;
                count = count+1;

                //Creo un objeto en el array, en el indice numerico en el que estoy
                arraySections[count] = {};
                //El id será igual al inidice del array
                arraySections[count].id = count;
                //El inicio del título de la section es en el que estoy ahora mismo.
                arraySections[count].startHeader = i;

                //Si he detectado otra seccion, como no es la ultima le establezco el fin de la anterior
                if(count > 1){
                    arraySections[lastCount].fin = i -1;
                }

                console.log(i);
                //Localizo el salto de líne posterior al lugar en el que estoy.
                var nextSalto = string.indexOf("¬",i);

                console.log(nextSalto);

                //Guardo el header en el objeto de section
                arraySections[count].header = string.substring(i+3, nextSalto);

                arraySections[count].startSection = nextSalto+1;

                //Guardo en cada objeto section la cadena restante en bruto y sin título
                if(count > 1){
                    arraySections[lastCount].section = string.substring(arraySections[lastCount].startSection, arraySections[lastCount].fin );
                    console.log(arraySections[lastCount].section);
                }

                //console.log(arraySections[lastCount].section);

            }
        }

        // Y cuando salgo del for le agrego al ultimo objeto su fin que sera el fin del String
        arraySections[count].fin = string.length;

        //cuando sale del for también aprobecho para guardar el último section
        arraySections[count].section = string.substring(arraySections[count].startSection, arraySections[count].fin);

        console.log(arraySections);
        //var strings = string.split(caracter);
        that.sections = arraySections;
    };

    //Metodo que aplica una lista de estilos a un elemento.
    //@element elemento a aplicar los estilos
    //@listaEstilos estilos a aplicar al elemento.
    this.aplicarEstilos = function (elemento, listaEstilos){
        for (var estilo in listaEstilos ){
            elemento.style[estilo] = listaEstilos[estilo];
        }
    };

    return this;

};

//WikiController.prototype = new Wiki();
//WikiController.apply(Wiki.prototype);

var wiki = new Wiki(1);
var wikiCtl = new WikiController( "tapiz", "guardar", "editar", wiki);

window.onload = console.log(wikiCtl);
editar.onclick = wikiCtl.insertarTextarea;
guardar.onclick = wikiCtl.recogerTextarea;
