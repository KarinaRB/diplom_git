<template>
    <div id="content">

        <span class="rowElem">
            <span class="rowElemChild">
                <h3>Правила</h3>
                <div id="rules" v-for="(el, index) in rules" :key="index">
                    {{ index }}) {{ el }}
                </div>
            </span>
            <span class="rowElemChild">
                <span>
                    <h3>Терминальные символы</h3>
                    <div id="term" v-for="(el, index) in terms" :key="index">
                        {{ index }}) {{ el }}
                    </div>
                </span>
                <span>
                    <h3>Нетерминальные символы</h3>
                    <div id="nterm" v-for="(el, index) in nterms" :key="index">
                        {{ index }}) {{ el }}
                    </div>
                </span>  
            </span>
        </span>

        <span class="rowElem">
            <span class="rowElemChild">
                <h3>Множество FIRST</h3>
                <div id="first" v-for="(el, index) in firsts" :key="index">
                        {{ index }}) {{ el }}
                </div>
            </span>
            <span class="rowElemChild">
                <h3>Множество FOLLOW</h3>
                <div id="follow" v-for="(el, index) in follows" :key="index">
                        {{ index }}) {{ el }}
                </div>
            </span>
        </span>

        <form @submit="readWord">
            <input type="text" name="word" placeholder="Слово" required v-model="word" class="form-control mt-2">
            <input type="submit" value="Построить" class="btn btn-outline-light w-25 mt-2">
        </form>

        <div id="error" v-if="word_error">
            {{ word_error_type }}
        </div>

        <span class="treeContent">
            <div id="mainTable" v-show="addWord">
                <div class="child">
                    <div>Номер шага</div>
                    <div v-for="(w, index) in wordIteration" :key="index">
                        {{ index }}
                    </div>
                </div>
                <div class="child">
                    <div>Слово</div>
                    <div v-for="(w, index) in wordIteration" :key="index">
                       <span class="shadeWord"> {{ wordIteration2[index] }}</span> {{ w }} 
                    </div>
                </div>
                <div class="child">
                    <div>магазин</div>
                    <div v-for="(w, index) in shopIteraion" :key="index">
                        {{ w }} 
                    </div>
                </div>   
                <div class="child">
                    <div>Правило</div>
                    <div v-for="(w, index) in parsingIteration" :key="index">
                        {{ w }} 
                    </div>
                </div>  
                <div class="child">
                    <div>Запись таблицы</div>
                    <div v-for="(w, index) in tableIteration" :key="index">
                        {{ w }} 
                    </div>
                </div>
            </div>

            <div id="show" v-show="showTreeStep">
                <div class="childSmall">
                    <div>Номер шага</div>
                    <div v-for="(w, index) in wordIteration" :key="index">
                        <!-- <button @click="showStep( index )" class="butn"> {{ index }}</button> -->
                        <div @click="showStep( index )" class="btn"> {{ index }} </div>
                    </div>
                </div>
                <div id="treeSteps" ></div>
            </div>

            <input v-show="addWord && !word_error" @click="switchMode()" type="submit" value="Отобразить шаги построения дерева" class="btn btn-outline-light w-50 mt-2">
            <input v-show="showTreeStep && !word_error" @click="switchMode()" type="submit" value="Отобразить таблицу разбора слова" class="btn btn-outline-light w-50 mt-2">

        </span>

        <div id="tree"></div>


    </div>
</template>

