/* Done using React-native */

const [searchDB,setSearchDB] = React.useState(buildData());
const searchItem = text => {
    if (isMountedRef.current) { /* To prevent Memory Leaks */
      setSearchText(text);/* Show text changes */
      
      const newData = searchDB.filter(item => { /*Run through array and return a new array */
        const itemData = `${item.activityTitle.toUpperCase()}   
      ${item.activityDate.toUpperCase()} ${item.scheduleDate.toUpperCase()}  ${item.deadline.toUpperCase()} ${item.updatedName.toUpperCase()}  ${item.typeOfActivity.toUpperCase()} `;
      /* The itemdata contains search columns */
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1; /*Check whether text exists in object */
      });
      setPaginationData(newData);/*Updating Display Data */
    }
  };
