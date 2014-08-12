
/**
 ## IWC + JSON Example
 Here, I will give a short overview on how to use the IwcJson Framework in Role-SDK widgets.
 First you have to include the following libraries in your widget file:
 ```
<script src="http://open-app.googlecode.com/files/openapp.js"></script>
<script src="http://dbis.rwth-aachen.de/gadgets/iwc/lib/iwc.js"></script>
<script src="http://dbis.rwth-aachen.de/~jahns/role-widgets/widgetbundles/libraries/DUIClient.js"></script>
<script src="../dest/browser/Frameworks/JsonIwcYatta.min.js"></script>
<script src="./IwcJson.js"></script>
 ```
A working widget implementation is maintained [here](./IwcJson.xml) and the js-file is [here](./IwcJson.js)
 */
function init(){
    createConnector(function(Connector, user_id){
      /**
       yatta is the shared json object. If you change something on this object,
       it will be instantly shared with all the other collaborators.
      */
      yatta = new JsonYatta(user_id, Connector);

      /**
       Add a integer-property like this
      */
      yatta.val('x', 7);

      /**
       Get the value of property x like this
      */
      console.log(yatta.val('x') === 7); // true

      /**
       A string property can be either mutable or immutable.
      */
      yatta.val('mutable_string', "text", "mutable");
      yatta.val('immutable_string', "text", "immutable");

      console.log(yatta.val('immutable_string') === "text"); // true
      yatta.val('mutable_string').insertText(2,"XXX"); // position, string
      yatta.val('mutable_string').deleteText(0,1); // position, deletion length
      console.log(yatta.val('mutable_string').val() === "eXXXxt"); // true

      /**
       You can omit the mutable - parameter. In that case the default will be used.
       Initially the default is 'mutable'. You can set it like this:
       */
      yatta.setMutableDefault('mutable');
      // or
      yatta.setMutableDefault('immutable');

      yatta.val('new_string', "string");
      console.log(yatta.val('new_string') === "string"); // true

      /**
       yatta is chainable:
       */
      yatta.val('a', 4).val('b',5);
      console.log(yatta.val('a') === 4); // true
      console.log(yatta.val('b') === 5); // true

      /**
       You can alse set objects.
       */
      yatta.val('object', {a : {b : "b"}, c : { d : 5 }});
      console.log(yatta.val('object').val('c').val('d') === 5); // true

      /**
       Lists are always immutable.
      */
      yatta.val('list', [1,2,3]);
      console.log(yatta.val('list')[2] === 3); // true

      /**
       But there is a much more convenient way!
      */
      console.log(yatta.value.list[2] === 3) // true
      yatta.value.list = [3,4,5]
      console.log(yatta.val('list')[2] === 5) // true
      yatta.value.object = {c : 4}
      console.log(yatta.value.object.c === 4) // true

      /**
       The downside is that you are only allowed to overwrite existing properties.
      */
      yatta.value.newProperty = "Awesome"
      console.log(yatta.value.newProperty !== "Awesome") // true, yatta.value.newProperty is undefined.

      /**
       So, how do we create new properties?
      */
      yatta.value = {newProperty : "Awesome"}
      console.log(yatta.value.newProperty === "Awesome") // true, it's awesome ;)

      /**
       This is stupid! I don't want to overwrite all my existing properties!
       Very well.. The solution is that we merge yatta.value with the new assignment.
       For example: assuming we want to overwrite yatta.value with some object o.
       Then these two rules apply:
       * The result has all properties of o
       * The result has all properties of yatta.value if they don't occur under the same property-name in o
      */
      yatta.value = {newProperty : {Awesome : true }}
      console.log(yatta.value.list[2] === 5) // true, old value list still exists.
      console.log(yatta.value.newProperty.Awesome === true) // true, newProperty is overwritten.

      /**
       Consider this case.
      */
      yatta.value = {newProperty : { x : 4} }
      console.log(yatta.value.newProperty.Awesome == null) // true, newProperty was replaced, therefore it is now undefined

      /**
       Did you notice that you always set immutable objects if you set properties like this?
       Even if the default is 'mutable'. If you want to work with mutable objects you have to work with .val().

       One last thing. You are only allowed to set properties like this `yatta.value = o`.
       Yatta can't observe if you overwrite object references `yatta = "Awesome"`.
      */
      w = yatta.value.newProperty
      w = "Awesome"
      console.log(yatta.value.newProperty !== "Awesome") // true, still not awesome..

      /**
       Please also read [JsonWrapper](https://rawgit.com/DadaMonad/Yatta/master/doc/class/JsonWrapper.html)
      */
    })
}
window.onload = init
