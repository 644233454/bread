const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//取倒计时（天时分秒）
function getTimeLeft(datetimeTo){
  // 计算目标与现在时间差（毫秒）
  let time1 = new Date(datetimeTo).getTime();
  let time2 = new Date().getTime();

  let mss = time1 - time2;
  if(mss <=0){
    return "0天0时0分0秒";
  }
   
  // 将时间差（毫秒）格式为：天时分秒
  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = parseInt((mss % (1000 * 60)) / 1000);
   
  return days + "天" + hours + "时" + minutes + "分" + seconds + "秒"
}

function dateToString(date){
  var year = date.getFullYear();
  var month =(date.getMonth() + 1).toString();
  var day = (date.getDate()).toString();
  if (month.length == 1) {
      month = "0" + month;
  }
  if (day.length == 1) {
      day = "0" + day;
  }
  var hours = date.getHours().toString();
  if(hours.length == 1){
      hours = "0" + hours;
  }
  var mintus = date.getMinutes().toString();
  if(mintus.length == 1){
      mintus = "0" + mintus;
  }
  var second = date.getSeconds().toString();
  if(second.length == 1){
      second = "0" + second;
  }

  var dateTime = year + "-" + month + "-" + day + " " + hours + ":" +  mintus + ":" + second;
  return dateTime;
}

module.exports = {
  formatTime: formatTime,
  getTimeLeft: getTimeLeft,
  dateToString: dateToString
}
