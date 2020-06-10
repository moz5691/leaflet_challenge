const getColor = (d) => {
  return d >= 10 ?
    "#FF0000" :
    d >= 9 ?
    "#FF3300" :
    d >= 8 ?
    "#FF6600" :
    d >= 7 ?
    "#FF9900" :
    d >= 6 ?
    "#FFBB00" :
    d >= 5 ?
    "#FFEE00" :
    d >= 4 ?
    "#DDFF00" :
    d >= 3 ?
    "#FFEDA0" :
    d >= 2 ?
    '#AAFF00' :
    '#77FF00';
}

export {
  getColor as
  default
};