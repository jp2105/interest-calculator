import CryptoJS from "crypto-js";
const secretKey = "Devashish Advice Invesmesnt";

export const encryptStraing = (planString) => {
  var ciphertext = CryptoJS.AES.encrypt(planString, secretKey).toString();
  return ciphertext;
}

export const decryptStraing = (ciphertext) => {
  var bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export const payoutDate = (date) => {
  let today = new Date();
  let tempDate = new Date(date);
  while (true) {
    tempDate.setDate(tempDate.getDate() + 37);
    if (today.getTime() > tempDate.getTime()) {
    } else if (tempDate.getTime() > today.getTime()) {
      break;
    } else {
      break;
    }
  }
  return tempDate.toDateString();
}

export const TotalCapital = (data) => {
  let total = 0;
  data.map(obj=>{
    if(obj.type==="credit"){
      total = total + parseInt(obj.amount);
    }else{
      total = total - parseInt(obj.amount);
    }
    return true;
  })
  return total;
}