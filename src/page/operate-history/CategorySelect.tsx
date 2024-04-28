import { useEffect, useState } from 'react';
import { categoryList } from '../../interface/interfaces';
import { Select } from 'antd';

export const getLocalCategoryData = () => {
  return sessionStorage.getItem('categoryList');
};

async function getCategoryList() {
  const localData = getLocalCategoryData();
  if (localData) {
    return Promise.resolve(JSON.parse(localData));
  } else {
    const { data } = await categoryList();

    const list = data.data.list.map((item) => {
      return {
        label: item.category_name,
        value: item.category_id,
      };
    });
    if (data.code === 200) {
      sessionStorage.setItem('categoryList', JSON.stringify(list));
    }
    return list;
  }
}

export function CategorySelect(props) {
  // 分类
  const [categoryList, setCategoryList] = useState([]);
  const [categoryObject, setCategoryObject] = useState({});

  useEffect(() => {
    getCategoryList().then((data) => {
      setCategoryList(data);
      setCategoryObject(
        data.reduce((pre, cur) => {
          pre[cur.value] = cur.label;

          return pre;
        }, {})
      );
    });
  }, []);

  return props.isText ? (
    categoryObject[props.value]
  ) : (
    <Select options={categoryList} {...props} allowClear></Select>
  );
}
