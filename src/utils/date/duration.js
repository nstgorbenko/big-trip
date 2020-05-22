import {addZero} from "../common.js";
import moment from "moment";

export const getDuration = (endTime, startTime = 0) => {
  const duration = moment.duration(endTime - startTime);

  const days = duration.days() ? `${addZero(duration.days())}D` : ``;
  const hours = duration.hours() ? ` ${addZero(duration.hours())}H` : ``;
  const minutes = duration.minutes() ? ` ${addZero(duration.minutes())}M` : ``;

  return `${days}${hours}${minutes}`;
};
