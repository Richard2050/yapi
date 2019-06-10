import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Button, Modal, Row, Col, message, Popconfirm, Input } from 'antd';
import { fetchGroupMemberList, fetchGroupMsg } from '../../reducer/modules/group.js';
import { saveType, delType } from '../../reducer/modules/type.js';
import ErrMsg from '../../components/ErrMsg/ErrMsg.js';
import { MOCK_SOURCE } from '../../constants/variable.js';
import { limitType, defaultLimitTypeValue } from '../../../const';
import './TypeList.scss';

const jSchema = require('json-schema-editor-visual');

const ResBodySchema = jSchema({
  lang: 'zh_CN',
  mock: MOCK_SOURCE
});

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
    fetchGroupMemberList,
    fetchGroupMsg,
    saveType,
    delType
  }
)
class TypePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectTypeId: '',
      selectTypeName: '',
      selectTypeContent: '',
      selectTypeLimit: '1', //不可更改
      userInfo: [],
      visible: false,
      dataSource: [],
      inputUids: [],
      inputRole: 'dev'
    };
  }

  static propTypes = {
    typeList: PropTypes.array,
    currGroup: PropTypes.object,
    currProject: PropTypes.object,
    refreshTypeList: PropTypes.func,
    uid: PropTypes.number,
    fetchGroupMemberList: PropTypes.func,
    fetchGroupMsg: PropTypes.func,
    saveType: PropTypes.func,
    delType: PropTypes.func,
    role: PropTypes.string
  };

  showAddTypeModal = () => {
    this.setState({
      visible: true
    });
  };

  // 保存新增或修改的自定义类型数据
  handleSave = () => {
    let saveObj = {
      group_id: this.props.currGroup._id,
      project_id: this.props.currProject._id,
      name: this.state.selectTypeName,
      content: this.state.selectTypeContent,
      limit: this.state.selectTypeLimit
    };

    let _id = this.state.selectTypeId;

    if (_id) {
      saveObj.id = _id;
    }

    this.props.saveType(saveObj).then(res => {
      if (!res.payload.data.errcode) {
        message.success(`保存成功 !`);

        this.setState({
          selectTypeId: '',
          selectTypeName: '',
          selectTypeContent: '',
          visible: false
        });

        this.props.refreshTypeList();
      }
    });
  };

  // 删 - 删除分组成员
  deleteConfirm = typeId => {
    return async () => {
      const res = await this.props.delType({ id: typeId });
      if (!res.payload.data.errcode) {
        message.success(res.payload.data.errmsg);
        this.props.refreshTypeList();
      }
    };
  };

  // 关闭模态框
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  editType(record) {
    this.setState({
      selectTypeId: record._id,
      selectTypeName: record.name,
      selectTypeContent: record.content,
      selectTypeLimit: record.limit,
      visible: true
    });
  }

  render() {
    const columns = [
      {
        title: '类型名称',
        dataIndex: 'name',
        className: 'typepanel-column',
        key: 'name',
        render: (text, record) => {
          return (
            <div
              title={'点击编辑类型'}
              className="m-user"
              onClick={() => {
                this.editType(record);
              }}
            >
              <p> {text}</p>
            </div>
          );
        }
      },
      {
        title: '类型说明',
        dataIndex: 'desc',
        className: 'typepanel-column',
        key: 'desc',
        render: text => {
          return (
            <div title="类型说明" className="m-user">
              <p> {text}</p>
            </div>
          );
        }
      },
      {
        title: '限制类型',
        dataIndex: 'limit',
        className: 'typepanel-column',
        key: 'limit',
        render: value => {
          value = value || defaultLimitTypeValue;
          return (
            <div title="限制类型" className="m-user">
              <p>{limitType.find(item => item.value == value).name}</p>
            </div>
          );
        }
      },
      {
        title: '操作',
        key: 'action',
        width: '300px',
        className: 'member-opration',
        render: (text, record) => {
          if (this.props.role === 'owner' || this.props.role === 'admin') {
            return (
              <div>
                <Button
                  icon="edit"
                  className="btn-default"
                  onClick={() => {
                    this.editType(record);
                  }}
                />
                <Popconfirm
                  placement="topRight"
                  title="你确定要删除吗? "
                  onConfirm={this.deleteConfirm(record._id)}
                  okText="确定"
                  cancelText=""
                >
                  <Button type="danger" icon="delete" className="btn-danger" />
                  {/* <Icon type="delete" className="btn-danger"/> */}
                </Popconfirm>
              </div>
            );
          }
        }
      }
    ];
    console.log(this.props.role);
    return (
      <div className="m-panel">
        {this.state.visible ? (
          <Modal
            title="编辑自定义类型"
            visible={this.state.visible}
            onOk={this.handleSave}
            onCancel={this.handleCancel}
            width="1000px"
            okText="保存"
          >
            <Row type="flex" gutter={6} className="modal-input" align="middle">
              <Col span="2">
                <div className="typenamelabel">类型名: </div>
              </Col>
              <Col span="22">
                <Input
                  defaultValue={this.state.selectTypeName}
                  placeholder="请输入类型名"
                  onChange={e => {
                    this.setState({
                      selectTypeName: e.target.value
                    });
                  }}
                />
              </Col>
            </Row>
            <Row type="flex" gutter={6} className="modal-input" align="middle">
              <Col span="2">
                <div className="typenamelabel">类型名: </div>
              </Col>
              <Col span="22">
                <Input
                  defaultValue={this.state.selectTypeName}
                  placeholder="请输入类型名"
                  onChange={e => {
                    this.setState({
                      selectTypeName: e.target.value
                    });
                  }}
                />
              </Col>
            </Row>
            <Row gutter={6} className="modal-input">
              <Col span="24">
                <hr className="area-split" />
                <ResBodySchema
                  onChange={text => {
                    this.setState({
                      selectTypeContent: text
                    });
                  }}
                  isMock={true}
                  data={this.state.selectTypeContent}
                />
              </Col>
            </Row>
          </Modal>
        ) : (
          ''
        )}
        {this.props.role === 'owner' || this.props.role === 'admin' ? (
          <div className="btn-container">
            <Button className="btn" type="primary" onClick={this.showAddTypeModal}>
              添加类型
            </Button>
          </div>
        ) : (
          ''
        )}
        <Table
          columns={columns}
          dataSource={this.props.typeList}
          pagination={false}
          locale={{
            emptyText: <ErrMsg type="noType" />
          }}
        />
      </div>
    );
  }
}

export default TypePanel;
