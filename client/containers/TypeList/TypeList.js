import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import './TypeList.scss';
// import { autobind } from 'core-decorators';
import { fetchGroupMsg, addMember, delMember, changeMemberRole } from '../../reducer/modules/group.js';
import { fetchTypeList } from '../../reducer/modules/type.js';
import TypePanel from './TypePanel';

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
      currProject: state.project.currProject,
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
    currProject: PropTypes.object,
    uid: PropTypes.number,
    fetchTypeList: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
    addMember: PropTypes.func,
    delMember: PropTypes.func,
    changeMemberRole: PropTypes.func,
    role: PropTypes.string
  };

  getTypeList = currGroupId => {
    const { currGroup, currProject } = this.props;
    this.props.fetchTypeList(currGroupId || currGroup._id, currProject._id).then(res => {
      this.setState({
        typeList: arrayAddKey(res.payload.data.data)
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

  render() {
    const { typeList } = this.state;
    return (
      <div className="typelist m-panel">
        <div>共 ({typeList.length}) 个类型</div>
        <TypePanel typeList={typeList} refreshTypeList={this.getTypeList} />
      </div>
    );
  }
}

export default TypeList;
