const typeModel = require('../models/type.js');
const yapi = require('../yapi.js');
const baseController = require('./base.js');

class typeController extends baseController {
  constructor(ctx) {
    super(ctx);
    this.schemaMap = {};
  }

  /**
   * 根据Id查询类型
   * @interface /type/get
   * @method GET
   * @category type
   * @foldnumber 10
   * @param {String} id 类型ID
   * @returns {Object}
   * @example
   */
  async get(ctx) {
    let params = ctx.params;

    let typeInst = yapi.getInst(typeModel);
    let result = await typeInst.get(params.id);
    if (result) {
      result = result.toObject();
      ctx.body = yapi.commons.resReturn(result);
    }
  }

  /**
   * 保存新增或修改的自定义类型数据
   * @interface /type/save
   * @method POST
   * @category type
   * @foldnumber 10
   * @param {String} id 类型id，为空为新增, 不为空是修改
   * @param {String} typeName 类型名称 不能为空
   * @param {String} group_id 项目分组id，不能为空
   * @param {String} project_id 项目id，可以为空
   * @param {String} content 类型配置数据
   * @param {String} type 类型类别: response 或 extend
   * @returns {Object}
   * @example ./api/group/add.json
   */
  async save(ctx) {
    const { id } = ctx.params;
    if (id) {
      await this.up(ctx);
    } else {
      await this.add(ctx);
    }
  }

  /**
   * 添加分类
   * @interface /type/add
   * @method POST
   * @category type
   * @foldnumber 10
   * @param {String} typeName 类型名称 不能为空
   * @param {String} group_id 项目分组id，不能为空
   * @param {String} project_id 项目id，可以为空
   * @param {String} content 类型配置数据
   * @param {String} type 类型类别: response 或 extend
   * @returns {Object}
   * @example ./api/group/add.json
   */
  async add(ctx) {
    const { name, group_id, project_id, content, limit, desc } = ctx.params;
    let typeInst = yapi.getInst(typeModel);
    let checkRepeat = await typeInst.checkRepeat(name, group_id, project_id);
    if (checkRepeat > 0) {
      return (ctx.body = yapi.commons.resReturn(null, 401, '分类名已存在'));
    }

    let data = {
      name,
      group_id,
      project_id,
      content,
      limit,
      desc,
      uid: this.getUid(),
      add_time: yapi.commons.time(),
      up_time: yapi.commons.time()
    };

    let result = await typeInst.save(data);
    result = yapi.commons.fieldSelect(result, ['_id', 'name', 'group_id', 'project_id', 'desc', 'limit']);
    let username = this.getUsername();
    yapi.commons.saveLog({
      content: `<a href="/user/profile/${this.getUid()}">${username}</a> 新增了自定义类型 <a href="/type/${
        result._id
      }">${name}</a>`,
      type: 'type',
      uid: this.getUid(),
      username: username,
      typeid: result._id
    });
    ctx.body = yapi.commons.resReturn(result);
  }

  /**
   * 获取项目类型列表
   * @interface /type/list
   * @method get
   * @param {String} group_id 项目分组id，不能为空
   * @param {String} project_id 项目id，可以为空
   * @param {String} type 类型类别: response 或 extend
   * @category type
   * @foldnumber 10
   * @returns {Object}
   * @example ./api/group/list.json
   */
  async list(ctx) {
    var typeInst = yapi.getInst(typeModel);
    const { type, group_id, project_id } = ctx.params;
    let result = await typeInst.list(type, group_id, project_id);

    ctx.body = yapi.commons.resReturn(result);
  }

  /**
   * 分页获取项目类型列表
   * @interface /type/listWithPaging
   * @method get
   * @param {String} group_id 项目分组id，不能为空
   * @param {String} project_id 项目id，可以为空
   * @param {String} content 类型配置数据
   * @param {String} type 类型类别: response 或 extend
   * @param {Number} page 当前页
   * @param {Number} limit 每页条数
   * @category type
   * @foldnumber 10
   * @returns {Object}
   * @example ./api/group/list.json
   */
  async listWithPaging(ctx) {
    var typeInst = yapi.getInst(typeModel);
    const { type, group_id, project_id, page, limit } = ctx.params;
    let result = {};
    result.dataList = await typeInst.listWithPaging(type, group_id, project_id, page, limit);
    result.total = await typeInst.getTypeListCount(type, group_id, project_id);
    ctx.body = yapi.commons.resReturn(result);
  }

  /**
   * 删除自定义类型
   * @interface /type/del
   * @method post
   * @param {String} id 类型id
   * @category type
   * @foldnumber 10
   * @returns {Object}
   * @example ./api/group/del.json
   */
  async del(ctx) {
    if (this.getRole() === 'guest') {
      return (ctx.body = yapi.commons.resReturn(null, 401, '没有权限'));
    }

    let typeInst = yapi.getInst(typeModel);
    let id = ctx.params.id;
    let result = await typeInst.del(id);

    let username = this.getUsername();
    yapi.commons.saveLog({
      content: `<a href="/user/profile/${this.getUid()}">${username}</a> 删除自定义类型 id 为 ${id} 的自定义类型`,
      type: 'type',
      uid: this.getUid(),
      username: username
      // typeid: result._id
    });

    ctx.body = yapi.commons.resReturn(result);
  }

  /**
   * 更新自定义类型
   * @interface /type/up
   * @method post
   * @param {String} id 类型id，不能为空
   * @param {String} typeName 类型名称 不能为空
   * @param {String} group_id 项目分组id，不能为空
   * @param {String} project_id 项目id，可以为空
   * @param {String} content 类型配置数据
   * @param {String} type 类型类别: response 或 extend
   * @category type
   * @foldnumber 10
   * @returns {Object}
   * @example ./api/group/up.json
   */
  async up(ctx) {
    if (this.getRole() === 'guest') {
      return (ctx.body = yapi.commons.resReturn(null, 401, '没有权限'));
    }

    let typeInst = yapi.getInst(typeModel);
    let params = ctx.params;

    let result = await typeInst.up(params.id, params);
    let username = this.getUsername();
    yapi.commons.saveLog({
      content: `<a href="/user/profile/${this.getUid()}">${username}</a> 更新了 <a href="/type/${params.id}">${
        params.group_name
      }</a> 自定义类型`,
      type: 'group',
      uid: this.getUid(),
      username: username,
      typeid: params.id
    });
    ctx.body = yapi.commons.resReturn(result);
  }
}

module.exports = typeController;
