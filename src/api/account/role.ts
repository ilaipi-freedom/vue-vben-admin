import { defHttp } from '@/utils/http/axios';

import { RoleListItem, RolePageListGetResultModel, RolePageParams } from './model/roleModel';

export const saveRole = (data: Partial<RoleListItem>, id?: string) => {
  if (id) {
    return defHttp.put({ url: `/role/${id}`, data }, { isTransformResponse: false });
  }
  return defHttp.post({ url: '/role', data }, { isTransformResponse: false });
};

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: '/role', params }, { isTransformResponse: false });

export const updatePerm = (id: string, perm: string[]) => {
  return defHttp.put(
    { url: `/role/updatePerm/${id}`, data: { perm } },
    { isTransformResponse: false },
  );
};

export const getAllRoleList = () =>
  defHttp.get({ url: '/role', params: { isAll: true } }, { isTransformResponse: false });
