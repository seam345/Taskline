import moment from "moment";

const MomentJsHelper = {
  toMyDate(date) {
    return {
      day: date.date(),
      month: date.month(),
      year: date.year(),
      weekDay: date.day(),
      isoDate: this.momentUTCFormat(date),
      date: date.clone()
    };
  },
  momentUTCFormat(momentDate) {
    let utcFormatStringDate = momentDate.utc().format();
    momentDate.local();
    return utcFormatStringDate;
  },
  updateTaskPositionModsTask(task, startDate, dayWidth) {
    // console.log("GanttChart.vue taskPositionHelper: ++++++++++++++++++++++++++++++++++++++++");
    // console.log(moment(task.startDate).diff(startDate, "days"));
    task.left = moment(task.startDate).diff(startDate, "days") * dayWidth;

    // console.log(moment(task.endDate).diff(task.startDate, "days"));
    task.width =
      (moment(task.endDate).diff(task.startDate, "days") + 1) * dayWidth;
  }
};

export { MomentJsHelper };
