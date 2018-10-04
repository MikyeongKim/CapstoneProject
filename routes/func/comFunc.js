module.exports = {
  IsWriter,
  paging
};

function IsWriter(data, id) {
  const length = data.length;
  for (let i = 0; i < length; i++) {
    if (data[i].board_user_no === id) {
      data[i].isWriter = true;
    }
  }
}

function paging(currentPage, result) {
  if (currentPage == null) {
    currentPage = 1;
  }

  const limitList = 10;
  const limitPage = 10;
  let skipList = (currentPage - 1) * limitList;

  let startPage = Math.floor((currentPage - 1) / limitPage) * limitPage + 1;
  let endPage = startPage + limitPage - 1;
  let prevPage = startPage - limitPage;
  let totalCount = result.length;
  let pageNum = Math.ceil(totalCount / limitList);

  if (endPage > pageNum) {
    endPage = pageNum;
  }

  resultSet = result.slice(skipList, skipList + limitList);
  resultSet.skip = skipList;
  resultSet.startp = startPage;
  resultSet.endp = endPage;
  resultSet.lastp = pageNum;
  resultSet.prevp = prevPage;

  return resultSet;
}