<script>
    import http from "../../http-common";
    import $ from "jquery";
    import * as d3 from 'd3';

    export default{
        name: "AddRule",
        props: ['id'], // входные параметры
        data(){
            return{
                rule: {
                    user_id : "",
                    name : "",
                    grammar : "",
                    startSymbol : "",
                    endSymbol : ""
                },
                rules : [],
                nterms : [],
                terms : [],
                firsts : [],
                follows : [],
                message : "",
                submitted : false,
                //множество терминальных символов
                term : new Set(),
                //множество нетерминальных символов
                nterm : new Set(),
                //мэп правил
                mapOfRules : new Map(),
                //мэп множества FIRST
                mapFirst : new Map(),
                //мэп множества FOLLOW
                mapFollow : new Map(),
                //таблица M
                MTable : new Map(),
                //допуск
                allowanceTerm : '#',
                //цепочка для вывода
                word : "",
                //Данные для отрисовки дерева
                treeData: "name,child,parent,value",
                step : "",
                shopIteraion : [],
                wordIteration: [],
                wordIteration2 : [],
                parsingIteration : [],
                tableIteration : [],
                addWord : false,
                showTreeStep : false,
                word_error : false,
                word_error_type : "",
            };
        },
        computed: {
            currentUser(){
                return this.$store.state.auth.user;
            }
        },
        methods:{
            getRule() {
                http
                    .get("/rule/" + this.id) // обращаемся к серверу для получения списка пользователей, id взят из входных параметров (props)
                    .then(response => { // запрос выполнен успешно
                        //console.log(response);
                        this.rule = response.data;
                        this.readRules(this.rule.grammar.split('\n'));
                        this.firstSet();
                        this.followSet();
                        this.getTable(this.rule.grammar.split('\n'));
                    })
                    .catch(e => { // запрос выполнен с ошибкой
                        console.log(e);
                    });
            },
            switchMode(){
                if(this.addWord){
                    this.addWord = false;
                    this.showTreeStep = true;
                }else{
                    this.addWord = true;
                    this.showTreeStep = false;
                }
            },
            readRules(rules){
                //пробегаемся по правилам и считываем всю информацию
                rules.forEach(element => {
                    //вывод правила
                    this.rules.push(element);

                    //первый символ - нетерминал, который является ключом mapOfRules
                    this.nterm.add(element[0]);
                    var kmap = element[0];

                    //добавляем запись в mapOfRules
                    if(!this.mapOfRules.has(kmap)){
                        this.mapOfRules.set(kmap, new Map([[0, element.slice(4)]]));
                    }else{
                        var num = this.mapOfRules.get(kmap).size;
                        this.mapOfRules.get(kmap).set(num, element.slice(4));
                    }

                    //определяем классы терминальных и не терминальных символов
                    for(var i=4; i<element.length; i++){
                        if(element[i].charCodeAt(0) > 64 && element[i].charCodeAt(0) <= 90){
                            this.nterm.add(element[i]);
                        }else if(element[i].charCodeAt(0)){
                            this.term.add(element[i]);
                        }
                    }
                });
                
                //вывод терминальных символов
                this.term.forEach(element => {
                    this.terms.push(element);
                });
                
                //вывод нетерминальных символов
                this.nterm.forEach(element => {
                    this.nterms.push(element)
                });

                console.log("term elements : ", this.term);
                console.log("nterm elements : ", this.nterm);
                console.log("map of rules : ", this.mapOfRules);
            },
            firstSet(){
                this.nterm.forEach(element => {
                    this.mapFirst.set(element, this.first(element, 'x'));
                });

                console.log("map FIRST : ", this.mapFirst);

                for(var elem of this.mapFirst.keys()){
                    var str = elem + " : ";
                    this.mapFirst.get(elem).forEach(val => {
                        str += val + " ";
                    });
                    this.firsts.push(str);
                }
            },
            first(Nterm, mainElement){
                //множество FIRST элементов
                var firstElements = new Set();
                this.mapOfRules.get(Nterm).forEach(elem =>{
                    //если правая часть терминал, то просто добавляем его
                    if(this.term.has(elem[0])){
                        firstElements.add(elem[0]);
                    }else{
                        for(var i=0; i<elem.length; i++){
                            var res = new Set();
                            //если есть уже запись этого нетерминала в FIRST
                            if(this.mapFirst.has(elem[i])){
                                res = this.mapFirst.get(elem[i]);
                            }
                            //если нет такой записи, то запускаем рекурсию
                            else if(elem[i] != Nterm && elem[i] != mainElement && this.nterm.has(elem[i])){
                                res = this.first(elem[0], Nterm);
                            }
                            //иначе выходим из цикла
                            else{
                                break;
                            }
                            //проверяем наличие конечного символа
                            if(res.has(this.rule.endSymbol)){
                                res.forEach(e =>{
                                    if(e != this.rule.endSymbol){
                                        firstElements.add(e);
                                    }
                                });
                            }else{
                                res.forEach(e =>{
                                    firstElements.add(e);
                                });
                                break;
                            }
                        }
                    }
                });
                return firstElements;
            },
            followSet(){
                this.nterm.forEach(element => {
                    if(element == this.rule.startSymbol){
                        this.mapFollow.set(element, this.follow(element).add(this.rule.endSymbol));
                    }else{
                        this.mapFollow.set(element, this.follow(element));
                    }
                });
                console.log("map FOLLOW : ", this.mapFollow);

                for(var elem of this.mapFollow.keys()){
                    var str = elem + " : ";
                    this.mapFollow.get(elem).forEach(val => {
                        str += val + " ";
                    });
                    this.follows.push(str);
                }
            },
            follow(Nterm){
                var followElements = new Set();
                //пробегаемся по всем правым частям и ищем Nterm
                for(var [key, value] of this.mapOfRules){
                    for(var [k, v] of value){
                        k;
                        //если нашли правило с Nterm в правой части
                        var n = 0;
                        while(v.indexOf(Nterm, n) != -1){
                            var pos = v.indexOf(Nterm, n);
                            n = pos+1;
                            if(pos != -1){
                                //если Nterm не на последней позиции
                                if(pos < v.length-1){
                                    var res = new Set();
                                    var flag = false;
                                    for(var i=pos+1; i<v.length; i++){
                                        //если справа терминальный символ
                                        if(this.term.has(v[i])){
                                            res.add(v[i]);
                                        }
                                        //если справа нетерминал
                                        else{
                                            //получаем FIRST от элемента справа
                                            res = this.mapFirst.get(v[i]);
                                        }
                                        //если есть конечный элемент
                                        if(res.has(this.rule.endSymbol)){
                                            res.forEach(e =>{
                                                if(e != this.rule.endSymbol){
                                                    followElements.add(e);
                                                }
                                            });
                                        }else{
                                            res.forEach(e =>{
                                                followElements.add(e);
                                            });
                                            flag = true;
                                            break;
                                        }
                                    }
                                    //если все элементы правее имеют конечный символ
                                    if(!flag && key!=Nterm){
                                        if(this.mapFollow.has(key)){
                                            res = this.mapFollow.get(key);
                                            res.forEach(e=>{
                                                followElements.add(e);
                                            });
                                        }else{
                                            this.follow(key).forEach(e=>{
                                                followElements.add(e);
                                            });
                                        }
                                    }
                                //если Nterm на последней позиции    
                                }else if(key != Nterm){
                                    if(this.mapFollow.has(key)){
                                        res = this.mapFollow.get(key);
                                        res.forEach(e=>{
                                            followElements.add(e);
                                        });
                                    }else{
                                        this.follow(key).forEach(e=>{
                                            followElements.add(e);
                                        });
                                    }
                                }
                            }

                        }
                    }
                }
                return followElements;
            },
            getFirstOfRule(elem){
                var res = new Set();
                if(this.term.has(elem[0])){
                    res.add(elem[0]);
                }else{
                    this.mapFirst.get(elem[0]).forEach(el=>{
                        res.add(el);
                    });
                }
                return res;
            },
            getTable(rules){
                var i = 1;
                rules.forEach(element=>{
                    var elements;
                    //если не конечный элемент
                    if(element[4] != this.rule.endSymbol){
                        elements = this.getFirstOfRule(element.slice(4));
                    }
                    //если конечный элемент
                    else{
                        elements = this.mapFollow.get(element[0]);
                    }
                    elements.forEach(el=>{
                        //насколько это адекватное решение?
                        //this.MTable.set([element[0], el], [element.slice(4), i]);
                        this.MTable.set(element[0] + el, [element.slice(4), i]);
                    });
                    i++;
                });
                //выброс
                this.term.forEach(elem=>{
                    if(elem != this.rule.endSymbol) {
                        // this.MTable.set([elem, elem], ["blowout", 0]);
                        this.MTable.set(elem+elem, ["blowout", 0]);
                    }
                });
                //допуск
                //this.MTable.set([this.rule.endSymbol, this.rule.endSymbol], ["allowance", 0]);
                this.MTable.set(this.rule.endSymbol+this.rule.endSymbol, ["allowance", 0]);
                console.log("map Table : ", this.MTable);
                
            },
            readWord(e){
                $('#tree').empty();
                $('#treeSteps').empty();
                this.word_error = false;
                this.showTreeStep = false;
                this.addWord = true;
                this.shopIteraion = [];
                this.wordIteration = [];
                this.wordIteration2 = [];
                this.parsingIteration = [];
                this.tableIteration = [];
                this.treeData = "name,child,parent,value";
                var step = 0;
                // for(i=0; i<this.word.length; i++){
                //     if (!this.terms.includes(this.word[i])){
                //         this.word_error = true;
                //         this.word_error_type = "В слове есть символы, не принадлежащие грамматике";
                //         this.addWord = false;
                //         this.showStep = false;
                //         break;
                //     }
                // }
                e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
                //переменная слова
                var word = this.word;
                var word2 = "";
                //переменная магазина
                var shop = this.rule.startSymbol + this.rule.endSymbol;
                //Строка разбора слова
                var parsingString = " ";
                var tableRule = "M(" + shop[0] + ", " + word[0] + ") = (" +  this.MTable.get(shop[0]+word[0]) + ")";
                this.shopIteraion.push(shop);
                this.wordIteration.push(word);
                this.wordIteration2.push(word2);
                this.parsingIteration.push(parsingString);
                this.tableIteration.push(tableRule);
                //строка данных для построения дерева
                var i = 1;
                var stack = [1];
                this.treeData += "\n" + this.rule.startSymbol + "," + i++ + ",,"+ step++ +"\n";
                //цикл для просчёта порядка правил
                while (shop[0] + word[0] != this.rule.endSymbol + this.rule.endSymbol && !this.word_error){
                    if(!this.MTable.has(shop[0]+word[0])){
                        if(!this.terms.includes(word[0])){
                            this.word_error_type = "В слове есть символы, не принадлежащие грамматике : " + word[0];
                        }else if(word == this.rule.endSymbol && shop.length>1){
                            this.word_error_type = "Неожиданный конец ввода";
                        }else if(shop == this.rule.endSymbol && word != this.rule.endSymbol){
                            this.word_error_type = "неожиданные символы в конце";
                        }else{
                            this.word_error_type = "Нет записи в таблице разбора";
                        }
                        console.log(step, shop[0] + word[0]);
                        this.word_error = true;
                        break;
                    }
                    var res = this.MTable.get(shop[0]+word[0]);
                    var par = stack[0];
                    stack.shift();
                    if(res[0] == "blowout"){
                        word2 += word[0];
                        word = word.slice(1, word.length);
                        shop = shop.slice(1, shop.length);
                    }
                    else if(res[0] == this.rule.endSymbol){
                        shop = shop.slice(1, shop.length);
                        parsingString += res[1];
                        this.treeData += this.rule.endSymbol + "," + i++ + "," + par + "," + step++ + "\n";
                    }else{
                        shop = res[0] + shop.slice(1, shop.length);
                        parsingString += res[1];
                        for(var j=res[0].length+i-1; j>=i; j--){
                            stack.unshift(j);
                        }
                        for(j=0; j<res[0].length; j++){
                            this.treeData += res[0][j] + "," + i++ + "," + par + "," + step + "\n";
                        }
                        step++;
                    }
                    if(word.length == 0){
                        word = this.rule.endSymbol;
                    }
                    tableRule = "M(" + shop[0] + ", " + word[0] + ") = (" +  this.MTable.get(shop[0]+word[0]) + ")";
                    this.shopIteraion.push(shop);
                    if (word.length == 1 && word[0] == this.rule.endSymbol){
                        this.wordIteration.push(" ")
                    }else {
                        this.wordIteration.push(word);
                    }
                    this.wordIteration2.push(word2);
                    this.parsingIteration.push(parsingString);
                    this.tableIteration.push(tableRule);    
                }

                if(!this.word_error){
                    //Установка отступов, ширины и высоты окна 
                    var margin = {top: 20, right : 70 , bottom : 20, left : 70};
                    var width = $(window).width() - margin.right - margin.left;
                    var height = $(window).height() - margin.top - margin.bottom;
                    var height2 = $(window).height()/2 - margin.top - margin.bottom;

                    //создание svg элемента (интерактивное дерево)
                    var svg = d3.select("#tree").append("svg")
                        .attr("width", width + margin.right + margin.left) //ширина
                        .attr("height", height + margin.top + margin.bottom) //высота
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")  //перемещение поля
                        .append("g"); //эллемент для группировки

                    //создание svg элемента (демонстрационное дерево)
                    var svg2 = d3.select("#treeSteps").append("svg")
                        .attr("width", width/2 + margin.right/2 + margin.left/2) //ширина
                        .attr("height", height*0.7 + margin.top + margin.bottom) //высота
                        .attr("transform", "translate(" + margin.left + "," + 0 + ")")  //перемещение поля
                        .append("g"); //эллемент для группировки
                    
                    i = 0;
                    height2;
                    //продолжительность 
                    var duration = 550;
                    //d3.tree() - создаёт новый древовидный макет с настройками по умолчанию
                    var tree = d3.tree().size([width, height]);
                    var tree2 = d3.tree().size([width/2, height]);
                    //Диагонали будeт выступать в качестве соединительной линии между узлами
                    var diagonal = d3.linkHorizontal().x(d => d.x).y(d => d.y);
                    var diagonal2 = d3.linkHorizontal().x(d => d.x).y(d => d.y);
                    //Преобразование данных дерева к иерархии
                    var links = d3.csvParse(this.treeData);
                    // console.log("Данные иерархии", links);
                    var childColumn = links.columns[1];
                    var parentColumn = links.columns[2];
                    var stratify = d3.stratify()
                        .id(d => d[childColumn])
                        .parentId(d => d[parentColumn]);
                    var root = stratify(links);
                    var root2 = stratify(links);
                    //Корневые точки x и y дерева
                    root.x0 = width/2;
                    root.y0 = 0;
                    //Корневые точки x и y дерева
                    root2.x0 = width/4;
                    root2.y0 = 0;

                    update2(root2);

                    // node.descendants() - Возвращает массив узлов-предков, начиная с этого узла, затем следует каждый родительский узел вплоть до корня.
                    //Каждый дочерний узел больше не имеет дочернего атрибута, дерево больше не включает видимые узлы в результате вызова функции.
                    root.descendants().forEach((d, i) => {
                        d.id = i;
                        d._children = d.children;
                        if (d.depth && d.data.name.length !== 9) d.children = null;
                    });

                    update(root);
                }

                function update2(source){
                    //Вычисляем новый макет дерева
                    var treeData = tree2(source);
                    //узлы
                    var nodes = treeData.descendants().reverse();
                    //соединения узлов
                    var links = treeData.links(nodes);

                    //проходимся по узлам и устанавливаем им параметр y (для нормального отображения)
                    //сделать расчёт глубины автоматически
                    nodes.forEach(function(d){
                        d.y = (height*0.05 + d.depth * height*0.7/(treeData.height))*0.7;
                    });

                    //Обновление узлов (установка идентификаторов)
                    var node = svg2.selectAll("g.node").data(nodes, d => d.id);

                    var nodeEnter = node.enter().append('g')
                        .attr("value", function(d){return d.data.value;})
                        .attr("class", "node")
                        .attr("transform", function(d){ d; return "translate(" + d.x + ", " + d.y + ")";})

                    nodeEnter.append("circle") // добавляем круг
                        .attr("r", 5) //радиус
                        .attr("class", "node")
                        .style("fill", "black");
                    
                    nodeEnter.append("text") //Добавление текста
                        .attr("dy", "0.31em")
                        .attr("x", d => d._children ? -10 : 10)//расположение текста в зависимости от листа
                        .attr("text-anchor", d => d._children ? "end" : "start")
                        .text(d => d.data.name)
                        .clone(true).lower()
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-width", 3)
                        .attr("stroke", "white");

                    // Declare the linksâ€¦
                    var link = svg2.selectAll("path.link")
                        .data(links, function(d) { return d.target.id; });

                    // Enter the links.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("d", diagonal2);
                }

                function update(source){
                    //Вычисляем новый макет дерева
                    var treeData = tree(root);
                    //узлы
                    var nodes = treeData.descendants().reverse();
                    //соединения узлов
                    var links = treeData.links(nodes);

                    //проходимся по узлам и устанавливаем им параметр y (для нормального отображения)
                    //сделать расчёт глубины автоматически
                    nodes.forEach(function(d){
                        d.y = (height*0.05 + d.depth * height/(treeData.height))*0.7;
                    });

                    //Обновление узлов (установка идентификаторов)
                    var node = svg.selectAll("g.node").data(nodes, d => d.id);
    
                    var nodeEnter = node.enter().append('g')
                        // .attr("value", function(d){return d.data.value;})
                        .attr("class", "node")
                        .attr("transform", function(d){ d; return "translate(" + source.x0 + ", " + source.y0 + ")";}) // перемещение от точки родителя
                        .on("click", click); // добавляем функцию клика

                    nodeEnter.append("circle") // добавляем круг
                        .attr("r", 5) //радиус
                        .attr("class", "node")
                        .style("fill", function(d){ return d._children ? "red" : "black";}); //если есть дети, то красный, иначе черный
                    
                    nodeEnter.append("text") //Добавление текста
                        .attr("dy", "0.31em")
                        .attr("x", d => d._children ? -10 : 10)//расположение текста в зависимости от листа
                        .attr("text-anchor", d => d._children ? "end" : "start")
                        .text(d => d.data.name)
                        .clone(true).lower()
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-width", 3)
                        .attr("stroke", "white");

                    //Перевод узлов в их новые позиции
                    var nodeUpdate = nodeEnter.merge(node).transition()
                        .duration(duration)
                        .attr("transform", function(d){return "translate(" + d.x + ", "+ d.y + ")";});
                    
                    nodeUpdate.select("circle.node")
                        .attr("r", 5)
                        .style("fill", function(d){return d._children ? "red" : "black";})
                        .attr("cursor", "pointer"); //указатель мыши при наведении курсора

                    //уход точек в "Родителя"
                    var nodeExit = node.exit().transition().duration(duration);

                    nodeExit
                        .attr("transform", function(d){d; return "translate(" + source.x + ", "+ source.y + ")";})
                        .remove();

                    //Обновление ссылок
                    var link = svg.selectAll("path.link").data(links, d => d.target.id);


                    var linkEnter = link.enter()
                        .insert("path", "g")
                        .attr("class", "link")
                        .attr("d", function (d) {d;
                            var o = { x: source.x0, y: source.y };
                            return diagonal({source: o, target: o});
                        });

                    var linkUpdate = linkEnter.merge(link);

                    linkUpdate.transition()
                        .duration(duration)
                        .attr("d", diagonal);
                
                    var linkExit = link.exit()
                        .transition()
                        .duration(duration);
                    linkExit.attr("d", function (d) {d;
                            var o = { x: source.x0, y: source.y0 };
                            return diagonal({source: o, target: o});
                        })
                        .remove();

                    //Сохранить старые позиции для переходов обратно (если хотим свернуть наш граф)
                    nodes.forEach(function(d){
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });

                    //перебирает все элементы и проверяет, есть ли дочерние
                    function click(event, d){
                        //если есть дочерние элементы
                        if(d.children){
                            d._children = d.children;
                            d.children = null;
                        }else{
                            d.children = d._children;
                            d._children = null;
                        }
                        update(d);
                    }
                }
            },
            showStep(n){
                this.showTreeStep = true;
                $("#treeSteps g.node circle").css("fill", "black");
                $("#treeSteps g.node text").css("fill", "black").css("stroke", "#ccc").css("font-size", "20px");
                for(var i=0; i<=n; i++){
                    $("g.node[value="+ i +"] circle").css("fill", "green");
                    $("g.node[value="+ i +"] text").css("fill", "yellow").css("stroke", "green").css("font-size", "30px");
                }
            }
        },
        mounted() { // загружаем данные пользователя
            this.getRule();
        },
        created(){

        }
    }
