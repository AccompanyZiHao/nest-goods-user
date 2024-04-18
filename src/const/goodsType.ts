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
