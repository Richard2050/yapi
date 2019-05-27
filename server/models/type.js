const yapi = require('../yapi.js');
const baseModel = require('./base.js');
const { TypeGroups } = require('../../const');

class groupModel extends baseModel {
  getName() {
    return 'type';
  }

  getSchema() {
    return {
      uid: Number,
      group_id: Number,
      project_id: Number,
      add_time: Number,
      up_time: Number,
      content: String,
      //   desc: String,
      name: String,
      type: {
        type: String,
        enum: TypeGroups.map(item => item.value)
      }
    };
  }

  save(data) {
    return new this.model(data).save();
  }

  get(id) {
    return this.model
      .findOne({
        _id: id
      })
      .exec();
  }

  checkRepeat(name, group_id, project_id) {
    return this.model.countDocuments({
      name,
      group_id,
      project_id
    });
  }

  getTypeListCount(type, group_id, project_id) {
    return this.model.countDocuments({ type, group_id, project_id });
  }

  list(type, group_id, project_id) {
    return this.model
      .find({
        type,
        group_id,
        project_id
      })
      .exec();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  up(id, data) {
    return this.model.update(
      {
        _id: id
      },
      data
    );
  }

  search(keyword) {
    return this.model
      .find({
        name: new RegExp(keyword, 'i')
      })
      .limit(10);
  }
}

module.exports = groupModel;
