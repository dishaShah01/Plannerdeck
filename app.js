
var plancontroller=(function(){
    var notes=function(id,notetask,value){
        this.id=id;
        this.notetask=notetask;
        this.value=value;
        
    };
    
    
    var todolist=function(id,notetask,value){
        this.id=id;
        this.notetask=notetask;
        this.value=value;       
    };
    
     
    
    var data={
        allitems:{
            n:[],
            t:[]
                     
        }
    };
    return{
        additem:function(type,nt,val,total_notes,total_tasks){
            var newitem;
            if (data.allitems[type].length>0){
            var ID= data.allitems[type][data.allitems[type].length-1].id+1;
            }
            else{
                ID=0;
            }
            if(type==='n'){
            newitem= new notes(ID,nt,val);
            
            
            document.querySelector('.plan__notes--value').textContent=data.allitems['n'].length+1;
            }
            else if(type==='t'){
                newitem=new todolist(ID,nt,val);
                
                document.querySelector('.plan__todo--value').textContent=data.allitems['t'].length+1;
            }
            data.allitems[type].push(newitem);
            return newitem;
        },
        
        deleteitem:function(type,id,total_notes,total_tasks){
          var ids=data.allitems[type].map(function(current){
              return current.id;
          });
           var index=ids.indexOf(id);
            if(index!==-1){
                data.allitems[type].splice(index,1);
            }
            if(type==='n'){
                
                document.querySelector('.plan__notes--value').textContent=data.allitems['n'].length;
            }else if(type==='t'){
                data.allitems[total_tasks]-=1;
                document.querySelector('.plan__todo--value').textContent=data.allitems['t'].length;
            }
        }
        
    };
})();

var UIcontroller=(function(){
    var domstrings={
        inputtype:'.add__type',
        inputnotetask:'.add__notetask',
        inputvalue:'.add__value',
        inputbtn:'.add__btn',
        todocontainer:'.todo__list',
        notescontainer:'.notes__list',
        todolabel:'.plan__todo--value',
        noteslabel:'.plan__notes--value',
        
        container:'.container',
       
        datelabel:'.plan__title--month'
    };
    
    
    var nodelistforeach=function(list,callback){
              for(var i=0;i<list.length;i++){
                  callback(list[i],i);
              }  
            };
    return{
        getinput:function(){
            return{
             type:document.querySelector(domstrings.inputtype).value,
             notetask:document.querySelector(domstrings.inputnotetask).value,
             value:document.querySelector(domstrings.inputvalue).value
            };
            
        },
        addlistitems:function(obj,type){
            var html,element;
            if(type==='t'){
                element=domstrings.todocontainer;
           html=' <div class="item clearfix" id="t-%id%"><div class="item__notetask">%notetask%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';}
            
            else if(type==='n'){
                element=domstrings.notescontainer;
                html='<div class="item clearfix" id="n-%id%"><div class="item__notetask">%notetask%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';}
            
            newhtml=html.replace('%id%',obj.id);
            newhtml=newhtml.replace('%notetask%',obj.notetask);
            newhtml=newhtml.replace('%value%',obj.value);
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
                
            },
        
        deletelistitems:function(selectorid){
            var el=document.getElementById(selectorid);
            el.parentNode.removeChild(el);
            
        },
        
        clearfields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(domstrings.inputnotetask + ', ' + domstrings.inputvalue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
                               
        displaymonth:function(){
            var now,year,month,months;
          now=new Date();
            months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month=now.getMonth();
            year=now.getFullYear();
            document.querySelector(domstrings.datelabel).textContent=months[month]+' '+year;
        },
        
        changedtype:function(){
            var fields=document.querySelectorAll(
            domstrings.inputtype+','+
                domstrings.inputnotetask+','+
                domstrings.inputvalue);
            
            nodelistforeach(fields,function(cur){
               cur.classList.toggle('green-focus'); 
            });
            document.querySelector(domstrings.inputbtn).classList.toggle('green');
            },
        getdomstrings: function() {
            return domstrings;
        }
    };
})();

var controller=(function(planctrl,UIctrl){
    var setupeventlisteners=function(){
      var dom=UIctrl.getdomstrings();
        document.querySelector(dom.inputbtn).addEventListener('click',ctrladditem);
   document.addEventListener('keypress',function(event){
       if(event.keyCode===13||event.which===13){
           ctrladditem();
       } 
       
   });
        document.querySelector(dom.container).addEventListener('click',ctrldeleteitem);
        
        document.querySelector(dom.inputtype).addEventListener('change',UIctrl.changedtype);
        

    };
    
   
   var ctrladditem=function(){
       var input=UIctrl.getinput();
       
       if(input.notetask!==""){
       var newitem=planctrl.additem(input.type,input.notetask,input.value);
       UIctrl.addlistitems(newitem,input.type);
       UIctrl.clearfields();
       }
   };
    
    var ctrldeleteitem=function(event){
       var itemid,splitid,type,id; itemid=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemid){
            splitid=itemid.split('-');
            type=splitid[0];
            id=parseInt(splitid[1]);
            planctrl.deleteitem(type,id);
            UIctrl.deletelistitems(itemid);
            
        }
    };
    return{
        init: function(){
            
            console.log('start');
           UIctrl.displaymonth(); 
            
            setupeventlisteners();
        }
    }

})(plancontroller,UIcontroller);

controller.init();
