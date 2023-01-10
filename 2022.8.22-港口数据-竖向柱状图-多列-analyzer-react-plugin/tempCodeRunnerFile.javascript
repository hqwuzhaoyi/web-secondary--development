let arr = ["2022-12-31", "2023-01-01", "2023-01-01", "2023-01-01"];
let index = arr.indexOf("2022-12-31");
let num = 0;
while (index !== -1) {
   num++;
}
console.log("总共出现的次数为" + num);