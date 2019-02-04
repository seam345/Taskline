const RandomHelper = {
  binarySearch(list, value)
  {
    // initial values for start, middle and end
    let start  = 0;
    let stop   = list.length - 1;
    let middle = Math.floor(( start + stop ) / 2);

    // While the middle is not what we're looking for and the list does not have a single item
    while (list[middle] !== value && start < stop)
    {
      if ( value < list[middle] )
      {
        stop = middle - 1;
      } else
      {
        start = middle + 1;
      }

      // recalculate middle on every iteration
      middle = Math.floor(( start + stop ) / 2);
    }

    // if the current middle item is what we're looking for return it's index, else return -1
    return ( list[middle] !== value ) ? -1 : middle;
  },
};

const TaskHelper = {
  comparisonTaskGroup(a, b)
  {
    const same    = 0;
    const aHigher = -1;
    const bHigher = 1;

    let aTaskLength = a.tasks.length;
    let bTaskLength = b.tasks.length;

    if ( aTaskLength === 1 && bTaskLength === 1 )
    {
      // since start and end time are just iso strings i can use JS date for speed
      let aStartDate = new Date(a.tasks[0].startDate);
      let bStartDate = new Date(b.tasks[0].startDate);

      // check the start date the earlier it is the higher it is
      if ( aStartDate < bStartDate )
      {
        return aHigher;
      } else if ( aStartDate > bStartDate )
      {
        return bHigher;
      }

      let aEndDate = new Date(a.tasks[0].endDate);
      let bEndDate = new Date(b.tasks[0].endDate);

      console.log("onto higher");
      console.log(a.tasks[0].name);
      console.log(b.tasks[0].name);
      console.log(aEndDate);
      console.log(bEndDate);

      if ( aEndDate < bEndDate )
      {
        return aHigher;
      } else if ( aEndDate > bEndDate )
      {
        return bHigher;
      }
    }

    return same;
  },
  // Dirty because it makes a lot of assumptions, like all task groups have 1 task in them, this should probably always be encased in a try catch
  //todo consider a binary method, maybe test at what size that becomes useful
  dirtyComputeTaskPosition(left, taskGroupList)
  {
    for (let i = 0; i < taskGroupList.length; i++)
    {
      if ( left < taskGroupList[i].tasks[0].left )
      {
        return i;
      }
    }
    return taskGroupList.length;
  },

  dirtyComputeTaskPositionCheck(left, taskGroupList, lastPosition)
  {
    let isInCorrectPosition = true;
    if (lastPosition > 0)
    {
      if ( !(taskGroupList[lastPosition - 1].tasks[0].left <= left ))
      {
        isInCorrectPosition = false;
      }
    }

    // +1 here because length is 1 higher than the maximal index
    if (  lastPosition + 1 < taskGroupList.length )
    {
      if ( !(taskGroupList[lastPosition + 1].tasks[0].left >= left ))
      {
        isInCorrectPosition = false;
      }
    }
    return isInCorrectPosition;
  }

};

export {RandomHelper, TaskHelper};
