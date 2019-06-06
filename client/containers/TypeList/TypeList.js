import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import './TypeList.scss';
// import { autobind } from 'core-decorators';
import { fetchGroupMsg, addMember, delMember, changeMemberRole } from '../../reducer/modules/group.js';
import { fetchTypeList } from '../../reducer/modules/type.js';
import TypePanel from './TypePanel';
import { TypeGroups } from '../../../const';

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

  // 重新获取列表
  refetchList = () => {
    this.props.fetchTypeList(this.props.currGroup._id).then(res => {
      this.setState({
        userInfo: arrayAddKey(res.payload.data.data),
        visible: false
      });
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this._groupId !== this._groupId) {
      return null;
    }

    if (this.props.currGroup._id !== nextProps.currGroup._id) {
      this.getTypeList(nextProps.currGroup._id);

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

    this.getTypeList(currGroupId);
  }

  getTypeList = currGroupId => {
    this.props.fetchTypeList(currGroupId || this.props.currGroup._id).then(res => {
      this.setState({
        typeList: arrayAddKey(res.payload.data.data)
      });
    });
  };

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
                <TypePanel type={item} typeList={_typeList} refreshTypeList={this.getTypeList} />
              </Panel>
            );
          })}
        </Collapse>
      </div>
    );
  }
}

export default TypeList;
