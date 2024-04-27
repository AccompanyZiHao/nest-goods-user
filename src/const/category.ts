import { categoryList } from '../interface/interfaces';

enum GoodsType {
  book = 2,
  drink,
  toy,
}

export const goodsType = {
  [GoodsType.book]: '书籍',
  [GoodsType.drink]: '饮料',
  [GoodsType.toy]: '玩具',
};

export const goodsTypeList = Object.entries(goodsType).map(([value, label]) => {
  return {
    value,
    label,
  };
});

export async function getCategoryList() {
  const localData = sessionStorage.getItem('categoryList');
  if (localData) {
    return JSON.parse(localData);
  } else {
    const { data } = await categoryList();

    const list = data.data.list;
    if (data.code === 200) {
      sessionStorage.setItem('categoryList', JSON.stringify(list));
    }
    return list;
  }
}
