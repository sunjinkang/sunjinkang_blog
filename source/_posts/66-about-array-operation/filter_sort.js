// 去重
var array = [];
for (var i = 0; i < 10000; i++) {
  array.push(Math.floor(Math.random() * (100 - 1)) + 1);
}
console.log(array);

// // 1
// function uniq1(array){
//   var start = new Date().getTime();
//   var temp = [];
//   for(var i = 0; i < array.length; i++){
//       if(temp.indexOf(array[i]) == -1){
//           temp.push(array[i]);
//       }
//   }
//   var end = new Date().getTime();
//   console.log(`1: ${temp}`);
//   console.log(end - start);
// };
// uniq1(JSON.parse(JSON.stringify(array)));

// // 2
// function uniq2(array){
//   var start = new Date().getTime();
//   var temp = {}, result = [], len = array.length, val, type;
//   for (var i = 0; i < len; i++) {
//       val = array[i];
//       type = typeof val;
//       if (!temp[val]) {
//           temp[val] = [type];
//           result.push(val);
//       } else if (temp[val].indexOf(type) < 0) {
//           temp[val].push(type);
//           result.push(val);
//       }
//   }
//   var end = new Date().getTime();
//   console.log(`2: ${result}`);
//   console.log(end - start);
// };
// uniq2(JSON.parse(JSON.stringify(array)));

// // 3
// function uniq3(array){
//   var start = new Date().getTime();
//   array.sort();
//   var temp=[array[0]];
//   for(var i = 1; i < array.length; i++){
//       if( array[i] !== temp[temp.length-1]){
//           temp.push(array[i]);
//       }
//   }
//   var end = new Date().getTime();
//   console.log(`3: ${temp}`);
//   console.log(end - start);
// };
// uniq3(JSON.parse(JSON.stringify(array)));

// // 4
// function uniq4(array){
//   var start = new Date().getTime();
//   var temp = [];
//   for(var i = 0; i < array.length; i++) {
//       if(array.indexOf(array[i]) == i){
//           temp.push(array[i])
//       }
//   }
//   var end = new Date().getTime();
//   console.log(`4: ${temp}`);
//   console.log(end - start);
// };
// uniq4(JSON.parse(JSON.stringify(array)));

// // 5
// function uniq5(array){
//   var start = new Date().getTime();
//   var temp = [];
//   var index = [];
//   var l = array.length;
//   for(var i = 0; i < l; i++) {
//       for(var j = i + 1; j < l; j++){
//           if (array[i] === array[j]){
//               i++;
//               j = i;
//           }
//       }
//       temp.push(array[i]);
//       index.push(i);
//   }
//   var end = new Date().getTime();
//   console.log(`5: ${temp}`);
//   console.log(end - start);
// };
// uniq5(JSON.parse(JSON.stringify(array)));

// // 6
// function uniq6(array){
//   var start = new Date().getTime();
//   var result = [...new Set(array)];
//   var end = new Date().getTime();
//   console.log(`6: ${result}`);
//   console.log(end - start);
// }
// uniq6(JSON.parse(JSON.stringify(array)));

// // 7
// function uniq7(arr){
//   var start = new Date().getTime();
//   var i, j, len = arr.length;
//   for(i = 0; i < len; i++){
//     for(j = i + 1; j < len; j++){
//       if(arr[i] == arr[j]){
//         arr.splice(j,1);
//         len--;
//         j--;
//       }
//     }
//   }
//   var end = new Date().getTime();
//   console.log(`7: ${arr}`);
//   console.log(end - start);
// };
// uniq7(JSON.parse(JSON.stringify(array)));



// 排序
// 1.sort
// function sort1(array) {
//   var start = new Date().getTime();
//   array.sort(function(a,b) {
//     return a - b;//升序
//     // return b - a;//降序
//   })
//   var end = new Date().getTime();
//   console.log(array);
//   console.log(end - start);
// };
// sort1(JSON.parse(JSON.stringify(array)));

