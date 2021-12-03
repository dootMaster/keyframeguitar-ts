const returnsCommonTuningForStringQty = (number:string) => {
  switch(parseInt(number)) {
    case 4:
      return [7, 2, 9, 4];
    case 5:
      return [7, 2, 9, 4, 11];
    case 6:
      return [4, 11, 7, 2, 9, 4];
    case 7:
      return [4, 11, 7, 2, 9, 4, 11];
    case 8:
      return [4, 11, 7, 2, 9, 4, 11, 6];
    case 9:
      return [4, 11, 7, 2, 9, 4, 11, 6, 1];
  }
}

export { returnsCommonTuningForStringQty }