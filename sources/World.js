var World = function(camera,lightDirection){
  this.sky = new Sky(camera,lightDirection);
  this.obstacles = [];
  this.obstacles.push(new Ground());
  for(var i = 0; i< 30; i++) {
    this.obstacles.push(new Container());
  }
};
