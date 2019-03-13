var quickSort =function quickSort(a) {
    return a.length <= 1 ? a : quickSort(a.slice(1).filter(item => item <= a[0])).concat(a[0], quickSort(a.slice(1).filter(item => item > a[0])));
}
console.log(quickSort([2,3,5,4,6,8,9,10]));