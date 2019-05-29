import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Select, Button, Modal, Row, Col, message, Popconfirm, Collapse } from 'antd';
import { Link } from 'react-router-dom';
import './TypeList.scss';
import { autobind } from 'core-decorators';
import { fetchGroupMsg, addMember, delMember, changeMemberRole } from '../../../reducer/modules/group.js';
import { fetchTypeList } from '../../../reducer/modules/type.js';
import ErrMsg from '../../../components/ErrMsg/ErrMsg.js';
import UsernameAutoComplete from '../../../components/UsernameAutoComplete/UsernameAutoComplete.js';
import TypePanel from './TypePanel';
import { TypeGroups } from '../../../../const';

const Option = Select.Option;
const Panel = Collapse.Panel;

function arrayAddKey(arr) {
  return (
    Array.isArray(arr) &&
    arr.map((item, index) => {
      return {
        ...item,
        key: index
      };
    })
  );
}

@connect(
  state => {
    return {
      currGroup: state.group.currGroup,
      uid: state.user.uid,
      role: state.group.role
    };
  },
  {
    fetchTypeList,
    fetchGroupMsg,
    addMember,
    delMember,
    changeMemberRole
  }
)
class TypeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeList: [],
      userInfo: [],
      role: '',
      visible: false,
      dataSource: [],
      inputUids: [],
      inputRole: 'dev'
    };
  }
  static propTypes = {
    currGroup: PropTypes.object,
    uid: PropTypes.number,
    fetchTypeList: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
    addMember: PropTypes.func,
    delMember: PropTypes.func,
    changeMemberRole: PropTypes.func,
    role: PropTypes.string
  };

  showAddMemberModal = () => {
    this.setState({
      visible: true
    });
  };

  // 重新获取列表
  refetchList = () => {
    this.props.fetchTypeList(this.props.currGroup._id).then(res => {
      this.setState({
        userInfo: arrayAddKey(res.payload.data.data),
        visible: false
      });
    });
  };

  // 增 - 添加成员

  handleOk = () => {
    this.props
      .addMember({
        id: this.props.currGroup._id,
        member_uids: this.state.inputUids,
        role: this.state.inputRole
      })
      .then(res => {
        if (!res.payload.data.errcode) {
          const { add_members, exist_members } = res.payload.data.data;
          const addLength = add_members.length;
          const existLength = exist_members.length;
          this.setState({
            inputRole: 'dev',
            inputUids: []
          });
          message.success(`添加成功! 已成功添加 ${addLength} 人，其中 ${existLength} 人已存在`);
          this.reFetchList(); // 添加成功后重新获取分组成员列表
        }
      });
  };
  // 添加成员时 选择新增成员权限

  changeNewMemberRole = value => {
    this.setState({
      inputRole: value
    });
  };

  // 删 - 删除分组成员

  deleteConfirm = member_uid => {
    return () => {
      const id = this.props.currGroup._id;
      this.props.delMember({ id, member_uid }).then(res => {
        if (!res.payload.data.errcode) {
          message.success(res.payload.data.errmsg);
          this.reFetchList(); // 添加成功后重新获取分组成员列表
        }
      });
    };
  };

  // 改 - 修改成员权限
  changeUserRole = e => {
    const id = this.props.currGroup._id;
    const role = e.split('-')[0];
    const member_uid = e.split('-')[1];
    this.props.changeMemberRole({ id, member_uid, role }).then(res => {
      if (!res.payload.data.errcode) {
        message.success(res.payload.data.errmsg);
        this.reFetchList(); // 添加成功后重新获取分组成员列表
      }
    });
  };

  // 关闭模态框

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this._groupId !== this._groupId) {
      return null;
    }

    if (this.props.currGroup._id !== nextProps.currGroup._id) {
      this.props.fetchTypeList(nextProps.currGroup._id).then(res => {
        this.setState({
          typeList: arrayAddKey(res.payload.data.data)
        });
      });
      this.props.fetchGroupMsg(nextProps.currGroup._id).then(res => {
        this.setState({
          role: res.payload.data.data.role
        });
      });
    }
  }

  componentDidMount() {
    const currGroupId = (this._groupId = this.props.currGroup._id);
    if (!currGroupId) {
      return;
    }

    this.props.fetchGroupMsg(currGroupId).then(res => {
      this.setState({
        role: res.payload.data.data.role
      });
    });

    this.props.fetchTypeList(currGroupId).then(res => {
      this.setState({
        typeList: arrayAddKey(res.payload.data.data)
      });
    });
  }

  @autobind
  onUserSelect(uids) {
    this.setState({
      inputUids: uids
    });
  }

  render() {
    const typeSeparateList = {};

    this.state.typeList.forEach(item => {
      const _type = item.type;
      typeSeparateList[_type] = typeSeparateList[_type] || [];
      typeSeparateList[_type].push(item);
    });

    return (
      <div className="typelist m-panel">
        <Collapse defaultActiveKey={TypeGroups[0].value} accordion>
          {TypeGroups.map(item => {
            const _typeList = typeSeparateList[item.value] || [];
            return (
              <Panel header={`${item.name} 共 (${_typeList.length}) 个类型`} key={item.value}>
                <TypePanel type={item} typeList={_typeList} />
              </Panel>
            );
          })}
        </Collapse>
      </div>
    );
  }
}

export default TypeList;
