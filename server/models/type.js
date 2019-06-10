const yapi = require('../yapi.js');
const baseModel = require('./base.js');
const { limitType, defaultLimitTypeValue } = require('../../const');

class groupModel extends baseModel {
  getName() {
    return 'type';
  }

  getSchema() {
    return {
      // uid: Number,
      group_id: Number,
      project_id: Number,
      add_time: Number,
      up_time: Number,
      content: String,
      //   desc: String,
      name: String,
      limit: {
        type: String,
        enum: limitType.map(item => item.value),
        default: defaultLimitTypeValue
      }
    };
  }

  save(data) {
    data.up_time = data.add_time = yapi.commons.time();
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

  getTypeListCount(/* type, group_id, project_id */) {
    return this.model.countDocuments(this.getQueryObj.apply(null, arguments));
  }

  getQueryObj(type, group_id, project_id) {
    let queryObj = {
      group_id
    };

    if (project_id) {
      queryObj.project_id = { $in: [project_id, undefined] };
    } else {
      queryObj.project_id = undefined;
    }

    if (type) {
      queryObj.type = type;
    }

    return queryObj;
  }

  list(/* type, group_id, project_id */) {
    return this.model.find(this.getQueryObj.apply(null, arguments)).exec();
  }

  listWithPaging(type, group_id, project_id, page, limit) {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    return this.model
      .find(this.getQueryObj(type, group_id, project_id))
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  up(id, data) {
    data.up_time = yapi.commons.time();
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
