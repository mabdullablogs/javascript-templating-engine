window.Template = (function(window, document, undefined) {
  if(typeof(window || document) === undefined) {
    throw new Error("Template: Template requires a valid window with a working document.");
  } else {
    this.compile = function(script_name, modelData) {
      var element = document.getElementsByName(script_name)[0];
      var script = script_name.replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'");
      var fnDATA = "var p=[],print=function(){p.push.apply(p,arguments);};";
      var tmDATA = "with(obj){p.push('" + script + "');}return p.join('');";
      var callback = (!/\W/.test(script)) ? this.compile(element.innerHTML) : new Function("obj", fnDATA + tmDATA);
      var validateType = function(element) {
        return (element.nodeName.toLowerCase() == "script" && element.type == "text/logo-template") ? true : false;
      };
      return (modelData && validateType(element)) ? callback(modelData) : callback;
    };
    this.compileTo = function(query, script, modelData) {
      var element = document.querySelector(query);
      return (element) ? element.innerHTML = this.compile(script, modelData) : this.compileTo(query, script, modelData);
    };
  }
  return this;
}(this, this.document));
