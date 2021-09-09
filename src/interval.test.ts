import {Interval} from "./Interval";

const k = new Interval([0, 200], 1000);
console.log(k.include(300));
