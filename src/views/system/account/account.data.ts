import { h } from 'vue';
import { Switch } from 'ant-design-vue';

import { getAllRoleList } from '@/api/account/role';
import { BasicColumn, FormSchema } from '@/components/Table';
import { useMessage } from '@/hooks/web/useMessage';
import { AvailableStatus } from '@/utils/constants';
import { updateAccountStatus } from '@/api/account';

type CheckedType = boolean | string | number;
export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(Switch, {
        checked: record.status === AvailableStatus.NORMAL,
        checkedChildren: '启用',
        unCheckedChildren: '停用',
        loading: record.pendingStatus,
        onChange(checked: CheckedType) {
          record.pendingStatus = true;
          const newStatus = checked ? AvailableStatus.NORMAL : AvailableStatus.FORBIDDEN;
          const { createMessage } = useMessage();
          updateAccountStatus(newStatus, record.id)
            .then(() => {
              record.status = newStatus;
              createMessage.success(`已成功修改用户状态`);
            })
            .catch(() => {
              createMessage.error('修改用户状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
  },
  {
    title: '角色',
    dataIndex: 'role',
    customRender: ({ value }) => value.name,
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'q',
    label: '关键字',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    required: true,
    // helpMessage: ['本字段演示异步验证', '不能输入带有admin的用户名'],
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    required: true,
    ifShow: false,
  },
  {
    label: '角色',
    field: 'roleId',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const roleList = await getAllRoleList();
        return roleList.list;
      },
      labelField: 'name',
      valueField: 'id',
    },
    required: true,
  },
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    required: true,
  },

  {
    label: '手机号',
    field: 'phone',
    component: 'Input',
    required: true,
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: AvailableStatus.NORMAL,
    componentProps: {
      options: [
        { label: '启用', value: AvailableStatus.NORMAL },
        { label: '停用', value: AvailableStatus.FORBIDDEN },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
