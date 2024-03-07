import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, message, Popconfirm} from 'antd';
import React, { useRef, useState } from 'react';
import {
  addUserUsingPost,
  deleteUserUsingPost,
  listUserByPageUsingGet,
  updateUserUsingPost
} from "@/services/xhapi-backend/userController";
import CreateModal from "@/pages/Admin/components/CreateModal";
import UpdateModal from "@/pages/Admin/components/UpdateModal";
import {Image} from "antd";

const TableList: React.FC = () => {

  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.UserVO>();
  const setSelectedRows = useState<API.UserVO[]>([]);

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.UserAddRequest) => {
    const hide = message.loading('正在添加');
    try {
      await addUserUsingPost({
        ...fields,
      });
      hide();
      message.success('创建成功');
      handleModalVisible(false);
      return true;
    } catch (error: any) {
      hide();
      message.error('创建失败，' + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   * @param fields
   */
  const handleUpdate = async (fields: API.UserUpdateRequest) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateUserUsingPost({
        id: currentRow.id,
        ...fields,
      });
      hide();
      message.success('操作成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  /**
   * Delete node
   * @zh-CN 删除节点
   * @param record
   */
  const handleRemove = async (record: API.UserVO) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteUserUsingPost({
        id: record.id,
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  const confirm = async () => {
    await handleRemove(currentRow as API.UserVO);
  };

  const cancel = () => {
    message.success('取消成功');
  };

  const columns: ProColumns<API.UserVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: '用户账户',
      dataIndex: 'userAccount',
      copyable: true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      copyable: true,
    },
    {
      title: '用户简介',
      dataIndex: 'userProfile',
      copyable: true,
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      render: (_, record) => (
        <div>
          <Image src={record.userAvatar} width={100} />
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'userRole',
      valueType: 'select',
      valueEnum: {
        0: { text: '普通用户', status: 'Default' },
        1: {
          text: '管理员',
          status: 'Success',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalVisible(true);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key={'Delete'}
          title="请确认是否删除该用户!"
          onConfirm={confirm}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <a
            key="delete"
            style={{color: "red"}}
            onClick={() => {
              setCurrentRow(record);
            }}
          >
            删除
          </a>
        </Popconfirm>
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.UserVO>
        headerTitle={'用户管理'}
        actionRef={actionRef}
        rowKey="user"
        loading={loading}
        options={{ reload: false, density: false }} // 表格右上侧不展示：重新加载 & 密度按钮
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        // pagination={{defaultPageSize: 10}}
        request={async (params) => {
          setLoading(true)
          const res = await listUserByPageUsingGet({...params});
          if (res?.data) {
            setLoading(false)
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
      />

      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleAdd(value as API.UserVO);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
        }}
      />

      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        values={currentRow || {}}
        onSubmit={async (value) => {
          const success = await handleUpdate(value as API.UserVO);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
        }}
      />
    </PageContainer>
  );
};
export default TableList;
