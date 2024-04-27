import { useEffect, useState } from 'react';
import { categoryList } from '../../interface/interfaces';
import { Select } from 'antd';

async function getCategoryList() {
  const localData = sessionStorage.getItem('categoryList');
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

  useEffect(() => {
    getCategoryList().then((data) => {
      setCategoryList(data);
    });
  }, []);

  return <Select options={categoryList} {...props} allowClear></Select>;
}
