<template>
    <div class="parent">
        <div
          v-for="(specification, index) in listSpecification"
          :key="specification.id"
        >
            <label>
                {{ specification.name }}
                <!--TODO i want to change the listSelected to send the value as the 3rd parameter-->
                <select
                  v-model="specification.currentlySelected"
                  @change="
            listSelected(specification, index, specification.currentlySelected)
          "
                >
                    <option
                      v-if="index === 0"
                      disabled
                      value=""
                    >Please select one
                    </option>
                    <option
                      value=""
                      disabled
                      hidden
                    >Select to narrow results
                    </option>
                    <option
                      v-if="index !== 0"
                      value="ClearResults"
                    >Select to clear filter
                    </option>
                    <option
                      v-for="item in specification.displayList"
                      :key="item.id"
                      :value="item.id"
                    >
                        {{ item.name }}
                    </option>
                </select>
            </label>
        </div>
        <button @click="shuffle()">shuffle</button>
        <div style="float: left; height: 100%; width: 30%">
            <div
              v-for="(task, index) of datelessTasks"
              :key="task.id"
              class="task__drag-and-drop moveCursor"
              @mousedown="mouseDragTask($event, task, index)"
            >
                <!--:style="taskStyle(task)"-->
                <span class="task-chip disable-select">{{ task.name }}</span>
            </div>
        </div>
        <div
          class="gantt-chart"
          style="position: absolute; left: 30%; height: calc( 100% - 65px) ; width: 70%"
        >
            <div
              id="gantt-chart-encased"
              class="wrapper"
            >
                <div
                  class="full_width"
                  id="gantt-chart-wrapper"
                  :class="{ width: dates.length * widthDay + 'px' }"
                  :style="translate"
                  @wheel="scrollDetected($event)"
                >
                    <!--:style.transform="'translate3d(' + this.moveRight + 'px, 0px, 0px)'"-->
                    <!--(mousewheel)="test($event)"
                                                                                                          (panstart)="mousedown($event)"
                                                                                                          (panmove)="arrrrr($event)"
                                                                                                          (panend)="mouseUp($event)"
                                                                                                          (panleft)="onPanLeft($event)"
                                                                                                          (panright)="onPanRight($event)"-->
                    <!--(touchstart)="mousedown($event)" (touchmove)="arrrrr($event)"
                                                                                                            (touchend)="mouseUp($event)"-->
                    <!--(mousedown)="mousedown($event)"
                                                                                                            (mouseup)="mouseUp($event)"
                                                                                                            (mousemove)="arrrrr($event)"-->
                    <div class="background">
                        <ul>
                            <li
                              v-for="date in dates"
                              :key="date.isoDate"
                              style="width: 50px;"
                              :class="{ today: date.date.isSame(today) }"
                              class="temp"
                            ></li>
                        </ul>
                    </div>
                    <div class="dates">
                        <ul>
                            <li
                              v-for="date in dates"
                              :key="date.isoDate"
                              style="width: 50px;"
                            >
                                {{ date.day }}
                                <span
                                  v-if="date.weekDay === 1"
                                  class="day"
                                ><br/>Mon</span>
                                <span
                                  v-if="date.day === 1"
                                  class="month"
                                >{{ monthNames[date.month] }}
                  <span
                    v-if="date.year !== myToday.year"
                  >'{{ date.year.toString().substr(-2) }}</span
                  ></span
                                >
                            </li>
                        </ul>
                    </div>
                    <div
                      class="task_container"
                      :style="fullWidth"
                    >
                        <transition-group
                          id="task-group"
                          name="task-groups"
                          tag="div"
                          :style="taskContainerStyle"
                        >
                            <div
                              v-for="(taskGroup, index) in taskGroups"
                              :key="taskGroup.id"
                              class="task_full_width"

                              @mouseover="mouseTaskGroupOver($event, index)"
                              @mouseout="mouseTaskGroupLeave($event, index)"
                            >
                                <div
                                  v-for="task of taskGroup.tasks"
                                  :key="task.id"
                                  class="task"
                                  :style="{ width: task.width + 'px', left: task.left + 'px' }"
                                  @mousedown="mouseDownTask($event, task)"
                                >
                                    <!--:style="taskStyle(task)"-->
                                    <span class="task-chip disable-select">{{ task.name }}</span>
                                    <div
                                      class="start-date-chip"
                                      @mousedown="mouseDownStartDate($event, task)"
                                    >
                                        <i
                                          class="material-icons start-date-chip__icon disable-select"
                                        >chevron_left</i
                                        >
                                    </div>
                                    <div
                                      class="end-date-chip"
                                      @mousedown="mouseDownEndDate($event, task)"
                                    >
                                        <i
                                          class="material-icons end-date-chip__icon disable-select"
                                        >chevron_right</i
                                        >
                                    </div>
                                    <!--<mat-chip
                                                                                                                                                                                        [matTooltip]="task.name"
                                                                                                                                                                                        matTooltipPosition="below"
                                                                                                                                                                                        class="task-chip"
                                                                                                                                                                                        color="primary"
                                                                                                                                                                                        (mousedown)="draggingTask = true; mouseDown($event, task);"
                                                                                                                                                                                      >
                                                                                                                                                                                          {{task.name}}
                                                                                                                                                                                      </mat-chip>-->
                                    <!-- <mat-chip
                                                                                                                                                                                         class="start-date-chip"
                                                                                                                                                                                         (mousedown)="draggingStartDate = true; mouseDown($event, task);"
                                                                                                                                                                                       >
                                                                                                                                                                                           <mat-icon>chevron_left</mat-icon>
                                                                                                                                                                                       </mat-chip>
                                                                                                                                                                                       <mat-chip
                                                                                                                                                                                         class="due-date-chip"
                                                                                                                                                                                         (mousedown)="draggingDueDate = true; mouseDown($event,task);"
                                                                                                                                                                                       >
                                                                                                                                                                                           <mat-icon>chevron_right</mat-icon>
                                                                                                                                                                                       </mat-chip>-->
                                </div>
                            </div>
                        </transition-group>
                    </div>
                </div>
            </div>
            <!--Both positioned after so I dont need to use the z-index-->
            <transition name="fade-in">
                <div
                  v-show="draggingSomething"
                  id="fast-backwards"
                  class="speed-indicator"
                  @mouseover="mouseOverScroller(-5)"
                  @mouseout="mouseLeaveScroller()"
                >
                    <span class="speed-indicator__span">Fast</span>
                </div>
            </transition>
            <transition name="fade-in">
                <div
                  v-show="draggingSomething"
                  id="slow-backwards"
                  class="speed-indicator"
                  @mouseover="mouseOverScroller(-1)"
                  @mouseout="mouseLeaveScroller()"
                >
                    <span class="speed-indicator__span">Slow</span>
                </div>
            </transition>
            <transition name="fade-in">
                <div
                  v-show="draggingSomething"
                  id="slow-forwards"
                  class="speed-indicator"
                  @mouseover="mouseOverScroller(1)"
                  @mouseout="mouseLeaveScroller()"
                >
                    <span class="speed-indicator__span">Slow</span>
                </div>
            </transition>
            <transition name="fade-in">
                <div
                  v-show="draggingSomething"
                  id="fast-forwards"
                  class="speed-indicator"
                  @mouseover="mouseOverScroller(5)"
                  @mouseout="mouseLeaveScroller()"
                >
                    <span class="speed-indicator__span">Fast</span>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
  // Date rules
  // moment objects are always left in their local setting, use helper functions to get any utc value to guarantee no accidental utc setting
  // all ISO dates are to be in UTC time
  import {RestTrello} from "../services/restTrello";
  import {MomentJsHelper} from "../services/HelperDate";
  import {TaskHelper} from "../services/HelperRandom";
  import {TokenService} from "../services/storageToken";
  // import moment from "moment";

  const moment = require("moment-timezone");
  export default {
    name:     "GanttChart",
    data()
    {
      return {
        listSpecification:    [],
        today:                moment,
        startDate:            moment,
        endDate:              moment,
        moveRight:            Number,
        moveDown:             Number,
        dates:                [],
        taskGroups:           [],
        draggingTask:         Boolean,
        draggingStartDate:    Boolean,
        draggingDueDate:      Boolean,
        movingTask:           Boolean,
        draggingSomething:    false,
        taskClicked:          {},
        datelessTasks:        [],
        movingTaskEl:         {},
        widthDay:             Number,
        indexInsert:          Number,
        taskGroupAboveHeight: Number,
        elementAbove:         Element
      };
    },
    created()
    {
      console.log('creating');
      console.log(!TokenService.getToken());
      console.log(TokenService.getToken());
      if (!TokenService.getToken())
      {
        console.log('changing url');
        window.location.href = process.env.VUE_APP_HOST_URL + '/login';

      }
      this.monthNames        = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      this.listSpecification = RestTrello.getListDetails();
      this.draggingTask      = false;
      this.draggingStartDate = false;
      this.draggingDueDate   = false;
      this.movingTask        = false;
      this.draggingSomething = false;
      this.widthDay          = 50;
      this.indexInsert       = -1;
      this.moveRight         = this.widthDay * ( 75 - 5 ) * -1;
      this.moveDown          = 0;

      for (let i = 0; i < this.listSpecification.length; i++)
      {
        if ( i === 0 )
        {
          //todo Does i remain constant when it returns
          this.listSpecification[i].populateFunction().then(response =>
          {
            this.listSpecification[i].displayList = this.listSpecification[
                i
                ].displayList.concat(response);
          });
        }
      }

      moment.tz.setDefault(moment.tz.guess());

      this.today = moment();
      this.today.startOf("day");
      console.log(this.today.format());
      console.log(MomentJsHelper.momentUTCFormat(this.today));
      console.log(this.today.format());
      console.log(this.today.date());
      console.log(this.today.month());
      console.log(this.today.year());
      this.myToday   = {
        day:     this.today.date(),
        month:   this.today.month(),
        year:    this.today.year(),
        weekDay: this.today.day(),
        date:    new moment(this.today)
      };
      // this.startDate = new Date(this.today.toISOString());
      this.startDate = this.today.clone().subtract(75, "days");
      // this.startDate.setDate(this.startDate.getDate() - 75);
      // this.endDate = new Date(this.today.toISOString());
      this.endDate = this.today.clone().add(125, "days");
      // this.endDate.setDate(this.endDate.getDate() + 125);
      console.log(this.today.format());
      console.log(this.startDate.format());
      console.log(this.endDate.format());
      this.dates = this.buildCalendar();
      console.log(this.dates);
    },
    computed: {
      translate()
      {
        return "transform: translate3d(" + this.moveRight + "px, 0px, 0px); ";
      },
      taskContainerStyle()
      {
        return "transform: translate3d( 0px, " + this.moveDown + "px, 0px); ";
      },
      fullWidth()
      {
        return "width: " + this.dates.length * this.widthDay + "px; ";
      },
      ganttChartLeftOffset()
      {
        let startOfGantChartElement = this.getOffsetLeft(
            document.getElementById("gantt-chart-wrapper")
        );
        return startOfGantChartElement + this.moveRight;
      },
      ganttChartWidth()
      {
        let element = document.getElementById("gantt-chart-encased");
        return element.offsetWidth;

      },
      ganttChartHeight()
      {
        let element = document.getElementById("gantt-chart-encased");
        return element.offsetHeight;
      },
      taskTopOffset()
      {
        let startOfGantChartElement = this.getOffsetTop(
            document.getElementById("task-group")
        );
        return startOfGantChartElement + this.moveDown;
      },


    },
    methods:  {
      shuffle()
      {
        console.log(
            RestTrello.getStartDate("5c98b731bf624d79b75d691a").then(result =>
            {
              console.log(result);
            })
        );

        // this.taskGroups = _.shuffle(this.taskGroups);
      },
      sort()
      {
        this.taskGroups.sort(function (a, b)
        {
          return TaskHelper.comparisonTaskGroup(a, b);
        });
      },
      listSelected(specification, index, selectedValue)
      {
        console.log();
        if ( selectedValue === "ClearResults" )
        {
          console.log(
              "clear Results ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
          );
          console.log(specification.name);
          specification = this.listSpecification[index - 1];
          console.log(specification.name);
          console.log(
              "clear Results ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
          );
        }
        if ( specification.getItemsFunction != null )
        {
          // this selection can generate Gantt chart items
          specification
              .getItemsFunction(specification.currentlySelected)
              .then(response =>
              {
                console.log(
                    "GanttChart.vue  list selected get items return @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
                );
                console.log(response);
                this.taskGroups    = [];
                this.datelessTasks = [];
                for (let i = 0; i < response.length; i++)
                {
                  let taskGroup = {id: response[i].id, tasks: []};
                  for (let j = 0; j < response[i].tasks.length; j++)
                  {
                    if (
                        response[i].tasks[j].startDate != null &&
                        response[i].tasks[j].endDate != null
                    )
                    {
                      MomentJsHelper.updateTaskPositionModsTask(
                          response[i].tasks[j],
                          this.startDate,
                          this.widthDay
                      );
                      taskGroup.tasks.push(response[i].tasks[j]);
                    } else
                    {
                      this.datelessTasks.push(response[i].tasks[j]);
                    }
                  }
                  if ( taskGroup.tasks.length > 0 )
                  {
                    this.taskGroups.push(taskGroup);
                  }
                }
                this.sort();
              });
        }
        if ( this.listSpecification[index + 1] != null )
        {
          // there is a child list that can narrow down the Gantt chart items
          this.listSpecification[index + 1]
              .populateFunction(specification.currentlySelected)
              .then(response =>
              {
                // this.listSpecification[index + 1].displayList = this.listSpecification[index + 1].displayList.concat(response);
                this.listSpecification[index + 1].displayList = response;
              });
        }
        console.log("listSelected @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log("hey");
        console.log(specification);
        console.log(index);
        console.log(selectedValue);
        console.log(specification.currentlySelected);
        console.log("listSelected @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      },
      buildCalendar()
      {
        const dateArray   = [];
        const currentDate = this.startDate.clone(); // new Date otherwise startdate becomes same as end date
        console.log(currentDate.format());
        console.log(this.endDate.format());
        console.log(currentDate.isBefore(this.endDate));
        while (currentDate.isBefore(this.endDate))
        {
          dateArray.push(MomentJsHelper.toMyDate(currentDate));
          currentDate.add(1, "day");
          // currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
      },
      scrollDetected(event)
      {

        if ( event.deltaX !== 0 )
        {
          this.moveRight -= event.deltaX;
        }
        if ( event.deltaY !== 0 )
        {
          this.moveDown -= event.deltaY;
          if (this.moveDown > 0)
          {
            this.moveDown = 0;
          }
          if (this.moveDown < (-1 * (33 * (this.taskGroups.length - 5)))){
            this.moveDown = (-1 * (33 * (this.taskGroups.length - 5)));
          }
        }




        // TODO so I always add elements but don't remove any, it may be useful to remove elements
        if ( this.moveRight > 50 * 30 * -1 )
        {
          // this.startDate.setDate(this.startDate.getDate() - 30);

          const currentDate = this.startDate.clone();

          this.startDate.add(-30, "days");
          this.moveRight = this.moveRight - 50 * 30;

          for (let i = 0; i < 30; i++)
          {
            currentDate.add(-1, "day");
            this.dates.unshift(MomentJsHelper.toMyDate(currentDate));
            // currentDate.setDate(currentDate.getDate() - 1);
          }

          for (let i = 0; i < this.taskGroups.length; i++)
          {
            for (let j = 0; j < this.taskGroups[i].tasks.length; j++)
            {
              this.taskGroups[i].tasks[j].left =
                  this.taskGroups[i].tasks[j].left + 30 * this.widthDay;
            }
          }
        }
        if ( this.moveRight < ( this.dates.length - 30 ) * 50 * -1 )
        {
          const currentDate = this.endDate.clone();

          this.endDate.add(30, "days");

          for (let i = 0; i < 30; i++)
          {
            currentDate.add(1, "day");

            this.dates.push(MomentJsHelper.toMyDate(currentDate));
            // currentDate.setDate(currentDate.getDate() - 1);
          }

            /*  this.endDate.setDate(this.endDate.getDate() + 30);

             const currentDate = this.endDate;
             currentDate.setDate(currentDate.getDate() - 30);

             for (let i = 0; i < 30; i++)
             {
             this.dates.push(this.toMyDate(currentDate));
             currentDate.setDate(currentDate.getDate() + 1);
             }*/

          // this.moveRight = this.moveRight + ; // not needed
        }
        event.stopPropagation();
      },
      unifiedScroll(event)
      {

        let moveAmount       = Math.sqrt(( event.deltaX * event.deltaX ) + ( event.deltaY * event.deltaY ));
        console.log('moveAmount: %d ', moveAmount);
        console.log('event.deltaX: %d, event.deltaY %d',event.deltaX, event.deltaY);
        let overallDirection = event.deltaX + event.deltaY;
        if ( overallDirection < 0 )
        {
          moveAmount *= -1;
        } else if ( overallDirection === 0 )
        {
          moveAmount = 0;
        }

        if ( moveAmount > 0 )
        {
          let furthestRight = ( this.moveRight * -1 ) + this.ganttChartWidth - ( this.widthDay * 2 );
          let furthestDown  = ( this.moveDown * -1 ) + this.ganttChartHeight - ( 33 * 2 );

            /*<editor-fold desc="calculate number of pixels down from the closest task ">*/
          let index      = Math.ceil(furthestDown / 33);
          let amountDown = 0;
          if ( index < this.taskGroups.length )
          { // we have a task more down than past the furthest down
            amountDown = ( index * 33 ) - furthestDown;
          } else
          {
            index = this.taskGroups.length - 1;
          }
            /*</editor-fold>*/

          let amountRight = 0;
          if ( this.taskGroups[index].tasks[0].left > furthestRight )
          {

            amountRight = this.taskGroups[index].tasks[0].left + this.taskGroups[index].tasks[0].width - furthestRight;
          }

          if (amountRight === 0  && amountDown === 0)
          {
            amountRight = moveAmount;
          }

            /*</editor-fold>*/


          let hypotenuse = Math.sqrt(( amountDown * amountDown ) + ( amountRight * amountRight ));

          let move1X = amountRight / hypotenuse;
          let move1Y = amountDown / hypotenuse;


          this.moveRight -= moveAmount * move1X;
          this.moveDown -= moveAmount * move1Y;
        } else
        {
          let furthestLeft = ( this.moveRight * -1 ) + ( this.widthDay * 2 );
          let furthestUp   = ( this.moveDown * -1 ) + ( 33 * 2 );

            /*<editor-fold desc="calculate number of pixels down from the closest task ">*/
          let index      = Math.floor(furthestUp / 33);
          let amountDown = 0;
          if ( index > 0 )
          { // we have a task more down than past the furthest down
            amountDown = furthestUp - ( index * 33 );
          } else
          {
            index = 1;
          }
            /*</editor-fold>*/

            /*<editor-fold desc="calculate number of pixels right from the closest task ">*/
          let amountRight = 0;
          if (furthestLeft >  this.taskGroups[index].tasks[0].left )
          {
            amountRight     = furthestLeft - this.taskGroups[index].tasks[0].left;
          }
          if (amountRight === 0  && amountDown === 0)
          {
            amountRight = -moveAmount;
          }
            /*</editor-fold>*/


          let hypotenuse = Math.sqrt(( amountDown * amountDown ) + ( amountRight * amountRight ));

          let move1X = amountRight / hypotenuse;
          let move1Y = amountDown / hypotenuse;


          this.moveRight -= moveAmount * move1X;
          this.moveDown -= moveAmount * move1Y;
        }




        // TODO so I always add elements but don't remove any, it may be useful to remove elements
        if ( this.moveRight > 50 * 30 * -1 )
        {
          // this.startDate.setDate(this.startDate.getDate() - 30);

          const currentDate = this.startDate.clone();

          this.startDate.add(-30, "days");
          this.moveRight = this.moveRight - 50 * 30;

          for (let i = 0; i < 30; i++)
          {
            currentDate.add(-1, "day");
            this.dates.unshift(MomentJsHelper.toMyDate(currentDate));
            // currentDate.setDate(currentDate.getDate() - 1);
          }

          for (let i = 0; i < this.taskGroups.length; i++)
          {
            for (let j = 0; j < this.taskGroups[i].tasks.length; j++)
            {
              this.taskGroups[i].tasks[j].left =
                  this.taskGroups[i].tasks[j].left + 30 * this.widthDay;
            }
          }
        }
        if ( this.moveRight < ( this.dates.length - 30 ) * 50 * -1 )
        {
          const currentDate = this.endDate.clone();

          this.endDate.add(30, "days");

          for (let i = 0; i < 30; i++)
          {
            currentDate.add(1, "day");

            this.dates.push(MomentJsHelper.toMyDate(currentDate));
            // currentDate.setDate(currentDate.getDate() - 1);
          }

            /*  this.endDate.setDate(this.endDate.getDate() + 30);

             const currentDate = this.endDate;
             currentDate.setDate(currentDate.getDate() - 30);

             for (let i = 0; i < 30; i++)
             {
             this.dates.push(this.toMyDate(currentDate));
             currentDate.setDate(currentDate.getDate() + 1);
             }*/

          // this.moveRight = this.moveRight + ; // not needed
        }
        // event.stopPropagation();
      },
      stopDrag(e)
      {
        let updateTask = null;
        if ( this.draggingTask )
        {
          this.draggingTask = false;
          // todo should note i noticed that vuejs doesn't see the dates update untill another event, i have recognised this is not a good sign but for now it is ok
          this.incrementTaskDate(
              this.taskClicked.task,
              ( this.taskClicked.task.left - this.taskClicked.originalLeft ) / 50,
              ( this.taskClicked.task.left - this.taskClicked.originalLeft ) / 50
          );
          updateTask       = this.taskClicked.task;
          this.taskClicked = null;
        } else if ( this.draggingDueDate )
        {
          this.draggingDueDate = false;
          this.incrementTaskDate(
              this.taskClicked.task,
              0,
              ( this.taskClicked.task.width - this.taskClicked.originalWidth ) / 50
          );
          updateTask       = this.taskClicked.task;
          this.taskClicked = null;
        } else if ( this.draggingStartDate )
        {
          this.draggingStartDate = false;
          this.incrementTaskDate(
              this.taskClicked.task,
              ( this.taskClicked.task.left - this.taskClicked.originalLeft ) / 50,
              0
          );
          updateTask = this.taskClicked.task;
          console.log(this.taskClicked.task);
          this.taskClicked = null;
        } else if ( this.movingTask )
        {
          this.movingTask = false;

          const draggingTask = document.getElementById("dragging-task");
          document.body.removeChild(draggingTask);

          const outlineTask = document.getElementById("dragging-outline-task");
          document.body.removeChild(outlineTask);

          let chartOffset            = this.ganttChartLeftOffset;
          let startDateOffsetDropped = Math.floor(
              ( e.pageX - chartOffset - this.widthDay / 2 ) / 50
          );
          let startDateDropped       = this.startDate.clone();
          startDateDropped.add(startDateOffsetDropped, "days");
          let endDateDropped = startDateDropped.clone();
          endDateDropped.add(1, "day");

          this.movingTaskEl.task.startDate = MomentJsHelper.momentUTCFormat(
              startDateDropped
          );
          this.movingTaskEl.task.endDate   = MomentJsHelper.momentUTCFormat(
              endDateDropped
          );

          // let newTaskGroup = {id: Math.random(), tasks: []};
          let newTaskGroup = this.taskGroups[this.indexInsert];
          MomentJsHelper.updateTaskPositionModsTask(
              this.movingTaskEl.task,
              this.startDate,
              this.widthDay
          );
          newTaskGroup.tasks.push(this.movingTaskEl.task);
          newTaskGroup.tasks.push();
          // this.taskGroups.splice(this.indexInsert, 1); //remove empty task
          // this.taskGroups.splice(this.indexInsert, 0, newTaskGroup);
          this.indexInsert        = -1;
          this.elementAbove.style = "padding-top: 0px;";

          updateTask        = this.movingTaskEl.task;
          this.movingTaskEl = null;
        }

        if ( updateTask != null )
        {
          RestTrello.updateCardDates(updateTask).then(response =>
          {
            console.log(response);
          });
          const heldThis = this;
          heldThis.sort();
          // setTimeout(function(){ heldThis.sort() }, 500);
          // this.sort();
        }
        this.draggingSomething = false;
        e.preventDefault(); // prevents highlighting text
        e.stopPropagation();
      },
      dragging(e)
      {
          /*<editor-fold desc="todo kinda terrible hack for now">*/
        if ( e != null )
        {
          this.heldE = e;
        } else
        {
          e = this.heldE;
        }
          /*</editor-fold>*/

        if ( this.draggingTask )
        {
          let moved                  =
                  e.pageX -
                  this.taskClicked.mouseOffSet +
                  ( this.taskClicked.originalRight - this.moveRight );
          moved                      = Math.round(moved / 50);
          this.taskClicked.task.left = this.taskClicked.originalLeft + 50 * moved;
        } else if ( this.draggingDueDate )
        {
          let moved                   =
                  e.pageX -
                  this.taskClicked.mouseOffSet +
                  ( this.taskClicked.originalRight - this.moveRight );
          moved                       = Math.round(moved / 50);
          this.taskClicked.task.width =
              this.taskClicked.originalWidth + 50 * moved;
        } else if ( this.draggingStartDate )
        {
          let moved                   =
                  e.pageX -
                  this.taskClicked.mouseOffSet +
                  ( this.taskClicked.originalRight - this.moveRight );
          moved                       = Math.round(moved / 50);
          this.taskClicked.task.width =
              this.taskClicked.originalWidth - 50 * moved;
          this.taskClicked.task.left  = this.taskClicked.originalLeft + 50 * moved;
        } else if ( this.movingTask )
        {
            /*<editor-fold desc="Set position of the floating task">*/
          let style                       =
                  "top:" +
                  e.pageY +
                  "px; " +
                  "left:" +
                  e.pageX +
                  "px; " +
                  "width: " +
                  this.widthDay * 2 +
                  "px";
          this.movingTaskEl.element.style = style;
            /*</editor-fold>*/

          const outlineTask = document.getElementById("dragging-outline-task");

          // let mousePositionOnChartInPixels =  ( e.pageX - startOfGantChart ) + ( this.moveRight * -1 );
          // let dateOffset = Math.floor((( mousePositionOnChartInPixels)-(this.widthDay/2)) / 50);
          // let outlineTaskPageX = (dateOffset * 50 - ( this.moveRight * -1 )) + startOfGantChart;

          // I do half a day width because it gave it a much more natural positioning when the task was 2 days.
          // IDK if this will change when its greater than a 2 day task
          // TODO Test different task sizes and maybe allow it as a user preference
          let chartOffset = this.ganttChartLeftOffset;
          console.log(chartOffset);


          const outlineTaskLeft = Math.floor(( e.pageX - chartOffset - this.widthDay / 2 ) / 50) * 50;

          let outlineTaskPageX =
                  outlineTaskLeft +
                  chartOffset;

          let outlineTaskPageY = e.pageY;
          try
          {
            // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ hjbdahbadhb3h');
            // console.log('length: %d, insert: %d', this.taskGroups.length, this.indexInsert);
            let emptyTaskGroup = {
              id:    Math.random(),
              tasks: []
            };
            if ( this.indexInsert !== -1 )
            {
              // console.log('########################################################');
              // console.log(outlineTaskLeft);
              // console.log('########################################################');
              try
              {

                if ( !TaskHelper.dirtyComputeTaskPositionCheck(outlineTaskLeft, this.taskGroups, this.indexInsert) )
                {
                  emptyTaskGroup   = this.taskGroups.splice(this.indexInsert, 1)[0];
                  this.indexInsert = -1;
                } else
                {
                  outlineTaskPageY = this.indexInsert * 33 + this.taskTopOffset;
                }
              } catch (e)
              {
                // console.log('defgnhmdadjbasjdbe');
                // console.log(e);
              }
              // console.log('length: %d, insert: %d', this.taskGroups.length, this.indexInsert);

            }

            if ( this.indexInsert === -1 )
            {
              this.indexInsert = TaskHelper.dirtyComputeTaskPosition(outlineTaskLeft, this.taskGroups);
              // console.log(this.indexInsert);
              // console.log('length: %d, insert: %d', this.taskGroups.length, this.indexInsert);

              this.taskGroups.splice(this.indexInsert, 0, emptyTaskGroup);

              outlineTaskPageY = this.indexInsert * 33 + this.taskTopOffset;
            }
          } catch (e)
          {
            // console.log(e);
          }
          let furthestLeft = ( this.moveRight * -1 ) + this.ganttChartWidth - ( this.widthDay * 2 );
          let furthestDown = ( this.moveDown * -1 ) + this.ganttChartHeight - ( 33 * 2 );
          // console.log(this.ganttChartWidth);
          // console.log(document.getElementById("gantt-chart-encased"));
          // console.log(document.getElementById("gantt-chart-encased").offsetLeft);
          console.log(document.getElementById("gantt-chart-encased").offsetWidth);
          console.log(outlineTaskPageX);
          // console.log(dateOffset);
          const borderSize  = 3;
          const width       = this.widthDay * 2 - borderSize * 2;
          style             =
              "top:" +
              outlineTaskPageY +
              "px; " +
              "left:" +
              outlineTaskPageX +
              "px; " +
              "width: " +
              width +
              "px; " +
              "border: solid " +
              borderSize +
              "px white;";
          outlineTask.style = style;
        }
        e.preventDefault(); // helps prevent highlighting text
        e.stopPropagation();
      },
      mouseTaskGroupOver(event, index)
      {
        if ( this.movingTask )
        {
            /*  let element = event.srcElement;
             while (element.className !== "task_full_width") {
             element = element.parentElement; // todo perform checks that im not at root or anything
             }
             console.log(index);
             this.indexInsert = index;
             this.taskGroupAboveHeight = this.getOffsetTop(element);
             this.elementAbove = element;

             element.style = "padding-top: 40px;";*/
        }
      },
      mouseTaskGroupLeave(event)
      {
        if ( this.movingTask )
        {
          // console.log(event);
          // let happenedOnParent = true;
          let element = event.srcElement;
          while (element.className !== "task_full_width")
          {
            // happenedOnParent = false;
            element = element.parentElement; // todo perform checks that im not at root or anything
          }
          element.style = "padding-top: 0;";
        }
      },
      mouseDown(event, task)
      {
        // this.offset      = event.pageX;
        this.taskClicked       = {
          task:          task,
          originalLeft:  task.left,
          originalWidth: task.width,
          originalRight: this.moveRight,
          mouseOffSet:   event.pageX
        };
        this.draggingSomething = true;
        event.preventDefault(); // helps prevent highlighting text
        event.stopPropagation();
      },
      mouseDownTask(event, task)
      {
        this.draggingTask = true;
        this.mouseDown(event, task);
      },
      mouseDownStartDate(event, task)
      {
        this.draggingStartDate = true;
        this.mouseDown(event, task);
      },
      mouseDownEndDate(event, task)
      {
        this.draggingDueDate = true;
        this.mouseDown(event, task);
      },
      mouseDragTask(event, task, index)
      {
        this.draggingSomething = true;
        this.movingTask        = true;
        this.datelessTasks.splice(index, 1); // remove task from array

        const draggingTask = document.createElement("div");
          /*<editor-fold desc="Assigning draggingTask properties">*/
        draggingTask.className = "task__dragging";
        draggingTask.id        = "dragging-task";
        let style              =
                "top:" +
                event.pageY +
                "px; " +
                "left:" +
                event.pageX +
                "px; " +
                "width: " +
                this.widthDay * 2 +
                "px";
        draggingTask.style     = style;
          /*</editor-fold>*/

        this.movingTaskEl = {
          task:    task,
          element: draggingTask
        };

        const draggingTaskSpan = document.createElement("span");
          /*<editor-fold desc="Assigning draggingTaskSpan properties">*/
        draggingTaskSpan.className = "task-chip disable-select";
        draggingTaskSpan.innerText = task.name;
          /*</editor-fold>*/

        draggingTask.appendChild(draggingTaskSpan);
        document.body.appendChild(draggingTask);

        const outlineTask = document.createElement("div");
          /*<editor-fold desc="Assigning OutlineTask Properties">*/
        outlineTask.className = "task__outline";
        outlineTask.id        = "dragging-outline-task";
        const borderSize      = 3;
        const width           = this.widthDay * 2 - borderSize * 2;
        style                 =
            "top:" +
            event.pageY +
            "px; " +
            "left:" +
            event.pageX +
            "px; " +
            "width: " +
            width +
            "px; " +
            "border: solid " +
            borderSize +
            "px white;";
        outlineTask.style     = style;
          /*</editor-fold>*/

        document.body.appendChild(outlineTask);

        event.preventDefault(); // helps prevent highlighting text
        event.stopPropagation();
      },
      // TODO shouldn't edit the task directly i should return a new task
      incrementTaskDate(task, startDateIncrement, endDateIncrement)
      {
        if ( startDateIncrement !== 0 )
        {
          // let dateStartDate = new Date(task.startDate);
          // dateStartDate.setDate(dateStartDate.getDate() + startDateIncrement);
          // task.startDate = dateStartDate.toISOString();
          let momentStartDate = moment(task.startDate);
          momentStartDate.add(startDateIncrement, "days");
          task.startDate = MomentJsHelper.momentUTCFormat(momentStartDate); // momentStartDate.utc().format();
        }
        if ( endDateIncrement !== 0 )
        {
          // let dateEndDate = new Date(task.endDate);
          // dateEndDate.setDate(dateEndDate.getDate() + endDateIncrement);
          // task.endDate = dateEndDate.toISOString();
          let momentEndDate = moment(task.endDate);
          momentEndDate.add(endDateIncrement, "days");
          task.endDate = MomentJsHelper.momentUTCFormat(momentEndDate); // momentEndDate.utc().format();
        }
        // TODO for when i transistion to not edditing passed veriables
          /*let updatedTask = this.taskDuplicator(task);
           if (startDateIncrement !== 0 )
           {
           let dateStartDate = new Date(task.startDate);
           dateStartDate.setDate(dateStartDate.getDate() + startDateIncrement);
           updatedTask.startDate = dateStartDate.toISOString();
           }
           if (endDateIncrement !== 0 )
           {
           let dateEndDate = new Date(task.endDate);
           dateEndDate.setDate(dateEndDate.getDate() + endDateIncrement);
           updatedTask.endDate = dateEndDate.toISOString();
           }
           return updatedTask;*/
      },
      taskDuplicator(task)
      {
        // TODO does a shallow copy if I have a date that's not ISO string in the tasks i will
        //  need to create a deepcopy
        return Object.assign({}, task);
      },
      getOffsetLeft(elem)
      {
        let offsetLeft = 0;
        do
        {
          if ( !isNaN(elem.offsetLeft) )
          {
            offsetLeft += elem.offsetLeft;
          }
        } while (( elem = elem.offsetParent ));
        return offsetLeft;
      },
      getOffsetTop(elem)
      {
        let offsetHeight = 0;
        do
        {
          if ( !isNaN(elem.offsetTop) )
          {
            offsetHeight += elem.offsetTop;
          }
        } while (( elem = elem.offsetParent ));
        return offsetHeight;
      },
      //TODO can probably use css transistions to make this way smoother
      mouseOverScroller(speed)
      {
        // console.log('mouse over scroller(%d) @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', speed);
        const heldThis   = this;
        this.scrollTimer = setInterval(function ()
        {
          console.log('mouseOverScrollerInterval');
          if ( heldThis.draggingTask )
          {
            heldThis.moveRight -= speed * 4;
          } else if ( heldThis.draggingDueDate )
          {
            heldThis.moveRight -= speed * 4;

          } else if ( heldThis.draggingStartDate )
          {
            heldThis.moveRight -= speed * 4;
          } else if ( heldThis.movingTask )
          {
            heldThis.unifiedScroll({deltaX: speed * 4, deltaY: 0})
          }
          // heldThis.moveRight -= speed * 4;
          heldThis.dragging();
        }, 40);
      },
      mouseLeaveScroller()
      {
        // console.log('mouse leave scroller(%d) @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', speed);
        clearInterval(this.scrollTimer);
      }
    },
    mounted()
    {
      window.addEventListener("mouseup", this.stopDrag);
      window.addEventListener("mousemove", this.dragging);
    }
  };
</script>

<style lang="scss">
    .speed-indicator__span {
        color: white;
    }

    $gantt-chart-footer__percent: 5%;
    $speed-indicator-width__pixels: 75px; /*Be aware if changing the type I am doing some arithmetic on these units assuming it is pixel based*/
    .speed-indicator {
        position: absolute;
        background-color: rgba(map-get($main30_green, 500), 0.2);
        height: 100% - $gantt-chart-footer__percent;
        top: 0;
    }

    .speed-indicator__span {
        position: absolute;
        bottom: 0;
        left: 0;
        width: inherit;
        text-align: center;
        color: white;
        /*color: map-get(map-get($main30_green, "contrast"), 500);*/
    }

    #fast-backwards {
        border-right-style: dashed;
        border-right-width: 2px;
        border-right-color: white;
        width: $speed-indicator-width__pixels - 2;
    }

    #slow-backwards {
        width: $speed-indicator-width__pixels;
        left: $speed-indicator-width__pixels;
    }

    #slow-forwards {
        width: $speed-indicator-width__pixels;
        right: $speed-indicator-width__pixels;
    }

    #fast-forwards {
        border-left-style: dashed;
        border-left-width: 2px;
        border-left-color: white;
        width: $speed-indicator-width__pixels - 2;
        right: 0;
    }

    /* always present */
    .fade-in-enter-active {
        transition: opacity 0.5s;
    }

    /* .expand-enter defines the starting state for entering */
    /* .expand-leave defines the ending state for leaving */
    .fade-in-enter {
        opacity: 0;
    }

    .fade-in-enter-to {
        opacity: 1;
    }

    .task-groups-move {
        transition: transform 1s;
    }

    p {
        display: inline-block;
        margin: 0 10px;
        background-color: map-get($main, 50);
    }

    .parent {
        height: 95vh; // little less so that it doesn't create a scroll bar
        width: 95vw;
    }

    .wrapper {
        /*height: calc(100% - 65px);*/
        height: 100% - $gantt-chart-footer__percent;
        overflow: hidden;
        width: 100%;
    }

    .full_width {
        height: 100%;
        position: relative;
    }

    .task_container {
        /*overflow-y: auto;*/
        height: calc(100% - 80px);
        position: absolute;
        top: 50px;
    }

    .task {
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        /*text-overflow: ellipsis;*/

        background-color: map-get($opposing, 600);
        border-radius: 25px;
        height: 30px;

        :hover {
            cursor: ew-resize;
        }

        .task-chip {
            width: 100%;
        }

        mat-chip:hover {
            opacity: 1;
        }
    }

    .task__drag-and-drop {
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        /*text-overflow: ellipsis;*/

        background-color: map-get($opposing, 600);
        border-radius: 25px;
        height: 30px;

        :hover {
            cursor: move;
        }

        .task-chip {
            width: 100%;
        }

        mat-chip:hover {
            opacity: 1;
        }
    }

    .task__dragging {
        /*position: relative;*/
        white-space: nowrap;
        overflow: hidden;
        position: absolute;
        z-index: 2;
        transform: translate(-50%, -50%) rotate(3deg);
        pointer-events: none;
        /*text-overflow: ellipsis;*/

        background-color: map-get($opposing, 600);
        border-radius: 25px;
        height: 30px;

        :hover {
            cursor: grabbing;
        }

        .task-chip {
            width: 100%;
        }

        mat-chip:hover {
            opacity: 1;
        }
    }

    .task__outline {
        white-space: nowrap;
        overflow: hidden;
        position: absolute;
        background: none;
        z-index: 1;
        pointer-events: none;
        /*text-overflow: ellipsis;*/

        border-radius: 25px;
        height: 30px;

        :hover {
            cursor: ew-resize;
        }

        .task-chip {
            width: 100%;
        }

        mat-chip:hover {
            opacity: 1;
        }
    }

    .task-chip {
        top: 5px;
        left: 11px;
        position: relative;
    }

    .start-date-chip {
        width: 30px;
        opacity: 0.1;
        left: 0;
        top: 0;
        margin: 0;
        position: absolute;
        transition: opacity 0.3s;
        background-color: map-get($opposing, 600);
        /*background-color: white;*/
        border-radius: 25px;
        height: 30px;
        box-shadow: 2px 3px 9px 1px #000000c7;
    }

    .start-date-chip:hover {
        opacity: 1;
    }

    .start-date-chip__icon {
        position: relative;
        top: 3px;
        left: 0px;
    }

    .disable-select {
        user-select: none; /* supported by Chrome and Opera */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
    }

    .end-date-chip {
        width: 30px;
        opacity: 0.1;
        left: calc(100% - 30px);
        top: 0;
        margin: 0;
        position: absolute;
        transition: opacity 0.3s;
        background-color: map-get($opposing, 600);
        /*background-color: white;*/
        border-radius: 25px;
        height: 30px;
        box-shadow: -2px 2px 9px 1px #000000c7;
    }

    .end-date-chip:hover {
        opacity: 1;
    }

    .end-date-chip__icon {
        position: relative;
        top: 3px;
        right: -1px;
    }

    .task_full_width {
        display: flex;
        height: 33px;
        /*transition: padding-top 0.1s;*/
    }

    ul {
        white-space: nowrap;
        margin: 0;
        padding: 0;
        height: 100%;
    }

    li {
        display: inline-block;
        text-align: center;
        vertical-align: top;
        height: 100%;
        font-size: 11px;
        font-weight: 400;
        position: relative;
    }

    .month {
        font-size: 30px;
        position: absolute;
        bottom: 15px;
        left: 0;
    }

    .background {
        height: 100%;

        ul {
            li {
                height: 100%;
            }
        }
    }

    .dates {
        position: absolute;
        top: 0;
        height: 100%;

        ul {
            li {
                display: inline-block;
                text-align: center;
                vertical-align: top;
                height: 100%; // calc(100% - 10px); /*-10px to take into account the padding-top*/
                padding-top: 10px;
                font-size: 11px;
                font-weight: 400;
                position: relative;
            }
        }
    }

    .moveCursor {
        cursor: move;
    }

    .grabbingCursor {
        cursor: grabbing;
    }

    // Create theme specfic styles

    .background {
        height: 100%;
        //background-color: aqua;
        ul {
            // Note this means whenever I add columns I need to do it in pairs
            li:nth-child(even) {
                /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#cccccc+0,909090+5,909090+95,cccccc+100 */
                background-color: map-get($main, 800); /* Old browsers */
                //background: -moz-linear-gradient(left, #cccccc 0%, #909090 10%, #909090 90%, #cccccc 100%); /* FF3.6-15 */
                //background: -webkit-linear-gradient(left, #cccccc 0%, #909090 10%, #909090 90%, #cccccc 100%); /* Chrome10-25,Safari5.1-6 */
                //background: linear-gradient(to right, #cccccc 0%, #909090 10%, #909090 90%, #cccccc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
                //filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#cccccc', endColorstr='#cccccc', GradientType=1); /* IE6-9 */
            }

            li:nth-child(odd) {
                /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#cccccc+0,dddddd+10,dddddd+90,cccccc+100 */
                background-color: map-get($main, 900); /* Old browsers */
                //background: -moz-linear-gradient(left, #cccccc 0%, #dddddd 10%, #dddddd 90%, #cccccc 100%); /* FF3.6-15 */
                //background: -webkit-linear-gradient(left, #cccccc 0%,#dddddd 10%,#dddddd 90%,#cccccc 100%); /* Chrome10-25,Safari5.1-6 */
                //background: linear-gradient(to right, #cccccc 0%,#dddddd 10%,#dddddd 90%,#cccccc 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
                //filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#cccccc', endColorstr='#cccccc',GradientType=1 ); /* IE6-9 */
            }

            li.today {
                background-color: map-get($main, 500);
            }

            li {
                height: 100%;
            }
        }
    }

    .dates {
        ul {
            li:nth-child(even) {
                /*<!--color: map-get($main, '800-contrast');-->*/
                /*<!--color: map-deep-get($main, 'contrast', '800'); -->*/
                color: map-get(map-get($main, "contrast"), 800);
            }

            li:nth-child(odd) {
                color: map-get(map-get($main, "contrast"), 900);
            }

            li.today {
                color: map-get(map-get($main, "contrast"), 500);
            }
        }
    }

    mat-chip.mat-chip {
        &.task-chip {
            background-color: map-get($opposing, lighter);
        }

        &.start-date-chip {
            background-color: map-get($opposing, lighter);
        }

        &.due-date-chip {
            background-color: map-get($opposing, lighter);
        }

        // overriding the darkening hover effect
        &.due-date-chip:hover::after {
            opacity: 0;
        }

        &.start-date-chip:hover::after {
            opacity: 0;
        }
    }
</style>
