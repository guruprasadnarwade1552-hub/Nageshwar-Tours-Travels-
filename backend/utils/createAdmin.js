import bcrypt from "bcrypt";

import {

createAdmin

}

from "../models/adminModel.js";

const username="admin";

const email="admin@nageswar.com";

const password="Admin@123";

const hashed=

await bcrypt.hash(password,10);

await createAdmin(

username,

email,

hashed

);

console.log("Admin Created");