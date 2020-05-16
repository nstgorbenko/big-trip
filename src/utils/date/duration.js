import {addZero} from "../common.js";
import moment from "moment";

export const getDuration = (startTime, endTime) => {
  const duration = moment.duration(endTime - startTime);
  let result = ``;

  result += duration.days() ? `${addZero(duration.days())}D` : ``;
  result += duration.hours() ? ` ${addZero(duration.hours())}H` : ``;
  result += duration.minutes() ? ` ${addZero(duration.minutes())}M` : ``;

  return result;
};