// // 2.冒泡排序
// function sort2(array) {
//   var start = new Date().getTime();
//   var b=0//设置用来调换位置的值
//   for(var i=0;i<array.length;i++){
//       for(var j=0;j<array.length;j++){
//           if(array[j]>array[j+1]){
//               b=array[j]
//               array[j]=array[j+1]
//               array[j+1]=b
//           }
//       }
//   }
//   var end = new Date().getTime();
//   console.log(array);
//   console.log(end - start);
// };
// sort2(JSON.parse(JSON.stringify(array)));

// // 3.选择排序
// function sort3(array) {
//   var start = new Date().getTime();
//   for(var i = 0; i < array.length - 1; i++){
//   　　for(var j = i + 1; j < array.length; j++){
//   　　　　if(array[i] > array[j]){
//   　　　　　　var tmp = array[i];
//   　　　　　　array[i] = array[j];
//   　　　　　　array[j] = tmp;
//   　　　　}
//   　　}
//   }
//   var end = new Date().getTime();
//   console.log(array);
//   console.log(end - start);
// };
// sort3(JSON.parse(JSON.stringify(array)));

// // 4.快速排序
// function quick(array) {
//   if (array.length<=1){return array}
//   var middleIndex = Math.floor(array.length / 2);
//   var middle = array.splice(middleIndex,1)[0];
//   var leftArr = [];
//   var rightArr = [];
//   for (var i = 0; i < array.length; i++) {
//       if (array[i] <= middle) {
//           leftArr.push(array[i])
//       } else if (array[i] > middle) {
//           rightArr.push(array[i])
//       }
//   }
//   return quick(leftArr).concat([middle],quick(rightArr))
// };
// function sort4(array) {
//   var start = new Date().getTime();
//   var result = quick(array);
//   var end = new Date().getTime();
//   console.log(result);
//   console.log(end - start);
// };
// sort4(JSON.parse(JSON.stringify(array)));

// 5.归并排序
// function merge(left,right){
//   let result = [];
//   while(left.length >0 && right.length > 0){
//       if(left[0]<right[0]){
//           result.push(left.shift());
//       }else{
//           result.push(right.shift());
//       }
//   }
//   return result.concat(left).concat(right);
// }
// function mergeSort(arr){
//   if(arr.length == 1){
//     return arr;
//   }
//   let mid = Math.floor(arr.length/2);
//   let left_arr = arr.slice(0,mid);
//   let right_arr = arr.slice(mid);
//   return merge(mergeSort(left_arr),mergeSort(right_arr));
// }
// function sort5(array) {
//   var start = new Date().getTime();
//   var result = mergeSort(array);
//   var end = new Date().getTime();
//   console.log(result);
//   console.log(end - start);
// };
// sort5(JSON.parse(JSON.stringify(array)));

// 6.插入排序
function sort6(array) {
  var start = new Date().getTime();
  let len = array.length;
  let preIndex, current;
  for (let i = 1; i < len; i++) {
    preIndex = i - 1;
    current = array[i];
    while (preIndex >= 0 && current < array[preIndex]) {
      array[preIndex + 1] = array[preIndex];
      preIndex--;
    }
    array[preIndex + 1] = current;
  }
  var end = new Date().getTime();
  console.log(array);
  console.log(end - start);
};
sort6(JSON.parse(JSON.stringify(array)));

// 7.桶排序
function bucketSort(arr,bucketCount){
  result = []
  minValue = arr[0]
  maxValue = arr[0]
  for(let i=0;i<arr.length;i++){
      if(arr[i]<minValue){
          minValue = arr[i]
      }
      if(arr[i]>maxValue){
          maxValue = arr[i]
      }
  }
  bucketSize = Math.floor((maxValue-minValue)/bucketCount)+1
  bucket = new Array(bucketSize)
  for(let i=0;i<bucket.length;i++){
      bucket[i] = []
  }
  for(let i=0;i<arr.length;i++){
      bucket[Math.floor((arr[i]-minValue)/bucketCount)].push(arr[i])
  }
  for(let i=0;i<bucket.length;i++){
      bucket[i].sort()
      for(let j=0;j<bucket[i].length;j++){
          result.push(bucket[i][j])
      }
  }
  return result;
}
function sort7(array) {
  var start = new Date().getTime();
  var result = bucketSort(array, 100);
  var end = new Date().getTime();
  console.log(result);
  console.log(end - start);
};
sort7(JSON.parse(JSON.stringify(array)));