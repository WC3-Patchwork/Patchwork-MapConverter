"use strict";
import a from "./module1/module1";
import { program } from "commander";
import {NAME, DESCRIPTION, VERSION} from "./metadata";

program.name(NAME).version(VERSION).description(DESCRIPTION);
program.parse();
console.log("This is a: ", a)