import CryptoJS from "crypto-js";
import { db } from '../config/firebase';

const secretKey = "Devashish Advice Invesmesnt";
const cycleDays = 37;

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
    tempDate.setDate(tempDate.getDate() + cycleDays);
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
  data.map(obj => {
    if (obj.type === "credit") {
      total = total + parseInt(obj.amount);
    } else {
      total = total - parseInt(obj.amount);
    }
    return true;
  })
  return total;
}

const intrestByDays = (days, amount, percentage) => {
  let perDayPer = percentage / cycleDays;
  return Math.round((perDayPer * days * amount) / 100)
}

export const payoutAmount = (userData, isRefrence = false) => {
  if (isRefrence) {
    userData.percentage = 1;
  }
  let nextPayoutDate = payoutDate(userData.payout);
  let tempNextPayoutDate = new Date(nextPayoutDate);
  let previousPayoutDate = new Date(tempNextPayoutDate.setDate(tempNextPayoutDate.getDate() - cycleDays));
  let transaction = userData?.transaction;
  transaction = transaction?.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  let oldCapital = [];
  let newCapital = [];
  for (let i = 0; i < transaction?.length; i++) {
    let tempDate = new Date(transaction[i].date);
    if (previousPayoutDate.getTime() > tempDate.getTime()) {
      oldCapital.push(transaction[i])
    } else if (previousPayoutDate.getTime() < tempDate.getTime()) {
      newCapital.push(transaction[i])
    } else {
      oldCapital.push(transaction[i])
    }
  }
  let oldTotalCapital = TotalCapital(oldCapital);

  let finalObj = [];

  if (newCapital.length) {
    for (let i = 0; i < newCapital?.length; i++) {
      let obj = {};
      let tempObj = newCapital[i];
      let diffDays = 0
      if (tempObj.type === 'credit') {
        diffDays = parseInt((new Date(nextPayoutDate) - new Date(tempObj.date)) / (1000 * 60 * 60 * 24), 10);
      } else {
        diffDays = Math.abs(parseInt((new Date(previousPayoutDate) - new Date(tempObj.date)) / (1000 * 60 * 60 * 24), 10));
        oldTotalCapital = oldTotalCapital - tempObj.amount
      }
      obj = {
        capital: tempObj.amount,
        days: diffDays,
        interest: intrestByDays(diffDays, tempObj.amount, userData.percentage)
      }
      
      finalObj.push(obj)
      if (oldTotalCapital) {
        let obj = {
          capital: oldTotalCapital,
          days: cycleDays,
          interest: intrestByDays(cycleDays, oldTotalCapital, userData.percentage)
        }
        finalObj.push(obj)
      }
    }
  }
  let finalTotal = 0;
  finalObj?.map(i => finalTotal = i.interest + finalTotal)
  return {
    total: finalTotal,
    breakout: finalObj,
    username: userData.username
  }
}

export const finalPayoutAmount = (userData) => {
  return new Promise(async (resolve, reject) => {
    let objArr = [];

    objArr.push(payoutAmount(userData));
    if (userData?.reference) {
      const { reference } = userData;

      await Promise.all(
        reference.map(async (item, index) => {
          const documentRef = db.collection('users').doc(item);
          let doc = await documentRef.get();

          if (doc.exists) {
            const data = doc.data();
            let temp = payoutAmount(data, true);
            objArr.push(temp);
          }
        })
      );
    }
    resolve(objArr);
  });
};