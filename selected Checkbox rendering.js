/* Pass to Component an object which has your prefered style, For me it is */

const selected: {
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderColor: 'purple',
  },
  
  const paginationData = {otherProperties:values,...,isSelect:false,selectedClass:null}
const selectItem = value => { // get The selected Object
    if (isMountedRef.current) { // Prevent memory leaks
      const data = { ...value }; // Make a copy of the selected Object
      
      /* These Two Properties are required to be added to your existing object */
      data.item.isSelect = !data.item.isSelect;
      data.item.selectedClass = data.item.isSelect ? styles.selected : null;

      /* Find the position of selected from entire data */
      const index = paginationData.findIndex(
        item => data.item._id === item._id,
      );
      const newData = [...paginationData];
      newData[index] = data.item;// Change Data
      setPaginationData(newData);
      onRowsSelect(newData.map(item => item.isSelect));//Used in case if want to pass selected object to a Parent Component for further processing
    }
  };