</script>
<style>
    #content{
        width: 95%;
    }
    .link {
        fill: none;
        stroke: #ccc; 
        stroke-width: 2px;
    }
    div.child{ 
        display: inline-block;  
        padding: 20px;
        margin: 0px;
        padding: 0px;
        min-width: 15%;
    } 
    div.childSmall{ 
        display: inline-block;  
        padding: 20px;
        min-width: 13%;
    } 
    div.childSmall > *{
        font-size: large;
        border : 1px #ccc solid;
        width: 100%;
        font-size: medium;
        text-align: center;
        vertical-align: middle
    }
    div.child > *{
        font-size: large;
        border : 1px #ccc solid;
        height: 2.7em;
        width: 100%;
        font-size: medium;
        text-align: center;
        vertical-align: middle
    }
    div.child div:first-child{
        background-color: #DFE0E2;
        color: #394053;
        font-size: large;
    }
    .rowElem{
        width: 95%;
        margin: 3%;
        display: flex;
        justify-content: space-around;
    }
    .rowElemChild{
        text-align: center;
        width: 25em;
    }
    .rowElemChild div{
        border-bottom: 1px #DFE0E2 solid;
        display: block;
    }
    .rowElemChild h3 {
        background-color: #DFE0E2;
        color: #394053;
    }
    form{
        margin-left: 20%;
    }
    .treeContent{
        width: 100%;
        display: block;
        text-align: center;
    }
    #show{
        display: flex;
        width: 100%;
        justify-content: space-around;
        text-align: center;
    }
    .shadeWord{
        color: #394053;
    }
    #error{
        /* border: 1px red solid; */
        margin-left: 23%;
        border: 1px red solid;
        width: 50%;
        text-align: center;
        color: red;
        margin-bottom: 2%;
    }
</style>