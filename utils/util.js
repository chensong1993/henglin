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

//手机号正则
const isPhoneNum =phone =>{
  const telRegex = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;//"[1]"代表第1位为数字1，"[35678]"代表第二位可以为3、4、5、8中的一个，"\\d{9}"代表后面是可以是0～9的数字，有9位。
  if (!telRegex.test(phone))
    return false;
  else
    return telRegex.test(phone);
}

//身份证正则
const isIdcard = idCard =>{
  const telRegexs = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

  if (!telRegexs.test(idCard))
    return false;
  else
    return telRegexs.test(idCard);

}

module.exports = {
  formatTime: formatTime,
  isPhoneNum: isPhoneNum,
  isIdcard: isIdcard
}
