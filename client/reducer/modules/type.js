import axios from 'axios';

const FETCH_TYPE_LIST = 'yapi/type/FETCH_TYPE_LIST';
const SAVE_TYPE = 'yapi/type/SAVE_TYPE';
const DEL_TYPE = 'yapi/type/DEL_DEL_TYPE';
// Reducer

// 添加项目成员
export function saveType(param) {
  return {
    type: SAVE_TYPE,
    payload: axios.post('/api/type/save', param)
  };
}

// 获取某分组下的项目列表
export function fetchTypeList(group_id, project_id) {
  return {
    type: FETCH_TYPE_LIST,
    payload: axios.get('/api/type/list', {
      params: {
        group_id,
        project_id
        // page: pageNum || 1,
        // limit: variable.PAGE_LIMIT
      }
    })
  };
}

// 删除项目成员
export async function delType(param) {
  return {
    type: DEL_TYPE,
    payload: await axios.post('/api/type/del', param)
  };
}
