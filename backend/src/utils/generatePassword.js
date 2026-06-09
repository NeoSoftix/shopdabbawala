import crypto from "crypto";

const passwordGenerator = (length = 12) => {
const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const lower = "abcdefghijklmnopqrstuvwxyz"
const number = "1234567890"
const symbols = "!@#$%^&*()_+=[]{}<>?"

const all = upper + lower + number + symbols 

let password = "";

password += upper[crypto.randomInt(0, upper.length)]
password += lower[crypto.randomInt(0, lower.length)]
password += number[crypto.randomInt(0, number.length)]
password += symbols[crypto.randomInt(0, symbols.length)]

for (let i = password.length; i < length; i++) {
  password += all[crypto.randomInt(0,all.length)]
}

return password
  .split("")
  .sort(() => crypto.randomInt(0,2)- 0.5)
  .join("");
};

export default passwordGenerator;