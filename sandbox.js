const arr = [2, -1, 4, -44, 0, 12, 1, 1, 0, 45];

const pivot = (arr, start = 0, end = arr.length - 1) => {
  let pivot = arr[start];
  let swapIdx = start;

  for (let i = start + 1; i < arr.length; i++) {
    if (pivot > arr[i]) {
      swapIdx++;
      [arr[swapIdx], arr[i]] = [arr[i], arr[swapIdx]];
    }
  }

  [arr[start], arr[swapIdx]] = [arr[swapIdx], arr[start]];

  return swapIdx;
};

const quickSort = (arr, left = 0, right = arr.length - 1) => {
  if (left < right) {
    const pivotIdx = pivot(arr, left, right);
    quickSort(arr, left, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, right);
  }

  return arr;
};

console.log(quickSort(arr));
