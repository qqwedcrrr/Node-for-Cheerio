const videoSchema = require('../schema/video');

videoSchema.findByName = function(name,cb){
    return this.find({name},cb)
}

videoSchema.deleteByName = function(name,cb){
    return this.remove({name},cb)
}

videoSchema.update = function(source,update){
    return this.update(source,update)
}
